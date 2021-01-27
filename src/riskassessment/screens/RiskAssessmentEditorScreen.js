import React, { useState, useEffect, useContext } from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import isEqual from 'lodash.isequal';
import Icon from 'react-native-ionicons';
import AuthContext from '../../auth/contexts/AuthContext';
import FormInput from '../../common/components/FormInput';
import EntityStatus from '../../common/components/EntityStatus';
import Loading from '../../common/components/Loading';
import Error from '../../common/components/Error';
import { navigationRoutes } from '../../config/NavConfig';
import { useRiskAssessment } from '../hooks/RiskAssessmentHooks';
import { useAPI } from '../../common/hooks/API';
import {
    LIGHT_TEAL,
    LIGHT_GRAY,
    DARK_BLUE,
    DISABLED_BUTTON,
} from '../../common/styles/Colors';

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

const RiskAssessmentEditorScreen = ({
    navigation,
    route,
    riskAssessmentId,
}) => {
    const { user } = useContext(AuthContext);
    const { error, setError, loading, setLoading } = useAPI();
    const {
        riskAssessmentModel,
        setRiskAssessmentModel,
        getRiskAssessment,
        saveRiskAssessment,
        deleteRiskAssessment,
        riskAssessmentPlayground,
        setRiskAssessmentPlayground,
    } = useRiskAssessment();

    const [isDirty, setIsDirty] = useState(true);
    const [hasDeletePermissions, setHasDeletePermissions] = useState(false);

    useEffect(() => {
        if (route && route.params && route.params.riskAssessmentId) {
            loadRiskAssessment(route.params.riskAssessmentId);
        } else if (riskAssessmentId) {
            loadRiskAssessment(riskAssessmentId);
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

    async function loadRiskAssessment(id) {
        setLoading(true);
        const riskAssessmentResponse = await getRiskAssessment(id);
        if (riskAssessmentResponse.data) {
            setRiskAssessmentModel(riskAssessmentResponse.data);
            if (error) {
                setError('');
            }
        } else {
            console.error(riskAssessmentResponse.error);
            setError(riskAssessmentResponse.error.message);
        }
        setLoading(false);
    }

    async function handleSaveRiskAssessmentPress() {
        setLoading(true);
        const riskAssessmentResponse = await saveRiskAssessment(
            riskAssessmentPlayground,
            user.id
        );
        setLoading(false);
        if (!riskAssessmentResponse.data) {
            console.error(riskAssessmentResponse.error);
            setError(riskAssessmentResponse.error.message);
        } else {
            navigation.navigate(navigationRoutes.RISKASSESSMENTEDITOR, {
                riskAssessmentId: riskAssessmentResponse.data.id,
            });
        }
    }

    async function handleDeleteRiskAssessment() {
        setLoading(true);
        const deletedRiskAssessmentResponse = await deleteRiskAssessment(
            riskAssessmentPlayground.id,
            user.id
        );
        setLoading(false);
        if (!deletedRiskAssessmentResponse.data) {
            console.error(deletedRiskAssessmentResponse.error);
            setError(deletedRiskAssessmentResponse.error.message);
        } else {
            // TODO: Might want to use Confirmation.js
            navigation.navigate(navigationRoutes.RISKASSESSMENTLIST);
        }
    }

    function handleRiskAssessmentPlaygroundChange(fieldKey, value) {
        setRiskAssessmentPlayground((prevPlayground) => {
            const updatedPlayground = { ...prevPlayground };
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    // TODO: Disable the save button if the riskAssessmentPlayground isn't dirty.
    function validateRiskAssessmentPlayground() {
        let isValid = false;
        if (riskAssessmentPlayground) {
            if (
                riskAssessmentPlayground.title &&
                riskAssessmentPlayground.taskDescription
            ) {
                isValid = true;
            }
        }
        return isValid;
    }

    return (
        <ScrollView style={styles.container}>
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
                        multiline={true}
                    />
                </View>
            </View>
            <Error errorMessage={error} />
            <View style={styles.textInputContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={handleSaveRiskAssessmentPress}
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
