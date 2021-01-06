import React, { useState, useEffect, useContext } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    LogBox,
} from 'react-native';
import Icon from 'react-native-ionicons';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash.isequal';
import AuthContext from '../../auth/contexts/AuthContext';
import FormInput from '../../common/components/FormInput';
import RiskAssessment from '../../riskassessment/components/RiskAssessment';
import EnhancedPicker from '../../common/components/EnhancedPicker';
import Loading from '../../common/components/Loading';
import Error from '../../common/components/Error';
import EntityStatus from '../../common/components/EntityStatus';
import RiskAssessmentSchedule from '../components/RiskAssessmentSchedule';
import { useBuildingRiskAssessment } from '../hooks/BuildingRiskAssessmentHooks';
import { useRiskAssessment } from '../../riskassessment/hooks/RiskAssessmentHooks';
import { useRiskAssessmentSchedule } from '../hooks/RiskAssessmentScheduleHooks';
import { useAPI } from '../../common/hooks/API';
import { buildingRiskAssessmentUtils } from '../utils/BuildingRiskAssessmentUtils';
import {
    LIGHT_TEAL,
    LIGHT_GRAY,
    DARK_BLUE,
    DISABLED_BUTTON,
} from '../../common/styles/Colors';
import { navigationRoutes } from '../../config/NavConfig';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    splitContainer: {
        flex: 1,
        margin: 2,
    },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'stretch',
        marginVertical: 7,
    },
    iconButton: {
        backgroundColor: `${DARK_BLUE}`,
        margin: 3,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 5,
    },
    iconButtonText: {
        color: `${LIGHT_GRAY}`,
        fontSize: 16,
        paddingHorizontal: 9,
        paddingVertical: 3,
        flexDirection: 'row',
    },
    disabledIconButton: {
        backgroundColor: `${DISABLED_BUTTON}`,
        margin: 3,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 5,
    },
    iconStyle: {
        color: `${LIGHT_GRAY}`,
        paddingVertical: 3,
        paddingHorizontal: 4,
    },
    inputRow: {
        margin: 6,
        padding: 2,
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    formInput: {
        backgroundColor: `${DARK_BLUE}`,
        color: `${LIGHT_TEAL}`,
        margin: 2,
        flex: 1,
    },
    halfFormInput: {
        backgroundColor: `${DARK_BLUE}`,
        color: `${LIGHT_TEAL}`,
        margin: 2,
        width: '50%',
    },
    pickerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        padding: 4,
    },
    picker: {
        width: 300,
    },
    infoText: {
        textAlign: 'center',
        padding: 6,
        marginVertical: 3,
        fontSize: 17,
        fontWeight: '700',
        color: `${DARK_BLUE}`,
    },
    flatListContainer: {
        marginHorizontal: 4,
        padding: 1,
    },
});

