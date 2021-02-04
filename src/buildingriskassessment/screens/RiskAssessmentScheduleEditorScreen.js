import React, { useState, useEffect, useContext } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    Modal,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import cloneDeep from 'lodash/cloneDeep';
import Icon from 'react-native-ionicons';
import MultiSelect from 'react-native-multiple-select';
import RiskAssessmentEditorScreen from '../../riskassessment/screens/RiskAssessmentEditorScreen';
import AuthContext from '../../auth/contexts/AuthContext';
import StyledButton from '../../common/components/StyledButton';
import Loading from '../../common/components/Loading';
import Error from '../../common/components/Error';
import FormInput from '../../common/components/FormInput';
import Hazard from '../components/Hazard';
import Screener from '../components/Screener';
import HazardEditor from '../components/HazardEditor';
import { useHazard } from '../hooks/HazardHooks';
import { useBuildingRiskAssessment } from '../hooks/BuildingRiskAssessmentHooks';
import { useRiskAssessmentSchedule } from '../hooks/RiskAssessmentScheduleHooks';
import { stringsEnum } from '../config/StringsEnum';
import { useAPI } from '../../common/hooks/API';
import { useNotifications } from '../../common/hooks/Notifications';
import { buildingRiskAssessmentUtils } from '../utils/BuildingRiskAssessmentUtils';
import {
    LIGHT_GRAY,
    DARK_BLUE,
    LIGHT_TEAL,
    BABY_BLUE,
    DARK_BABY_BLUE,
} from '../../common/styles/Colors';
import { navigationRoutes } from '../../config/NavConfig';

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        marginHorizontal: 6,
        marginVertical: 2,
    },
    sectionContainer: {
        marginVertical: 4,
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 3,
        justifyContent: 'space-evenly',
    },
    optionButton: {
        borderRadius: 10,
        width: '45%',
        margin: 5,
    },
    hideShowButton: {
        borderRadius: 10,
        width: '70%',
        margin: 4,
        padding: 2,
    },
    optionButtonText: {
        padding: 7,
        color: `${LIGHT_GRAY}`,
        fontSize: 17,
        fontWeight: '600',
    },
    iconButton: {
        backgroundColor: `${DARK_BLUE}`,
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        paddingHorizontal: 7,
        paddingVertical: 5,
    },
    iconStyle: {
        color: `${LIGHT_GRAY}`,
        paddingVertical: 3,
        paddingHorizontal: 3,
    },
    iconButtonText: {
        color: `${LIGHT_GRAY}`,
        fontSize: 15,
        paddingHorizontal: 4,
        paddingVertical: 3,
        flexDirection: 'row',
    },
    multiSelectRow: {
        flex: 1,
        marginTop: 6,
        marginHorizontal: 6,
        padding: 3,
    },
    dropdownMenu: {
        padding: 4,
        margin: 2,
    },
    dropdownSubsection: {
        backgroundColor: `${BABY_BLUE}`,
        borderRadius: 8,
        paddingHorizontal: 6,
    },
    dropdownInputGroup: {
        backgroundColor: `${DARK_BABY_BLUE}`,
        borderRadius: 8,
    },
    workOrderInput: {
        marginHorizontal: 12,
        marginBottom: 4,
        padding: 4,
        backgroundColor: `${DARK_BLUE}`,
        color: `${LIGHT_GRAY}`,
        width: '45%',
    },
    titleInput: {
        marginHorizontal: 12,
        marginBottom: 4,
        width: '70%',
        padding: 4,
        backgroundColor: `${DARK_BLUE}`,
        color: `${LIGHT_GRAY}`,
    },
    headerAlignment: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        padding: 4,
        color: `${DARK_BLUE}`,
    },
});

