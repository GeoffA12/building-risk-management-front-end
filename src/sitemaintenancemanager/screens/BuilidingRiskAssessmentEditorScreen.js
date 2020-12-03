import React, { useState, useEffect, useContext, useRef } from 'react';
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
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash.isequal';
import AuthContext from '../../contexts/AuthContext';
import FormInput from '../../components/FormInput';
import RiskAssessment from '../../workplacehealthsafetymember/components/RiskAssessment';
import EnhancedPicker from '../../components/EnhancedPicker';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { BASE_URL } from '../../config/APIConfig';
import { useBuildingRiskAssessment } from '../hooks/BuildingRiskAssessmentModel';
import { useRiskAssessment } from '../../workplacehealthsafetymember/hooks/RiskAssessmentModel';
import {
    LIGHT_TEAL,
    LIGHT_GRAY,
    DARK_BLUE,
    DISABLED_BUTTON,
} from '../../styles/Colors';
import { navigationRoutes } from '../../config/NavConfig';
import EntityStatus from '../../components/EntityStatus';

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
        marginHorizontal: 5,
        paddingHorizontal: 2,
    },
    picker: {
        width: 175,
    },
    infoText: {
        textAlign: 'center',
        padding: 2,
        margin: 2,
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
    } = useBuildingRiskAssessment();
    const { riskAssessmentModel, setRiskAssessmentModel } = useRiskAssessment();

    const [
        buildingRiskAssessmentPlayground,
        setBuildingRiskAssessmentPlayground,
    ] = useState(cloneDeep(buildingRiskAssessmentModel));

    const [riskAssessmentPlayground, setRiskAssessmentPlayground] = useState(
        cloneDeep(riskAssessmentModel)
    );

    const [riskAssessments, setRiskAssessments] = useState([]);
    const [
        selectedSiteMaintenanceAssociate,
        setSelectedSiteMaintenanceAssociate,
    ] = useState('0');

    const [selectedBuilding, setSelectedBuilding] = useState('0');
    const [buildings, setBuildings] = useState([]);
    const [associates, setAssociates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [isDirty, setIsDirty] = useState(true);

    useEffect(() => {
        getRiskAssessments();
        getBuildings();
        getAssociates();
        if (route.params.buildingRiskAssessmentId) {
            setBuildingRiskAssessment();
            setRiskAssessment();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setBuildingRiskAssessmentPlayground(
            cloneDeep(buildingRiskAssessmentModel)
        );
        setSelectedBuilding(buildingRiskAssessmentModel.buildingId);
    }, [buildingRiskAssessmentModel]);

    useEffect(() => {
        setRiskAssessmentPlayground(cloneDeep(riskAssessmentModel));
        setSelectedSiteMaintenanceAssociate(
            riskAssessmentModel.siteMaintenanceAssociateIds[0]
        );
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
    }, [buildingRiskAssessmentPlayground, riskAssessmentPlayground]);

    useEffect(() => {
        setBuildingPickerOptions();
        setAssociatePickerOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildings, associates]);

    async function setBuildingRiskAssessment() {
        let response;
        setLoading(true);
        try {
            response = await axios.get(
                `${BASE_URL}/getBuildingRiskAssessmentById?id=${route.params.buildingRiskAssessmentId}`
            );
            if (error) {
                setError('');
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
            return;
        }
        setBuildingRiskAssessmentModel(response.data);
    }

    async function setRiskAssessment() {
        let response;
        try {
            setLoading(true);
            response = await axios.get(
                `${BASE_URL}/getRiskAssessmentById?id=${route.params.riskAssessmentId}`
            );
            if (error) {
                setError('');
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
        }
        setLoading(false);
        const existingRiskAssessment = response.data;
        setRiskAssessmentModel(existingRiskAssessment);
    }

    async function getRiskAssessments() {
        let riskAssessmentPages;
        setLoading(true);
        try {
            riskAssessmentPages = await axios.post(
                `${BASE_URL}/getRiskAssessmentsBySite`,
                {
                    pageInput: {
                        sortBy: 'updatedAt',
                        sortDirection: 'DESC',
                    },
                    associatedSiteIds: user.associatedSiteIds,
                }
            );
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
        const riskAssessmentData = riskAssessmentPages.data.riskassessments;
        setRiskAssessments(riskAssessmentData);
    }

    async function getBuildings() {
        let response;
        setLoading(true);
        try {
            response = await axios.post(`${BASE_URL}/getBuildingsBySite`, {
                associatedSiteIds: user.associatedSiteIds,
            });
            if (error) {
                setError('');
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        setBuildings(response.data);
    }

    async function getAssociates() {
        let response;
        setLoading(true);
        try {
            response = await axios.post(
                `${BASE_URL}/getSiteMaintenanceAssociatesBySite`,
                {
                    associatedSiteIds: user.associatedSiteIds,
                }
            );
            if (error) {
                setError('');
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        setAssociates(response.data);
    }

    function handleRefresh() {
        setRefreshing(true);
        getRiskAssessments();
        setRefreshing(false);
    }

    function handleBuildingRiskAssessmentPlaygroundChange(fieldKey, value) {
        setBuildingRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    function handleRiskAssessmentPlaygroundChange(fieldKey, value) {
        setRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    async function handleSaveBuildingAssessment() {
        let response;
        let uri;
        let inputObject;
        if (route.params.buildingRiskAssessmentId) {
            (uri = '/updateBuildingRiskAssessment'),
                (inputObject = {
                    id: route.params.buildingRiskAssessmentId,
                    publisherId: user.id,
                    riskAssessmentIds:
                        buildingRiskAssessmentPlayground.riskAssessmentIds,
                    siteMaintenanceAssociateIds:
                        riskAssessmentPlayground.siteMaintenanceAssociateIds,
                    buildingId: buildingRiskAssessmentPlayground.buildingId,
                    title: buildingRiskAssessmentPlayground.title,
                    description: buildingRiskAssessmentPlayground.description,
                    workOrder: riskAssessmentPlayground.workOrder,
                });
        } else {
            uri = '/createBuildingRiskAssessment';
            inputObject = {
                publisherId: user.id,
                riskAssessmentIds:
                    buildingRiskAssessmentPlayground.riskAssessmentIds,
                siteMaintenanceAssociateIds:
                    riskAssessmentPlayground.siteMaintenanceAssociateIds,
                buildingId: buildingRiskAssessmentPlayground.buildingId,
                title: buildingRiskAssessmentPlayground.title,
                description: buildingRiskAssessmentPlayground.description,
                workOrder: riskAssessmentPlayground.workOrder,
            };
        }
        setLoading(true);
        try {
            response = await axios.post(`${BASE_URL}/${uri}`, inputObject);
            if (error) {
                setError('');
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        navigation.navigate(navigationRoutes.BUILDINGRISKASSESSMENTEDITOR, {
            buildingRiskAssessmentId: response.data.id,
            riskAssessmentId:
                buildingRiskAssessmentPlayground.riskAssessmentIds[0],
        });
    }

    function handleDeleteBuildingAssessment() {
        console.log('Building assessment deleted');
    }

    function handleSiteMaintenanceAssociateValueChange(val) {
        if (val !== '0') {
            setSelectedSiteMaintenanceAssociate(val);
            setRiskAssessmentPlayground((prevPlayground) => {
                const updatedPlayground = { ...prevPlayground };
                updatedPlayground.siteMaintenanceAssociateIds = [val];
                return updatedPlayground;
            });
        }
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

    function setAssociatePickerOptions() {
        const pickerOptions = [];
        pickerOptions.push({
            label: 'Associates',
            value: '0',
        });
        for (let x = 0; x < associates.length; ++x) {
            const currentAssociate = associates[x];
            const option = {
                label:
                    currentAssociate.firstName +
                    ' ' +
                    currentAssociate.lastName,
                value: currentAssociate.id,
            };
            pickerOptions.push(option);
        }
        return pickerOptions;
    }

    function handleRiskAssessmentCardPress(assessment, isActive, index) {
        setBuildingRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            if (isActive) {
                if (!updatedPlayground.riskAssessmentIds) {
                    updatedPlayground.riskAssessmentIds = [assessment.id];
                } else {
                    updatedPlayground.riskAssessmentIds.splice(
                        index,
                        0,
                        assessment.id
                    );
                }
            } else {
                updatedPlayground.riskAssessmentIds.splice(
                    // updatedPlayground.riskAssessmentIds.findIndex(
                    //     (existingAssessment) =>
                    //         assessment.id === existingAssessment.id
                    // ),
                    index,
                    1
                );
            }
            return updatedPlayground;
        });
    }

    function validateBuildingRiskAssessmentPlayground() {
        let isValid = false;
        if (buildingRiskAssessmentPlayground) {
            if (
                buildingRiskAssessmentPlayground.buildingId &&
                buildingRiskAssessmentPlayground.title &&
                buildingRiskAssessmentPlayground.description &&
                riskAssessmentPlayground.workOrder &&
                buildingRiskAssessmentPlayground.riskAssessmentIds &&
                riskAssessmentPlayground.siteMaintenanceAssociateIds
            ) {
                if (
                    buildingRiskAssessmentPlayground.riskAssessmentIds.length >
                        0 &&
                    riskAssessmentPlayground.siteMaintenanceAssociateIds
                        .length > 0
                ) {
                    isValid = true;
                }
            }
        }
        return isValid;
    }

    const initialRender = useRef(false);

    function renderRiskAssessment({ item: existingRiskAssessment, index }) {
        if (!route.params.buildingRiskAssessmentId) {
            return (
                <RiskAssessment
                    riskAssessment={existingRiskAssessment}
                    onPress={handleRiskAssessmentCardPress}
                    activeView={true}
                    index={index}
                />
            );
        }
        if (buildingRiskAssessmentModel.riskAssessmentIds.length > 0) {
            return (
                <RiskAssessment
                    riskAssessment={existingRiskAssessment}
                    onPress={handleRiskAssessmentCardPress}
                    activeView={true}
                    index={index}
                    wasPreviouslySelected={buildingRiskAssessmentModel.riskAssessmentIds.includes(
                        existingRiskAssessment.id
                    )}
                />
            );
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.splitContainer}>
                <View style={styles.buttonRow}>
                    {/* {route.params.buildingRiskAssessmentId ? (
                        <TouchableOpacity
                            onPress={handleDeleteBuildingAssessment}
                            style={
                                validateBuildingRiskAssessmentPlayground() &&
                                isDirty
                                    ? styles.iconButton
                                    : styles.disabledIconButton
                            }
                            disabled={
                                validateBuildingRiskAssessmentPlayground() &&
                                isDirty
                            }>
                            <Icon
                                name="trash"
                                size={22}
                                style={styles.iconStyle}
                            />
                            <Text style={styles.iconButtonText}>
                                Delete Assessment
                            </Text>
                        </TouchableOpacity>
                    ) : null} */}
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
                            onChange={handleSiteMaintenanceAssociateValueChange}
                            currentRoleSelected={
                                selectedSiteMaintenanceAssociate
                            }
                            pickerOptions={setAssociatePickerOptions()}
                            prompt={'Select Maintenance Associate'}
                            style={styles.picker}
                        />
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
                <View style={styles.inputRow}>
                    <FormInput
                        style={styles.halfFormInput}
                        placeholder={'Work order'}
                        placeholderTextColor={`${LIGHT_TEAL}`}
                        onChangeText={(val) =>
                            handleRiskAssessmentPlaygroundChange(
                                'workOrder',
                                val
                            )
                        }
                        value={
                            riskAssessmentPlayground.workOrder
                                ? riskAssessmentPlayground.workOrder.toString()
                                : ''
                        }
                    />
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.infoText}>
                    Tap risk assessment to add to buliding assessment
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
