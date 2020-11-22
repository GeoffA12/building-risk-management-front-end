import React, { useState, useEffect, useContext } from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
} from 'react-native';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash.isequal';
import axios from 'axios';
import Icon from 'react-native-ionicons';
import AuthContext from '../../contexts/AuthContext';
import FormInput from '../../components/FormInput';
import HazardEditor from '../components/HazardEditor';
import EntityStatus from '../../components/EntityStatus';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import Hazard from '../components/Hazard';
import Screener from '../components/Screener';
import { BASE_URL } from '../../config/APIConfig';
import { navigationRoutes } from '../../config/NavConfig';
import { useRiskAssessment } from '../hooks/RiskAssessmentModel';
import {
    LIGHT_TEAL,
    LIGHT_GRAY,
    DARK_BLUE,
    DISABLED_BUTTON,
} from '../../styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
    },
    textInputContainer: {
        marginVertical: 15,
        marginHorizontal: 5,
        flex: 1,
        backgroundColor: 'white',
    },
    textRow: {
        margin: 7,
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    inputCell: {
        backgroundColor: `${DARK_BLUE}`,
        color: `${LIGHT_TEAL}`,
        borderRadius: 10,
        margin: 2,
    },
    headerAlignment: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        padding: 4,
        color: `${DARK_BLUE}`,
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
    disabledIconButton: {
        backgroundColor: `${DISABLED_BUTTON}`,
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
    },
    iconStyle: {
        color: `${LIGHT_GRAY}`,
        paddingVertical: 3,
        paddingHorizontal: 4,
    },
    saveButtonCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const RiskAssessmentEditorScreen = ({ navigation, route }) => {
    const { user } = useContext(AuthContext);
    const [modalOpen, setModalOpen] = useState(false);
    const { riskAssessmentModel, setRiskAssessmentModel } = useRiskAssessment();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hazardIndex, setHazardIndex] = useState(-1);
    const [hazardDetails, setHazardDetails] = useState({});
    const [isDirty, setIsDirty] = useState(true);
    const [hasDeletePermissions, setHasDeletePermissions] = useState(false);

    const [riskAssessmentPlayground, setRiskAssessmentPlayground] = useState(
        cloneDeep(riskAssessmentModel)
    );

    useEffect(() => {
        if (route.params.riskAssessmentId) {
            getRiskAssessment(route.params.riskAssessmentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const publisherEntityTrail = riskAssessmentModel.entityTrail[0];
        if (publisherEntityTrail && user.id === publisherEntityTrail.userId) {
            setHasDeletePermissions(true);
        }
        setRiskAssessmentPlayground(riskAssessmentModel);
        setIsDirty(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riskAssessmentModel]);

    useEffect(() => {
        if (!isEqual(riskAssessmentPlayground, riskAssessmentModel)) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riskAssessmentPlayground]);

    async function getRiskAssessment(id) {
        let response;
        try {
            setLoading(true);
            response = await axios.get(
                `${BASE_URL}/getRiskAssessmentById?id=${id}`
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

    console.log(riskAssessmentPlayground);

    async function handleCreateRiskAssessment() {
        let response;
        let uri;
        let inputObject;
        if (riskAssessmentPlayground.id) {
            uri = 'updateRiskAssessment';
            inputObject = {
                id: riskAssessmentPlayground.id,
                publisherId: user.id,
                title: riskAssessmentPlayground.title,
                taskDescription: riskAssessmentPlayground.taskDescription,
                hazards: riskAssessmentPlayground.hazards,
                screeners: riskAssessmentPlayground.screeners,
            };
        } else {
            uri = 'createRiskAssessment';
            inputObject = {
                publisherId: user.id,
                title: riskAssessmentPlayground.title,
                taskDescription: riskAssessmentPlayground.taskDescription,
                hazards: riskAssessmentPlayground.hazards,
                screeners: riskAssessmentPlayground.screeners,
            };
        }
        try {
            setLoading(true);
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
        const riskAssessmentData = response.data;
        navigation.navigate(navigationRoutes.RISKASSESSMENTEDITOR, {
            riskAssessmentId: riskAssessmentData.id,
        });
    }

    function handleRiskAssessmentPlaygroundChange(fieldKey, value) {
        setRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    async function handleDeleteRiskAssessment() {
        const riskAssessmentId = riskAssessmentPlayground.id;
        const userId = user.id;
        try {
            setLoading(true);
            await axios.delete(
                `${BASE_URL}/deleteRiskAssessment?id=${riskAssessmentId}&publisherId=${userId}`
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
        navigation.navigate(navigationRoutes.RISKASSESSMENTLIST);
    }

    function handleAddScreenerPress() {
        // TODO: Add a new screener object to the riskAssessmentPlayground
        const newScreener = {
            question: '',
            response: 'EMPTY',
        };
        setRiskAssessmentPlayground((prevPlayground) => {
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

    function handleAddHazardPress() {
        setModalOpen(true);
    }

    function handleRemoveScreener(index) {
        setRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground.screeners.splice(index, 1);
            return updatedPlayground;
        });
    }

    function handleOnChangeScreenerText(value, index) {
        const updatedQuestionText = value;
        setRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground.screeners[index].question = updatedQuestionText;
            return updatedPlayground;
        });
    }

    function handleLeaveHazardEditorPress() {
        setModalOpen(false);
    }

    function handleSaveHazardPress(
        description,
        directions,
        riskCategory,
        riskImpact,
        index
    ) {
        const newHazard = {
            description,
            directions,
            riskCategory,
            riskImpact,
        };
        setRiskAssessmentPlayground((prevPlayground) => {
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

    function handleHazardEditPress(index) {
        setHazardIndex(index);
        const details = riskAssessmentPlayground.hazards[index];
        setHazardDetails(details);
        setModalOpen(true);
    }

    function handleHazardRemovePress(index) {
        setRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground.hazards.splice(index, 1);
            return updatedPlayground;
        });
    }

    // TODO: Disable the save button if the riskAssessmentPlayground isn't dirty.
    function validateRiskAssessmentPlayground() {
        let isValid = false;
        if (riskAssessmentPlayground) {
            if (
                riskAssessmentPlayground.title &&
                riskAssessmentPlayground.taskDescription &&
                riskAssessmentPlayground.screeners &&
                riskAssessmentPlayground.hazards
            ) {
                if (
                    riskAssessmentPlayground.hazards.length >= 1 &&
                    riskAssessmentPlayground.screeners.length >= 1
                ) {
                    isValid = true;
                }
            }
        }
        return isValid;
    }

    function renderHazards() {
        return riskAssessmentPlayground.hazards.map((hazard, index) => (
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
        return riskAssessmentPlayground.screeners.map((screener, index) => (
            <Screener
                key={index}
                questionText={screener.question}
                onChangeText={handleOnChangeScreenerText}
                onRemoveScreener={handleRemoveScreener}
                isRiskAssessmentView={false}
                screenerIndex={index}
            />
        ));
    }

    return (
        <ScrollView style={styles.container}>
            <Modal visible={modalOpen} animationType={'slide'}>
                <View>
                    <HazardEditor
                        leaveHazardEditorPress={handleLeaveHazardEditorPress}
                        isRiskAssessmentView={false}
                        handleOnSavePress={handleSaveHazardPress}
                        hazardDetails={hazardDetails}
                        index={hazardIndex}
                    />
                </View>
            </Modal>
            {riskAssessmentPlayground.entityTrail &&
            riskAssessmentPlayground.entityTrail.length >= 1 ? (
                <EntityStatus
                    entityName={'Risk Assessment'}
                    publisherId={
                        riskAssessmentPlayground.entityTrail[
                            riskAssessmentPlayground.entityTrail.length - 1
                        ].userId
                    }
                    updatedAt={riskAssessmentPlayground.updatedAt}
                />
            ) : null}
            <View style={styles.textInputContainer}>
                <Text style={styles.headerAlignment}>Assessment Details</Text>
                <View style={styles.textRow}>
                    <FormInput
                        style={styles.inputCell}
                        placeholder={'Title'}
                        placeholderTextColor={`${LIGHT_TEAL}`}
                        onChangeText={(val) =>
                            handleRiskAssessmentPlaygroundChange('title', val)
                        }
                        value={riskAssessmentPlayground.title}
                    />
                    {/* <FormInput
                        style={styles.workOrderInputCell}
                        placeholder={'Work order'}
                        onChangeText={(val) =>
                            handleRiskAssessmentPlaygroundChange(
                                'workOrder',
                                val
                            )
                        }
                        placeholderTextColor={`${LIGHT_GRAY}`}
                        keyboardType={'number-pad'}
                        value={riskAssessmentPlayground.workOrder}
                    /> */}
                </View>
                <View style={styles.textRow}>
                    <FormInput
                        style={styles.inputCell}
                        placeholder={'Task Description'}
                        onChangeText={(val) =>
                            handleRiskAssessmentPlaygroundChange(
                                'taskDescription',
                                val
                            )
                        }
                        placeholderTextColor={`${LIGHT_TEAL}`}
                        value={riskAssessmentPlayground.taskDescription}
                    />
                </View>
            </View>
            <View style={styles.textInputContainer}>
                <Text style={styles.headerAlignment}>Assessment Questions</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={handleAddScreenerPress}
                        style={styles.iconButton}>
                        <Icon name="add" size={22} style={styles.iconStyle} />
                        <Text style={styles.iconButtonText}>
                            Screening question
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleAddHazardPress}
                        style={styles.iconButton}>
                        <Icon name="add" size={22} style={styles.iconStyle} />
                        <Text style={styles.iconButtonText}>Hazard</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.textInputContainer}>
                {riskAssessmentPlayground.screeners ? renderScreeners() : null}
                {riskAssessmentPlayground.hazards ? renderHazards() : null}
            </View>
            <Error errorMessage={error} />
            <View style={styles.textInputContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={handleCreateRiskAssessment}
                        style={
                            isDirty && validateRiskAssessmentPlayground()
                                ? styles.iconButton
                                : styles.disabledIconButton
                        }
                        disabled={
                            !(validateRiskAssessmentPlayground() && isDirty)
                        }>
                        <Icon name="save" size={22} style={styles.iconStyle} />
                        <Text style={styles.iconButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDeleteRiskAssessment}
                        style={
                            hasDeletePermissions
                                ? styles.iconButton
                                : styles.disabledIconButton
                        }
                        disabled={!hasDeletePermissions}>
                        <Icon name="trash" size={22} style={styles.iconStyle} />
                        <Text style={styles.iconButtonText}>
                            Delete Assessment
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Loading loading={loading} />
        </ScrollView>
    );
};

export default RiskAssessmentEditorScreen;