const RiskAssessmentScheduleEditorScreen = ({ navigation, route }) => {
    const { user } = useContext(AuthContext);
    const { error, setError, loading, setLoading } = useAPI();
    const { getSiteMaintenanceAssociates } = useBuildingRiskAssessment();

    const {
        riskAssessmentScheduleModel,
        setRiskAssessmentScheduleModel,
        riskAssessmentSchedulePlayground,
        setRiskAssessmentSchedulePlayground,
        createRiskAssessmentSchedule,
        updateRiskAssessmentSchedule,
        getRiskAssessmentSchedule,
    } = useRiskAssessmentSchedule();

    const { formatDueDate } = buildingRiskAssessmentUtils();
    const { createScheduledNotification } = useNotifications();
    const [hazardIndex, setHazardIndex] = useState(-1);
    const { hazardModel } = useHazard();
    const [hazardDetails, setHazardDetails] = useState({ ...hazardModel });

    const [scheduleEditorOpen, setScheduleEditorOpen] = useState(false);

    const [
        authenticatedSiteMaintenanceAssociates,
        setAuthenticatedSiteMaintenanceAssociates,
    ] = useState([]);

    const [dropdownAssociates, setDropdownAssociates] = useState([]);

    const [
        selectedSiteMaintenanceAssociates,
        setSelectedSiteMaintenanceAssociates,
    ] = useState([]);

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [modalOpen, setModalOpen] = useState(false);

    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    const [
        riskAssessmentDetailsTitle,
        setRiskAssessmentDetailsTitle,
    ] = useState(stringsEnum.HIDE_DETAILS);

    useEffect(() => {
        loadSiteMaintenanceAssociates();
        if (route.params.riskAssessmentScheduleId) {
            loadRiskAssessmentSchedule(route.params.riskAssessmentScheduleId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setRiskAssessmentSchedulePlayground(
            cloneDeep(riskAssessmentScheduleModel)
        );
        if (
            riskAssessmentScheduleModel.siteMaintenanceAssociateIds &&
            riskAssessmentScheduleModel.siteMaintenanceAssociateIds.length > 0
        ) {
            setSelectedSiteMaintenanceAssociates(
                riskAssessmentScheduleModel.siteMaintenanceAssociateIds
            );
        }
        if (riskAssessmentScheduleModel.dueDate) {
            setDate(new Date(riskAssessmentScheduleModel.dueDate));
            setTime(new Date(riskAssessmentScheduleModel.dueDate));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riskAssessmentScheduleModel]);

    useEffect(() => {
        if (route.params.riskAssessmentId) {
            setRiskAssessmentScheduleModel((prevModel) => {
                let updatedModel = { ...prevModel };
                updatedModel.riskAssessmentId = route.params.riskAssessmentId;
                return updatedModel;
            });
        }
        if (route.params.buildingRiskAssessmentId) {
            setRiskAssessmentScheduleModel((prevModel) => {
                let updatedModel = { ...prevModel };
                updatedModel.buildingRiskAssessmentId =
                    route.params.buildingRiskAssessmentId;
                return updatedModel;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

    useEffect(() => {
        const dropdownData = [];
        authenticatedSiteMaintenanceAssociates.map((associate) => {
            const dropdownAssociate = {
                id: associate.id,
                name: associate.firstName + ' ' + associate.lastName,
            };
            dropdownData.push(dropdownAssociate);
        });
        setDropdownAssociates(dropdownData);
    }, [authenticatedSiteMaintenanceAssociates]);

    useEffect(() => {
        if (date && time) {
            handleRiskAssessmentScheduleChange(
                'dueDate',
                formatDueDate(date, time)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, time]);

    useEffect(() => {
        if (
            selectedSiteMaintenanceAssociates &&
            selectedSiteMaintenanceAssociates.length > 0
        ) {
            handleRiskAssessmentScheduleChange(
                'siteMaintenanceAssociateIds',
                selectedSiteMaintenanceAssociates
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSiteMaintenanceAssociates]);

    async function loadRiskAssessmentSchedule(id) {
        setLoading(true);
        const riskAssessmentScheduleResponse = await getRiskAssessmentSchedule(
            id
        );
        setLoading(false);
        if (!riskAssessmentScheduleResponse.data) {
            console.error(riskAssessmentScheduleResponse.error);
            setError(riskAssessmentScheduleResponse.error.message);
        } else {
            let riskAssessmentSchedule = {
                ...riskAssessmentScheduleResponse.data,
            };
            riskAssessmentSchedule.dueDate = formatDueDate(
                new Date(riskAssessmentSchedule.dueDate)
            );
            setRiskAssessmentScheduleModel(riskAssessmentSchedule);
        }
    }

    async function loadSiteMaintenanceAssociates() {
        setLoading(true);
        const siteMaintenanceAssociatesResponse = await getSiteMaintenanceAssociates(
            user.associatedSiteIds
        );
        setLoading(false);
        if (siteMaintenanceAssociatesResponse.data) {
            setAuthenticatedSiteMaintenanceAssociates(
                siteMaintenanceAssociatesResponse.data
            );
        } else {
            console.error(siteMaintenanceAssociatesResponse.error);
            setError(siteMaintenanceAssociatesResponse.error.message);
        }
    }

    // TODO: Disable the save button if the input is incorrect or nothing on the schedule form has been changed
    async function handleSaveSchedulePress() {
        setLoading(true);
        let riskAssessmentScheduleIdToFetch;
        if (route.params.riskAssessmentScheduleId) {
            const updateRiskAssessmentScheduleResponse = await updateRiskAssessmentSchedule(
                user.id,
                route.params.riskAssessmentScheduleId,
                riskAssessmentSchedulePlayground
            );
            if (!updateRiskAssessmentScheduleResponse.data) {
                console.error(updateRiskAssessmentScheduleResponse.error);
                setError(updateRiskAssessmentScheduleResponse.error.message);
                setLoading(false);
                return;
            } else {
                riskAssessmentScheduleIdToFetch =
                    updateRiskAssessmentScheduleResponse.data.id;
            }
        } else {
            const createRiskAssessmentScheduleResponse = await createRiskAssessmentSchedule(
                riskAssessmentSchedulePlayground,
                user.id
            );
            if (!createRiskAssessmentScheduleResponse.data) {
                console.error(createRiskAssessmentScheduleResponse.error);
                setError(createRiskAssessmentScheduleResponse.error.message);
                setLoading(false);
                return;
            } else {
                riskAssessmentScheduleIdToFetch =
                    createRiskAssessmentScheduleResponse.data.id;
            }
        }
        setLoading(false);
        createScheduledNotification(
            'Risk assessment schedule saved!',
            'Your risk assessment schedule was successfully saved.',
            1
        );
        navigation.navigate(navigationRoutes.BUILDINGRISKASSESSMENTEDITOR, {
            buildingRiskAssessmentId: route.params.buildingRiskAssessmentId,
            riskAssessmentId: route.params.riskAssessmentId,
            riskAssessmentScheduleIdToFetch: riskAssessmentScheduleIdToFetch,
            index: route.params.index,
        });
    }

    function handleRiskAssessmentScheduleChange(fieldKey, val) {
        setRiskAssessmentSchedulePlayground((prevPlayground) => {
            const updatedScheduleModel = { ...prevPlayground };
            updatedScheduleModel[fieldKey] = val;
            return updatedScheduleModel;
        });
    }

    function handleAddSchedulePress() {
        setScheduleEditorOpen((prevScheduleEditorMode) => {
            return !prevScheduleEditorMode;
        });
    }

    function handleCancelSchedulePress() {
        setScheduleEditorOpen((prevScheduleEditorMode) => {
            return !prevScheduleEditorMode;
        });
    }

    function onDateTimeChange(event, selectedValue) {
        if (mode === 'date') {
            const currentDate = selectedValue || date;
            setDate(currentDate);
            setMode('time');
            setShowDateTimePicker(Platform.OS === 'ios');
        } else {
            const selectedTime = selectedValue || time;
            setTime(selectedTime);
            setMode('date');
            setShowDateTimePicker(Platform.OS === 'ios');
        }
    }

    function showMode(currentMode) {
        setShowDateTimePicker(true);
        setMode(currentMode);
    }

    function handleDateSwitch() {
        showMode('date');
    }

    function handleTimeSwitch() {
        showMode('time');
    }

    function handleRiskAssessmentDetailsPress() {
        setRiskAssessmentDetailsTitle((prevTitle) => {
            let updatedTitle = '';
            if (prevTitle === stringsEnum.SHOW_DETAILS) {
                updatedTitle = stringsEnum.HIDE_DETAILS;
            } else {
                updatedTitle = stringsEnum.SHOW_DETAILS;
            }
            return updatedTitle;
        });
    }

    function handleLeaveHazardEditorPress() {
        setModalOpen(false);
    }

    function handleSaveHazardPress(playground, index) {
        const newHazard = {
            description: playground.description,
            directions: playground.directions,
            riskCategory: playground.riskCategory,
            riskImpact: playground.riskImpact,
        };
        setRiskAssessmentSchedulePlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            if (!updatedPlayground.hazards) {
                updatedPlayground.hazards = [newHazard];
            } else {
                if (index === -1) {
                    updatedPlayground.hazards = [
                        ...updatedPlayground.hazards,
                        newHazard,
                    ];
                } else {
                    updatedPlayground.hazards[index] = newHazard;
                }
            }
            return updatedPlayground;
        });
        setModalOpen(false);
    }

    function handleAddScreenerPress() {
        const newScreener = {
            question: '',
            response: 'EMPTY',
        };
        setRiskAssessmentSchedulePlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            if (updatedPlayground.screeners) {
                updatedPlayground.screeners = [
                    ...updatedPlayground.screeners,
                    newScreener,
                ];
            } else {
                updatedPlayground.screeners = [newScreener];
            }
            return updatedPlayground;
        });
    }

    function handleInformationPress() {
        return Alert.alert(
            'Screening questions and Hazards',
            'Screening questions are yes/no questions attached to maintenance schedules which should ensure that working conditions are safe and the associate assigned to the' +
                ' assessment has the correct site permissions.' +
                '\n\n' +
                'Each hazard should have a description of the hazard itself, what the risk impact of the hazard ocurring on-site, the risk category ' +
                'of the hazard, and specific directions given to the maintenance associate who will fulfill this assessment schedule.',

            [
                {
                    text: 'OK',
                },
            ],
            { cancelable: false }
        );
    }

    function handleAddHazardPress() {
        setModalOpen(true);
    }

    function handleRemoveScreener(index) {
        setRiskAssessmentSchedulePlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground.screeners.splice(index, 1);
            return updatedPlayground;
        });
    }

    function handleOnChangeScreenerText(value, index) {
        const updatedQuestionText = value;
        setRiskAssessmentSchedulePlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground.screeners[index].question = updatedQuestionText;
            return updatedPlayground;
        });
    }

    function handleHazardEditPress(index) {
        setHazardIndex(index);
        const details = riskAssessmentSchedulePlayground.hazards[index];
        setHazardDetails(details);
        setModalOpen(true);
    }

    function handleHazardRemovePress(index) {
        setRiskAssessmentSchedulePlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground.hazards.splice(index, 1);
            return updatedPlayground;
        });
    }

    function renderHazards() {
        return riskAssessmentSchedulePlayground.hazards.map((hazard, index) => (
            <Hazard
                key={index}
                hazard={hazard}
                index={index}
                isRiskAssessmentView={true}
                onEditPress={handleHazardEditPress}
                onRemoveHazard={handleHazardRemovePress}
            />
        ));
    }

    function renderScreeners() {
        return riskAssessmentSchedulePlayground.screeners.map(
            (screener, index) => (
                <Screener
                    key={index}
                    questionText={screener.question}
                    onChangeText={handleOnChangeScreenerText}
                    onRemoveScreener={handleRemoveScreener}
                    isRiskAssessmentView={false}
                    screenerIndex={index}
                />
            )
        );
    }

    return (
        <ScrollView style={styles.screenContainer}>
            <Error errorMessage={error} />
            <Modal visible={modalOpen} animationType={'slide'}>
                <HazardEditor
                    leaveHazardEditorPress={handleLeaveHazardEditorPress}
                    isMaintenanceView={false}
                    handleOnSavePress={handleSaveHazardPress}
                    hazardDetails={hazardDetails}
                    index={hazardIndex}
                />
            </Modal>
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    {!scheduleEditorOpen ? (
                        <StyledButton
                            title={
                                route.params.riskAssessmentScheduleId
                                    ? 'Edit schedule'
                                    : 'Add new schedule'
                            }
                            onPress={handleAddSchedulePress}
                            disabled={false}
                            style={styles.optionButton}
                            textStyle={styles.optionButtonText}
                        />
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={handleCancelSchedulePress}>
                                <Icon
                                    name={'close'}
                                    style={styles.iconStyle}
                                    size={21}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={handleSaveSchedulePress}>
                                <Icon
                                    name={'save'}
                                    style={styles.iconStyle}
                                    size={22}
                                />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                {scheduleEditorOpen ? (
                    <>
                        <View style={styles.row}>
                            <FormInput
                                style={styles.titleInput}
                                placeholder={'Title'}
                                placeholderTextColor={`${LIGHT_GRAY}`}
                                value={riskAssessmentSchedulePlayground.title}
                                onChangeText={(val) =>
                                    handleRiskAssessmentScheduleChange(
                                        'title',
                                        val
                                    )
                                }
                                multiline
                            />
                        </View>
                        <View style={styles.multiSelectRow}>
                            <MultiSelect
                                hideTags
                                items={dropdownAssociates}
                                uniqueKey="id"
                                selectText="Add associates to schedule"
                                selectedItems={
                                    selectedSiteMaintenanceAssociates
                                }
                                onSelectedItemsChange={
                                    setSelectedSiteMaintenanceAssociates
                                }
                                searchInputPlaceholderText={'Search associates'}
                                styleDropdownMenuSubsection={
                                    styles.dropdownSubsection
                                }
                                styleDropdownMenu={styles.dropdownMenu}
                                styleInputGroup={styles.dropdownInputGroup}
                                selectedItemTextColor={`${LIGHT_TEAL}`}
                                submitButtonColor={`${DARK_BLUE}`}
                                submitButtonText="Add"
                                searchInputStyle={{
                                    backgroundColor: `${DARK_BABY_BLUE}`,
                                }}
                            />
                        </View>
                        <View style={styles.row}>
                            <>
                                <StyledButton
                                    onPress={handleDateSwitch}
                                    title={'Set schedule date'}
                                    textStyle={styles.optionButtonText}
                                    style={styles.optionButton}
                                />
                                <StyledButton
                                    onPress={handleTimeSwitch}
                                    title={'Set schedule time'}
                                    textStyle={styles.optionButtonText}
                                    style={styles.optionButton}
                                />
                                {showDateTimePicker ? (
                                    <DateTimePicker
                                        value={date}
                                        mode={mode}
                                        is24Hour={false}
                                        display="default"
                                        onChange={onDateTimeChange}
                                    />
                                ) : null}
                            </>
                        </View>
                        <View style={styles.row}>
                            <FormInput
                                style={styles.workOrderInput}
                                placeholder={'Work order'}
                                placeholderTextColor={`${LIGHT_GRAY}`}
                                value={
                                    riskAssessmentSchedulePlayground.workOrder
                                        ? riskAssessmentSchedulePlayground.workOrder.toString()
                                        : ''
                                }
                                onChangeText={(val) =>
                                    handleRiskAssessmentScheduleChange(
                                        'workOrder',
                                        val
                                    )
                                }
                            />
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.headerAlignment}>
                                Assessment Questions
                            </Text>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={handleInformationPress}
                                    style={styles.iconButton}>
                                    <Icon
                                        name="information-circle"
                                        size={22}
                                        style={styles.iconStyle}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={handleAddScreenerPress}
                                    style={styles.iconButton}>
                                    <Icon
                                        name="add"
                                        size={22}
                                        style={styles.iconStyle}
                                    />
                                    <Text style={styles.iconButtonText}>
                                        Screening question
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleAddHazardPress}
                                    style={styles.iconButton}>
                                    <Icon
                                        name="add"
                                        size={22}
                                        style={styles.iconStyle}
                                    />
                                    <Text style={styles.iconButtonText}>
                                        Hazard
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.sectionContainer}>
                            {riskAssessmentSchedulePlayground.screeners
                                ? renderScreeners()
                                : null}
                            {riskAssessmentSchedulePlayground.hazards
                                ? renderHazards()
                                : null}
                        </View>
                    </>
                ) : null}
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <StyledButton
                        title={riskAssessmentDetailsTitle}
                        onPress={handleRiskAssessmentDetailsPress}
                        textStyle={styles.optionButtonText}
                        style={styles.hideShowButton}
                    />
                </View>
                {riskAssessmentDetailsTitle === stringsEnum.HIDE_DETAILS ? (
                    <RiskAssessmentEditorScreen
                        riskAssessmentId={route.params.riskAssessmentId}
                    />
                ) : null}
            </View>
            <Loading loading={loading} />
        </ScrollView>
    );
};

export default RiskAssessmentScheduleEditorScreen;
