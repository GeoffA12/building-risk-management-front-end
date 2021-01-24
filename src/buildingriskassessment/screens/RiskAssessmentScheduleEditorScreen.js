import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
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
import { useBuildingRiskAssessment } from '../hooks/BuildingRiskAssessmentHooks';
import { useRiskAssessmentSchedule } from '../hooks/RiskAssessmentScheduleHooks';
import { stringsEnum } from '../config/StringsEnum';
import { useAPI } from '../../common/hooks/API';
import { buildingRiskAssessmentUtils } from '../utils/BuildingRiskAssessmentUtils';
import {
    LIGHT_GRAY,
    DARK_BLUE,
    LIGHT_TEAL,
    BABY_BLUE,
    DARK_BABY_BLUE,
} from '../../common/styles/Colors';
import { Platform } from 'react-native';
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
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginVertical: 8,
        width: '30%',
        borderRadius: 10,
    },
    iconButtonStyle: {
        color: `${LIGHT_GRAY}`,
        padding: 4,
        margin: 1,
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
        padding: 2,
        backgroundColor: `${DARK_BLUE}`,
        color: `${LIGHT_GRAY}`,
        width: '45%',
    },
    titleInput: {
        marginHorizontal: 12,
        marginBottom: 4,
        width: '70%',
        padding: 1,
        backgroundColor: `${DARK_BLUE}`,
        color: `${LIGHT_GRAY}`,
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
        console.log(route.params);
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
            } else {
                riskAssessmentScheduleIdToFetch =
                    createRiskAssessmentScheduleResponse.data.id;
            }
        }
        setLoading(false);
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

    return (
        <ScrollView style={styles.screenContainer}>
            <Error errorMessage={error} />
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
                                    style={styles.iconButtonStyle}
                                    size={21}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={handleSaveSchedulePress}>
                                <Icon
                                    name={'save'}
                                    style={styles.iconButtonStyle}
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
