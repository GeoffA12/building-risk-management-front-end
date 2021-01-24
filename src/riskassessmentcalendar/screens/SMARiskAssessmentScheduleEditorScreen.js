import React, { useState, useEffect, useContext } from 'react';
import {
    Text,
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import cloneDeep from 'lodash/cloneDeep';
import Icon from 'react-native-ionicons';
import AuthContext from '../../auth/contexts/AuthContext';
import ScreenerResponse from '../components/ScreenerResponse';
import HazardPreview from '../components/HazardPreview';
import Loading from '../../common/components/Loading';
import Error from '../../common/components/Error';
import EntityStatus from '../../common/components/EntityStatus';
import { useRiskAssessment } from '../../riskassessment/hooks/RiskAssessmentHooks';
import { useRiskAssessmentSchedule } from '../../buildingriskassessment/hooks/RiskAssessmentScheduleHooks';
import { useAPI } from '../../common/hooks/API';
import { DARK_BLUE, LIGHT_GRAY } from '../../common/styles/Colors';
import { riskLevelEnum } from '../../buildingriskassessment/config/RiskLevelEnum';
import { statusEnum } from '../../buildingriskassessment/config/StatusEnum';
import EnhancedPicker from '../../common/components/EnhancedPicker';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 3,
        marginHorizontal: 3,
    },
    sectionContainer: {
        marginVertical: 4,
        marginHorizontal: 2,
        flex: 1,
        borderColor: `${DARK_BLUE}`,
        borderWidth: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 6,
        marginVertical: 5,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textRow: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 1,
        marginVertical: 3,
        padding: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cell: {
        flex: 1,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconButton: {
        flexDirection: 'row',
        backgroundColor: `${DARK_BLUE}`,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 10,
        marginVertical: 8,
        width: '28%',
        borderRadius: 10,
    },
    iconButtonStyle: {
        color: `${LIGHT_GRAY}`,
        padding: 4,
        margin: 1,
    },
    iconText: {
        color: `${LIGHT_GRAY}`,
        fontSize: 16,
        margin: 2,
        padding: 4,
    },
    inputStyle: {
        backgroundColor: `${DARK_BLUE}`,
        borderRadius: 8,
        color: `${LIGHT_GRAY}`,
        margin: 1,
        padding: 1,
        height: 37,
    },
    statusText: {
        color: `${DARK_BLUE}`,
        fontSize: 18,
        fontWeight: '700',
        padding: 6,
        marginHorizontal: 10,
    },
    underlineStatusText: {
        color: `${DARK_BLUE}`,
        fontSize: 19,
        fontWeight: '700',
        padding: 6,
        marginHorizontal: 10,
        textDecorationLine: 'underline',
    },
    pickerRowContainer: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
    },
    picker: {
        width: '95%',
        height: 45,
    },
});

