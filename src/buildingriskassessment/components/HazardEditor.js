import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import Icon from 'react-native-ionicons';
import cloneDeep from 'lodash/cloneDeep';
import IconButton from '../../common/components/IconButton';
import Heading from '../../common/components/Heading';
import EnhancedPicker from '../../common/components/EnhancedPicker';
import FormInput from '../../common/components/FormInput';
import {
    riskCategoryPickerOptions,
    riskImpactPickerOptions,
} from '../../riskassessment/config/PickerOptions';
import { useHazard } from '../hooks/HazardHooks';
import { DARK_BLUE, LIGHT_GRAY } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 3,
        marginHorizontal: 6,
    },
    heading: {
        fontSize: 32,
        fontWeight: '700',
        color: `${DARK_BLUE}`,
    },
    row: {
        flex: 1,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerRowContainer: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
    },
    cell: {
        flex: 1,
        flexDirection: 'column',
        margin: 2,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputStyle: {
        backgroundColor: `${DARK_BLUE}`,
        borderRadius: 8,
        color: `${LIGHT_GRAY}`,
        marginBottom: 2,
    },
    picker: {
        width: '95%',
        height: 45,
    },
    iconButton: {
        backgroundColor: `${DARK_BLUE}`,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 5,
        width: '30%',
    },
    informationIconButton: {
        backgroundColor: `${DARK_BLUE}`,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 5,
    },
    iconButtonText: {
        color: `${LIGHT_GRAY}`,
        fontSize: 16,
        paddingHorizontal: 15,
        paddingVertical: 3,
    },
    labelText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        padding: 4,
        margin: 2,
        color: `${DARK_BLUE}`,
    },
    iconStyle: {
        color: `${LIGHT_GRAY}`,
        paddingVertical: 3,
        paddingHorizontal: 4,
    },
});