const BuildingRiskAssessmentEditorScreen = ({ navigation, route }) => {
    LogBox.ignoreAllLogs();
    const { user } = useContext(AuthContext);
    const {
        buildingRiskAssessmentModel,
        setBuildingRiskAssessmentModel,
        getBuildings,
        saveBuildingRiskAssessment,
        getBuildingRiskAssessment,
    } = useBuildingRiskAssessment();
    const { riskAssessmentModel, getRiskAssessments } = useRiskAssessment();
    const {
        getRiskAssessmentSchedulesByBuildingRiskAssessmentId,
        getRiskAssessmentSchedulesByRiskAssessmentIdListOfBuilding,
        getRiskAssessmentSchedule,
        deleteRiskAssessmentSchedule,
        attachBuildingRiskAssessmentIdToRiskAssessmentSchedules,
    } = useRiskAssessmentSchedule();
    const { error, setError, loading, setLoading } = useAPI();

    const { formatRiskAssessmentSchedules } = buildingRiskAssessmentUtils();

    const [
        buildingRiskAssessmentPlayground,
        setBuildingRiskAssessmentPlayground,
    ] = useState(cloneDeep(buildingRiskAssessmentModel));

    const [riskAssessmentPlayground, setRiskAssessmentPlayground] = useState(
        cloneDeep(riskAssessmentModel)
    );

    const [riskAssessmentSchedules, setRiskAssessmentSchedules] = useState([]);

    const [riskAssessments, setRiskAssessments] = useState([]);

    const [selectedBuilding, setSelectedBuilding] = useState('0');
    const [buildings, setBuildings] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isDirty, setIsDirty] = useState(true);

    useEffect(() => {
        loadRiskAssessments();
        loadBuildings();
        if (route.params.buildingRiskAssessmentId) {
            loadBuildingRiskAssessment(route.params.buildingRiskAssessmentId);
            loadRiskAssessmentSchedules(route.params.buildingRiskAssessmentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Can receive an index, riskAssessmentSchedule, or riskAssessmentId as a route parameter.

    useEffect(() => {
        console.log(route);
        if (route.params.riskAssessmentId) {
            setBuildingRiskAssessmentPlaygroundRiskAssessmentIds(
                route.params.riskAssessmentId
            );
        }
        // In edit view, load the risk assessment schedules once we've returned from the schedule editor.
        if (route.params.buildingRiskAssessmentId) {
            loadBuildingRiskAssessment(route.params.buildingRiskAssessmentId);
            loadRiskAssessmentSchedules(route.params.buildingRiskAssessmentId);
        } else {
            if (route.params.riskAssessmentScheduleIdToFetch) {
                loadSingleRiskAssessmentSchedule(
                    route.params.riskAssessmentScheduleIdToFetch,
                    route.params.index
                );
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

    useEffect(() => {
        setBuildingRiskAssessmentPlayground(
            cloneDeep(buildingRiskAssessmentModel)
        );
        setSelectedBuilding(buildingRiskAssessmentModel.buildingId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildingRiskAssessmentModel]);

    useEffect(() => {
        setRiskAssessmentPlayground(cloneDeep(riskAssessmentModel));
    }, [riskAssessmentModel]);

    useEffect(() => {
        if (
            isEqual(
                buildingRiskAssessmentPlayground,
                buildingRiskAssessmentModel
            ) &&
            isEqual(riskAssessmentPlayground, riskAssessmentModel)
        ) {
            setIsDirty(false);
        } else {
            setIsDirty(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        buildingRiskAssessmentPlayground,
        riskAssessmentPlayground,
        riskAssessmentSchedules,
    ]);

    useEffect(() => {
        setBuildingPickerOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildings]);

    async function loadBuildingRiskAssessment(buildingRiskAssessmentId) {
        setLoading(true);
        const buildingRiskAssessmentResponse = await getBuildingRiskAssessment(
            buildingRiskAssessmentId
        );
        setLoading(false);
        if (!buildingRiskAssessmentResponse.data) {
            console.error(buildingRiskAssessmentResponse.error);
            setError(buildingRiskAssessmentResponse.error.message);
        } else {
            setBuildingRiskAssessmentModel(buildingRiskAssessmentResponse.data);
        }
    }

    async function loadSingleRiskAssessmentSchedule(
        riskAssessmentScheduleId,
        indexToUpdate
    ) {
        setLoading(true);
        const riskAssessmentScheduleResponse = await getRiskAssessmentSchedule(
            riskAssessmentScheduleId
        );
        setLoading(false);
        if (!riskAssessmentScheduleResponse.data) {
            console.error(riskAssessmentScheduleResponse.error);
            setError(riskAssessmentScheduleResponse.error.message);
        } else {
            const newRiskAssessmentSchedule =
                riskAssessmentScheduleResponse.data;
            if (
                !containsObject(
                    riskAssessmentSchedules,
                    newRiskAssessmentSchedule
                )
            ) {
                setRiskAssessmentSchedules((prevSchedules) => {
                    let updatedSchedules;
                    if (prevSchedules.length > 0) {
                        if (indexToUpdate || indexToUpdate === 0) {
                            updatedSchedules = [...prevSchedules];
                            updatedSchedules[
                                indexToUpdate
                            ] = newRiskAssessmentSchedule;
                        } else {
                            updatedSchedules = [
                                ...prevSchedules,
                                newRiskAssessmentSchedule,
                            ];
                        }
                    } else {
                        updatedSchedules = [newRiskAssessmentSchedule];
                    }
                    return updatedSchedules;
                });
            }
        }
    }

    async function loadRiskAssessmentSchedules(buildingRiskAssessmentId) {
        setLoading(true);
        const riskAssessmentSchedulesResponse = await getRiskAssessmentSchedulesByBuildingRiskAssessmentId(
            buildingRiskAssessmentId
        );
        setLoading(false);
        if (!riskAssessmentSchedulesResponse.data) {
            console.error(riskAssessmentSchedulesResponse.error);
            setError(riskAssessmentSchedulesResponse.error.message);
        } else {
            const formattedRiskAssessmentSchedules = formatRiskAssessmentSchedules(
                riskAssessmentSchedulesResponse.data
            );
            setRiskAssessmentSchedules(formattedRiskAssessmentSchedules);
        }
    }

    async function loadRiskAssessments() {
        setLoading(true);
        const riskAssessmentsResponse = await getRiskAssessments(
            user.associatedSiteIds
        );
        setLoading(false);
        if (riskAssessmentsResponse.data) {
            setRiskAssessments(riskAssessmentsResponse.data.riskassessments);
        } else {
            console.error(riskAssessmentsResponse.error);
            setError(riskAssessmentsResponse.error.message);
        }
    }

    async function loadBuildings() {
        setLoading(true);
        const buildingResponse = await getBuildings(user.associatedSiteIds);
        setLoading(false);
        if (buildingResponse.data) {
            setBuildings(buildingResponse.data);
        } else {
            console.error(buildingResponse.error);
            setError(buildingResponse.error.message);
        }
    }

    function setBuildingRiskAssessmentPlaygroundRiskAssessmentIds(
        riskAssessmentId
    ) {
        let updatedRiskAssessmentIds = [
            ...buildingRiskAssessmentPlayground.riskAssessmentIds,
        ];
        if (buildingRiskAssessmentPlayground.riskAssessmentIds.length === 0) {
            updatedRiskAssessmentIds = [riskAssessmentId];
        } else {
            if (
                !buildingRiskAssessmentPlayground.riskAssessmentIds.includes(
                    riskAssessmentId
                )
            ) {
                updatedRiskAssessmentIds = [
                    ...buildingRiskAssessmentPlayground.riskAssessmentIds,
                    riskAssessmentId,
                ];
            }
        }
        handleBuildingRiskAssessmentPlaygroundChange(
            'riskAssessmentIds',
            updatedRiskAssessmentIds
        );
    }

    function handleRefresh() {
        setRefreshing(true);
        getRiskAssessments();
        setRefreshing(false);
    }

    function containsObject(array, object) {
        for (let x = 0; x < array.length; ++x) {
            if (array[x] === object) {
                return true;
            }
        }
        return false;
    }

    function handleBuildingRiskAssessmentPlaygroundChange(fieldKey, value) {
        setBuildingRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    // TODO: After saving the building assessment (confirm that the right risk assessment id's are maintained), make sure to use the attach BRA id to
    // risk assessment schedules API so that we can search for all RA schedules when this page loads in read/updated mode.
    async function handleSaveBuildingAssessment() {
        let uri;
        let inputObject;
        if (route.params.buildingRiskAssessmentId) {
            uri = '/updateBuildingRiskAssessment';
            inputObject = {
                id: route.params.buildingRiskAssessmentId,
                publisherId: user.id,
                buildingId: buildingRiskAssessmentPlayground.buildingId,
                title: buildingRiskAssessmentPlayground.title,
                description: buildingRiskAssessmentPlayground.description,
                riskAssessmentIds:
                    buildingRiskAssessmentPlayground.riskAssessmentIds,
            };
        } else {
            uri = '/createBuildingRiskAssessment';
            inputObject = {
                publisherId: user.id,
                buildingId: buildingRiskAssessmentPlayground.buildingId,
                title: buildingRiskAssessmentPlayground.title,
                description: buildingRiskAssessmentPlayground.description,
                riskAssessmentIds:
                    buildingRiskAssessmentPlayground.riskAssessmentIds,
            };
        }
        setLoading(true);
        const buildingRiskAssessmentResponse = await saveBuildingRiskAssessment(
            uri,
            inputObject
        );
        setLoading(false);

        if (!buildingRiskAssessmentResponse.data) {
            console.error(buildingRiskAssessmentResponse.error);
            setError(buildingRiskAssessmentResponse.error.message);
        } else {
            setLoading(true);
            const attachBuildingRiskAssessmentIdToRiskAssessmentSchedulesResponse = await attachBuildingRiskAssessmentIdToRiskAssessmentSchedules(
                riskAssessmentSchedules,
                user.id,
                buildingRiskAssessmentResponse.data.id
            );
            setLoading(false);
            if (
                !attachBuildingRiskAssessmentIdToRiskAssessmentSchedulesResponse.data
            ) {
                console.error(
                    attachBuildingRiskAssessmentIdToRiskAssessmentSchedulesResponse.error
                );
                setError(
                    attachBuildingRiskAssessmentIdToRiskAssessmentSchedulesResponse
                        .error.message
                );
            } else {
                console.log(
                    attachBuildingRiskAssessmentIdToRiskAssessmentSchedulesResponse.data
                );
                navigation.navigate(
                    navigationRoutes.BUILDINGRISKASSESSMENTEDITOR,
                    {
                        buildingRiskAssessmentId:
                            buildingRiskAssessmentResponse.data.id,
                    }
                );
            }
        }
        // navigation.navigate(navigationRoutes.BUILDINGRISKASSESSMENTEDITOR, {
        //     buildingRiskAssessmentId: response.data.id,
        //     riskAssessmentId:
        //         buildingRiskAssessmentPlayground.riskAssessmentIds[0],
        // });
    }

    function handleBuildingValueChange(val) {
        if (val !== '0') {
            setSelectedBuilding(val);
            setBuildingRiskAssessmentPlayground((prevPlayground) => {
                const updatedPlayground = { ...prevPlayground };
                updatedPlayground.buildingId = val;
                return updatedPlayground;
            });
        }
    }

    function setBuildingPickerOptions() {
        const pickerOptions = [];
        pickerOptions.push({
            label: 'Buildings',
            value: '0',
        });
        for (let x = 0; x < buildings.length; ++x) {
            const currentBuilding = buildings[x];
            const option = {
                label: currentBuilding.name + ' ' + currentBuilding.code,
                value: currentBuilding.id,
            };
            pickerOptions.push(option);
        }
        return pickerOptions;
    }

    function handleRiskAssessmentCardPress(assessment) {
        navigation.navigate(
            navigationRoutes.RISKASSESSMENTSCHEDULEEDITORSCREEN,
            {
                riskAssessmentId: assessment.id,
            }
        );
    }

    function validateBuildingRiskAssessmentPlayground() {
        let isValid = false;
        if (buildingRiskAssessmentPlayground) {
            if (
                buildingRiskAssessmentPlayground.buildingId &&
                buildingRiskAssessmentPlayground.title &&
                buildingRiskAssessmentPlayground.description &&
                buildingRiskAssessmentPlayground.riskAssessmentIds
            ) {
                if (
                    buildingRiskAssessmentPlayground.riskAssessmentIds.length >
                        0 &&
                    riskAssessmentSchedules.length > 0
                ) {
                    isValid = true;
                }
            }
        }
        return isValid;
    }

    async function handleRiskAssessmentScheduleCancelPress(index) {
        const riskAssessmentScheduleToBeDeleted =
            riskAssessmentSchedules[index];
        const targetRiskAssessmentId =
            riskAssessmentScheduleToBeDeleted.riskAssessmentId;
        let targetRiskAssessmentIds = [];
        for (let x = 0; x < riskAssessmentSchedules.length; ++x) {
            if (
                riskAssessmentSchedules[x].riskAssessmentId ===
                targetRiskAssessmentId
            ) {
                targetRiskAssessmentIds.push(riskAssessmentSchedules[x]);
            }
        }
        // Remove the risk assessment Id from the building risk assessment model
        if (targetRiskAssessmentIds.length < 2) {
            let updatedRiskAssessmentIds = [
                ...buildingRiskAssessmentPlayground.riskAssessmentIds,
            ];
            updatedRiskAssessmentIds.splice(
                updatedRiskAssessmentIds.indexOf((schedule) => {
                    schedule.riskAssessmentId === targetRiskAssessmentId;
                }),
                1
            );
            handleBuildingRiskAssessmentPlaygroundChange(
                'riskAssessmentIds',
                updatedRiskAssessmentIds
            );
        }

        setLoading(true);
        const deletedRiskAssessmentScheduleResponse = await deleteRiskAssessmentSchedule(
            riskAssessmentScheduleToBeDeleted.id,
            user.id
        );
        setLoading(false);
        if (!deletedRiskAssessmentScheduleResponse.data) {
            console.error(deletedRiskAssessmentScheduleResponse.error);
            setError(deletedRiskAssessmentScheduleResponse.error.message);
        } else {
            console.log(deletedRiskAssessmentScheduleResponse.data);
            setRiskAssessmentSchedules((prevSchedules) => {
                let updatedSchedules = [...prevSchedules];
                updatedSchedules.splice(index, 1);
                return updatedSchedules;
            });
        }
    }

    function handleRiskAssessmentScheduleEditPress(schedule, index) {
        navigation.navigate(
            navigationRoutes.RISKASSESSMENTSCHEDULEEDITORSCREEN,
            {
                riskAssessmentScheduleId: schedule.id,
                riskAssessmentId: schedule.riskAssessmentId,
                index: index,
            }
        );
    }

    function renderRiskAssessmentSchedules() {
        if (riskAssessmentSchedules.length > 0) {
            return riskAssessmentSchedules.map((schedule, index) => {
                return (
                    <RiskAssessmentSchedule
                        schedule={schedule}
                        index={index}
                        cancelPress={handleRiskAssessmentScheduleCancelPress}
                        editPress={handleRiskAssessmentScheduleEditPress}
                    />
                );
            });
        }
    }

    function renderRiskAssessment({ item: existingRiskAssessment }) {
        return (
            <RiskAssessment
                riskAssessment={existingRiskAssessment}
                onPress={handleRiskAssessmentCardPress}
            />
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.splitContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={handleSaveBuildingAssessment}
                        style={
                            validateBuildingRiskAssessmentPlayground() &&
                            isDirty
                                ? styles.iconButton
                                : styles.disabledIconButton
                        }
                        disabled={
                            !(
                                validateBuildingRiskAssessmentPlayground() &&
                                isDirty
                            )
                        }>
                        <Icon name="save" size={22} style={styles.iconStyle} />
                        <Text style={styles.iconButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {route.params.buildingRiskAssessmentId &&
            buildingRiskAssessmentPlayground.entityTrail &&
            buildingRiskAssessmentPlayground.entityTrail.length > 0 ? (
                <EntityStatus
                    entityName={'Building Assessment'}
                    publisherId={
                        buildingRiskAssessmentPlayground.entityTrail[
                            buildingRiskAssessmentPlayground.entityTrail
                                .length - 1
                        ].userId
                    }
                    updatedAt={buildingRiskAssessmentPlayground.updatedAt}
                />
            ) : null}
            <Error errorMessage={error} />
            <View style={styles.splitContainer}>
                <View style={styles.inputRow}>
                    <FormInput
                        style={styles.formInput}
                        placeholder={'Title'}
                        placeholderTextColor={`${LIGHT_TEAL}`}
                        onChangeText={(val) =>
                            handleBuildingRiskAssessmentPlaygroundChange(
                                'title',
                                val
                            )
                        }
                        value={buildingRiskAssessmentPlayground.title}
                    />
                </View>
                <View style={styles.inputRow}>
                    <FormInput
                        style={styles.formInput}
                        placeholder={'Description'}
                        placeholderTextColor={`${LIGHT_TEAL}`}
                        onChangeText={(val) =>
                            handleBuildingRiskAssessmentPlaygroundChange(
                                'description',
                                val
                            )
                        }
                        value={buildingRiskAssessmentPlayground.description}
                    />
                </View>
                <View style={styles.inputRow}>
                    <View style={styles.pickerContainer}>
                        <EnhancedPicker
                            onChange={handleBuildingValueChange}
                            currentRoleSelected={selectedBuilding}
                            pickerOptions={setBuildingPickerOptions()}
                            prompt={'Select Building'}
                            style={styles.picker}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.container}>
                {riskAssessmentSchedules.length > 0 ? (
                    <Text style={styles.infoText}>
                        Building assessment schedules:
                    </Text>
                ) : null}
                {renderRiskAssessmentSchedules()}
            </View>
            <View style={styles.container}>
                <Text style={styles.infoText}>
                    Tap risk assessment to view details and add new schedule to
                    building assessment
                </Text>
            </View>
            <View style={styles.splitContainer}>
                <FlatList
                    data={riskAssessments}
                    renderItem={renderRiskAssessment}
                    keyExtractor={(riskAssessmentInList) =>
                        riskAssessmentInList.id
                    }
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    nestedScrollEnabled={true}
                    style={styles.flatListContainer}
                />
            </View>
            <Loading loading={loading} />
        </ScrollView>
    );
};

export default BuildingRiskAssessmentEditorScreen;