const SMARiskAssessmentScheduleEditorScreen = ({ navigation, route }) => {
    const { user } = useContext(AuthContext);
    const {
        riskAssessmentModel,
        setRiskAssessmentModel,
        riskAssessmentPlayground,
        setRiskAssessmentPlayground,
        getRiskAssessment,
    } = useRiskAssessment();

    const {
        riskAssessmentScheduleModel,
        setRiskAssessmentScheduleModel,
        riskAssessmentSchedulePlayground,
        setRiskAssessmentSchedulePlayground,
        getRiskAssessmentSchedule,
    } = useRiskAssessmentSchedule();
    const { loading, setLoading, error, setError } = useAPI();

    useEffect(() => {
        if (route.params && route.params.riskAssessmentScheduleId) {
            loadRiskAssessmentScheduleId();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setRiskAssessmentSchedulePlayground(
            cloneDeep(riskAssessmentScheduleModel)
        );
        if (riskAssessmentScheduleModel.riskAssessmentId) {
            loadRiskAssessment(riskAssessmentScheduleModel.riskAssessmentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riskAssessmentScheduleModel]);

    useEffect(() => {
        setRiskAssessmentPlayground(cloneDeep(riskAssessmentModel));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riskAssessmentModel]);

    async function loadRiskAssessmentScheduleId() {
        setLoading(true);
        const riskAssessmentScheduleResponse = await getRiskAssessmentSchedule(
            route.params.riskAssessmentScheduleId
        );
        setLoading(false);
        if (!riskAssessmentScheduleResponse.data) {
            console.error(riskAssessmentScheduleResponse.error);
            setError(riskAssessmentScheduleResponse.error.message);
        } else {
            setRiskAssessmentScheduleModel(riskAssessmentScheduleResponse.data);
        }
    }

    async function loadRiskAssessment(riskAssessmentId) {
        setLoading(true);
        const riskAssessmentResponse = await getRiskAssessment(
            riskAssessmentId
        );
        setLoading(false);
        if (!riskAssessmentResponse.data) {
            console.error(riskAssessmentResponse.error);
            setError(riskAssessmentResponse.error.message);
        } else {
            setRiskAssessmentModel(riskAssessmentResponse.data);
        }
    }

    function handleRiskAssessmentSchedulePlaygroundChange(fieldKey, value) {
        setRiskAssessmentSchedulePlayground((prevPlayground) => {
            let updatedPlayground = { ...prevPlayground };
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    function setRiskLevelPickerOptions() {
        let pickerOptions = [];
        pickerOptions.push({
            label: 'Select risk level',
            value: '0',
        });
        Object.keys(riskLevelEnum).map((riskLevel) => {
            pickerOptions.push({
                label: riskLevelEnum[riskLevel].label,
                value: riskLevelEnum[riskLevel].urlValue,
            });
        });
        return pickerOptions;
    }

    function handleHazardOnSavePress(hazardPlayground, hazardIndex) {
        setRiskAssessmentPlayground((prevPlayground) => {
            let updatedPlayground = { ...prevPlayground };
            let updatedHazards = [...updatedPlayground.hazards];
            updatedHazards[hazardIndex] = hazardPlayground;
            updatedPlayground.hazards = updatedHazards;
            return updatedPlayground;
        });
    }

    function handleHazardCheckPress(hazardIndex) {
        setRiskAssessmentPlayground((prevPlayground) => {
            let updatedPlayground = { ...prevPlayground };
            let hazardToUpdate = updatedPlayground.hazards[hazardIndex];
            let updatedFulfillValue =
                hazardToUpdate.didFulfillHazard === null
                    ? true
                    : !hazardToUpdate.didFulfillHazard;
            let updatedHazards = [...updatedPlayground.hazards];
            updatedHazards[hazardIndex] = {
                description: updatedHazards[hazardIndex].description,
                directions: updatedHazards[hazardIndex].directions,
                didFulfillHazard: updatedFulfillValue,
                comments: updatedHazards[hazardIndex].comments,
                riskCategory: updatedHazards[hazardIndex].riskCategory,
                riskImpact: updatedHazards[hazardIndex].riskImpact,
            };
            updatedPlayground.hazards = updatedHazards;
            console.log(updatedPlayground);
            return updatedPlayground;
        });
    }

    function handleSaveRiskAssessmentSchedulePress() {
        console.log('Risk assessment schedule saved!');
    }

    function handleScreenerResponseChange(index, apiValue) {
        let existingScreener = riskAssessmentPlayground.screeners[index];
        if (existingScreener.response !== apiValue) {
            setRiskAssessmentPlayground((prevPlayground) => {
                let updatedPlayground = { ...prevPlayground };
                let updatedScreeners = [...updatedPlayground.screeners];
                updatedScreeners[index] = {
                    question: updatedScreeners[index].question,
                    response: apiValue,
                };
                updatedPlayground.screeners = updatedScreeners;
                return updatedPlayground;
            });
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Error errorMessage={error} />
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    {riskAssessmentSchedulePlayground.publisherId ? (
                        <EntityStatus
                            entityName={'Risk assessment schedule'}
                            publisherId={
                                riskAssessmentSchedulePlayground.publisherId
                            }
                            updatedAt={
                                riskAssessmentSchedulePlayground.updatedAt
                            }
                        />
                    ) : null}
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleSaveRiskAssessmentSchedulePress}>
                        <Text style={styles.iconText}>Save</Text>
                        <Icon
                            name={'save'}
                            style={styles.iconButtonStyle}
                            size={22}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.textRow}>
                    <Text
                        style={styles.statusText}
                        numberOfLines={2}
                        adjustsFontSizeToFit>
                        Title:{'  '}
                        {riskAssessmentSchedulePlayground.title}
                    </Text>
                </View>
                <View style={styles.textRow}>
                    <Text
                        style={styles.statusText}
                        numberOfLines={2}
                        adjustsFontSizeToFit>
                        Schedule status:{' '}
                        {riskAssessmentSchedulePlayground.status
                            ? statusEnum[
                                  riskAssessmentSchedulePlayground.status
                              ].label
                            : ''}{' '}
                    </Text>
                </View>
                <View style={styles.textRow}>
                    <Text
                        style={styles.statusText}
                        numberOfLines={2}
                        adjustsFontSizeToFit>
                        Work order:{'  '}
                        {riskAssessmentSchedulePlayground.workOrder.toString()}
                    </Text>
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.underlineStatusText}>Screeners:</Text>
                {riskAssessmentPlayground.screeners &&
                riskAssessmentPlayground.screeners.length > 0
                    ? riskAssessmentPlayground.screeners.map(
                          (screener, index) => {
                              return (
                                  <ScreenerResponse
                                      key={index}
                                      screener={screener}
                                      screenerIndex={index}
                                      handleScreenerResponseChange={
                                          handleScreenerResponseChange
                                      }
                                  />
                              );
                          }
                      )
                    : null}
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.underlineStatusText}>Hazards:</Text>
                {riskAssessmentPlayground.hazards &&
                riskAssessmentPlayground.hazards.length > 0
                    ? riskAssessmentPlayground.hazards.map((hazard, index) => {
                          return (
                              <HazardPreview
                                  key={index}
                                  hazard={hazard}
                                  handleHazardOnSavePress={
                                      handleHazardOnSavePress
                                  }
                                  handleHazardCheckPress={
                                      handleHazardCheckPress
                                  }
                                  hazardIndex={index}
                              />
                          );
                      })
                    : null}
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <View style={styles.pickerRowContainer}>
                        <EnhancedPicker
                            onChange={(val) =>
                                handleRiskAssessmentSchedulePlaygroundChange(
                                    'riskLevel',
                                    val
                                )
                            }
                            currentRoleSelected={
                                riskAssessmentSchedulePlayground.riskLevel
                            }
                            pickerOptions={setRiskLevelPickerOptions()}
                            prompt={'Select risk level'}
                            enabled={true}
                            style={styles.picker}
                        />
                    </View>
                </View>
            </View>
            <Loading loading={loading} />
        </ScrollView>
    );
};

export default SMARiskAssessmentScheduleEditorScreen;