const HazardEditor = ({
    leaveHazardEditorPress,
    isMaintenanceView,
    handleOnSavePress,
    hazardDetails,
    index,
}) => {
    const {
        hazardModel,
        setHazardModel,
        hazardPlayground,
        setHazardPlayground,
    } = useHazard();

    const [hazardFormTitle, setHazardFormTitle] = useState('');

    useEffect(() => {
        if (hazardDetails) {
            setHazardModel(cloneDeep(hazardDetails));
        }
        if (isMaintenanceView || hazardDetails.description) {
            setHazardFormTitle('Edit hazard!');
        } else {
            setHazardFormTitle('Add hazard!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setHazardPlayground(cloneDeep(hazardModel));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hazardModel]);

    function handleHazardPlaygroundChange(fieldKey, value) {
        setHazardPlayground((prevPlayground) => {
            let updatedPlayground = { ...prevPlayground };
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    function setPickerOptions(optionsObject) {
        let options = [];
        Object.values(optionsObject).forEach((optionValue) => {
            options.push(optionValue);
        });
        return options;
    }

    function handleInformationPress() {
        return Alert.alert(
            'Risk category examples',
            'Atmospheric: Weather extremes, high humidity, dust, or dangerous gases.' +
                '\n\n' +
                'Biological: Baterial virus hazards, pest or wildlife safety hazards.' +
                '\n\n' +
                'Chemical: Presence of heavy metals, acids, bases, poisons, or fumes.' +
                '\n\n' +
                'Electrical: Electrical hazards, faulty wiring, exposed earthing points, or static shock danger.' +
                '\n\n' +
                'Environmental: Confined and dangerous working space, loud noises, extreme temperatures, bad ligthing.' +
                '\n\n' +
                'External: General Public safety hazards, traffic or construction hazards at site' +
                '\n\n' +
                'Fire: Open flames, combustible materials, chemical reactions which could create fire explosions' +
                '\n\n' +
                'Gravitational: Falling objects, heavy objects, objects on site that can be tripped on' +
                '\n\n' +
                'Manual Handling: Heavy lifting and pushing hazards, twisting or awkward positions operating site machinery' +
                '\n\n' +
                'Mechanical: Machinery hazards including potential for entaglement, stabbing, crushing, or abrasions.' +
                '\n\n' +
                'Pressure: Air, water, gas, oil, or extreme high/low pressure hazards on site' +
                '\n\n' +
                'Thermal: Hot or cold surfaces, liquids, or steam hazards on site.',
            [
                {
                    text: 'OK',
                },
            ],
            { cancelable: false }
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.row}>
                <View style={styles.cell}>
                    <Heading style={styles.heading}>{hazardFormTitle}</Heading>
                    <IconButton
                        name={'close-circle'}
                        style={styles.closeIcon}
                        iconSize={30}
                        onPress={leaveHazardEditorPress}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.cell}>
                    <Text style={styles.labelText}>Description:</Text>
                    <FormInput
                        style={styles.inputStyle}
                        placeholder={'Description'}
                        placeholderTextColor={`${LIGHT_GRAY}`}
                        onChangeText={(val) =>
                            handleHazardPlaygroundChange('description', val)
                        }
                        value={hazardPlayground.description}
                        multiline={true}
                        editable={!isMaintenanceView}
                    />
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.cell}>
                    <Text style={styles.labelText}>Directions:</Text>
                    <FormInput
                        style={styles.inputStyle}
                        placeholder={'Directions'}
                        placeholderTextColor={`${LIGHT_GRAY}`}
                        onChangeText={(val) =>
                            handleHazardPlaygroundChange('directions', val)
                        }
                        value={hazardPlayground.directions}
                        multiline={true}
                        editable={!isMaintenanceView}
                    />
                </View>
            </View>
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={handleInformationPress}
                    style={styles.informationIconButton}>
                    <Icon
                        name="information-circle"
                        size={22}
                        style={styles.iconStyle}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <View style={styles.pickerRowContainer}>
                    <EnhancedPicker
                        onChange={(val) =>
                            handleHazardPlaygroundChange('riskCategory', val)
                        }
                        currentRoleSelected={hazardPlayground.riskCategory}
                        pickerOptions={setPickerOptions(
                            riskCategoryPickerOptions
                        )}
                        prompt={'Select risk catgory'}
                        style={styles.picker}
                        enabled={!isMaintenanceView}
                    />
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.pickerRowContainer}>
                    <EnhancedPicker
                        onChange={(val) =>
                            handleHazardPlaygroundChange('riskImpact', val)
                        }
                        currentRoleSelected={hazardPlayground.riskImpact}
                        pickerOptions={setPickerOptions(
                            riskImpactPickerOptions
                        )}
                        prompt={'Select risk impact'}
                        style={styles.picker}
                        enabled={!isMaintenanceView}
                    />
                </View>
            </View>
            {isMaintenanceView ? (
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.labelText}>Comments:</Text>
                        <FormInput
                            style={styles.inputStyle}
                            placeholder={'Comments'}
                            placeholderTextColor={`${LIGHT_GRAY}`}
                            onChangeText={(val) =>
                                handleHazardPlaygroundChange('comments', val)
                            }
                            value={hazardPlayground.comments}
                            multiline={true}
                        />
                    </View>
                </View>
            ) : null}
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={() => handleOnSavePress(hazardPlayground, index)}
                    style={styles.iconButton}>
                    <Icon name="save" size={22} style={styles.iconStyle} />
                    <Text style={styles.iconButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

HazardEditor.propTypes = {
    leaveHazardEditorPress: PropTypes.func.isRequired,
    isMaintenanceView: PropTypes.bool,
    handleOnSavePress: PropTypes.func.isRequired,
    hazardDetails: PropTypes.object.isRequired,
    index: PropTypes.number,
};

HazardEditor.defaultProps = {
    isMaintenanceView: false,
    index: -1,
};

export default HazardEditor;
