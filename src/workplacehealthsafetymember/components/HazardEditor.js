import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-ionicons';
import IconButton from '../../components/IconButton';
import Heading from '../../components/Heading';
import EnhancedPicker from '../../components/EnhancedPicker';
import FormInput from '../../components/FormInput';
import {
    riskCategoryPickerOptions,
    riskImpactPickerOptions,
} from '../config/PickerOptions';
import { DARK_BLUE, LIGHT_GRAY, LIGHT_TEAL } from '../../styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 4,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 23,
        right: 22,
    },
    heading: {
        marginVertical: 12,
        padding: 2,
        fontSize: 34,
        fontWeight: '700',
        color: `${DARK_BLUE}`,
    },
    hazardInputRow: {
        flex: 1,
        marginVertical: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerRowContainer: {
        marginVertical: 40,
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hazardInputCell: {
        flex: 1,
        margin: 3,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputStyle: {
        backgroundColor: `${DARK_BLUE}`,
        borderRadius: 8,
        color: `${LIGHT_GRAY}`,
    },
    picker: {
        width: '95%',
        height: 45,
    },
    iconButton: {
        backgroundColor: `${DARK_BLUE}`,
        marginTop: 40,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 7,
        width: '60%',
    },
    iconButtonText: {
        color: `${LIGHT_GRAY}`,
        fontSize: 16,
        paddingHorizontal: 15,
        paddingVertical: 3,
    },
    iconStyle: {
        color: `${LIGHT_GRAY}`,
        paddingVertical: 3,
        paddingHorizontal: 4,
    },
});

const HazardEditor = ({
    leaveHazardEditorPress,
    isRiskAssessmentView,
    handleOnSavePress,
    hazardDetails,
    index,
}) => {
    const [description, setDescription] = useState('');
    const [riskCategory, setRiskCategory] = useState('0');
    const [riskImpact, setRiskImpact] = useState('0');
    const [directions, setDirections] = useState('');

    useEffect(() => {
        if (hazardDetails) {
            setDescription(hazardDetails.description);
            setRiskCategory(hazardDetails.riskCategory);
            setRiskImpact(hazardDetails.riskImpact);
            setDirections(hazardDetails.directions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function setPickerOptions(optionsObject) {
        let options = [];
        Object.values(optionsObject).forEach((optionValue) => {
            options.push(optionValue);
        });
        return options;
    }

    function handleDescriptionChange(val) {
        setDescription(val);
    }

    function handleRiskCategoryChange(val) {
        setRiskCategory(val);
    }

    function handleRiskImpactChange(val) {
        setRiskImpact(val);
    }

    function handleDirectionsChange(val) {
        setDirections(val);
    }

    return (
        <View style={styles.container}>
            <IconButton
                name={'close-circle'}
                style={styles.closeIcon}
                iconSize={30}
                onPress={leaveHazardEditorPress}
            />
            <Heading style={styles.heading}>Add New Hazard!</Heading>
            <View style={styles.hazardInputRow}>
                <View style={styles.hazardInputCell}>
                    <FormInput
                        style={styles.inputStyle}
                        placeholder={'Description'}
                        placeholderTextColor={`${LIGHT_GRAY}`}
                        onChangeText={handleDescriptionChange}
                        value={description}
                    />
                </View>
            </View>
            <View style={styles.hazardInputRow}>
                <View style={styles.hazardInputCell}>
                    <FormInput
                        style={styles.inputStyle}
                        placeholder={'Directions'}
                        placeholderTextColor={`${LIGHT_GRAY}`}
                        onChangeText={handleDirectionsChange}
                        value={directions}
                        multiline={true}
                    />
                </View>
            </View>
            <View style={styles.pickerRowContainer}>
                <EnhancedPicker
                    onChange={handleRiskCategoryChange}
                    currentRoleSelected={riskCategory}
                    pickerOptions={setPickerOptions(riskCategoryPickerOptions)}
                    prompt={'Select risk catgory'}
                    style={styles.picker}
                />
            </View>
            <View style={styles.pickerRowContainer}>
                <EnhancedPicker
                    onChange={handleRiskImpactChange}
                    currentRoleSelected={riskImpact}
                    pickerOptions={setPickerOptions(riskImpactPickerOptions)}
                    prompt={'Select risk impact'}
                    style={styles.picker}
                />
            </View>
            <View style={styles.pickerRowContainer}>
                <TouchableOpacity
                    onPress={() =>
                        handleOnSavePress(
                            description,
                            directions,
                            riskCategory,
                            riskImpact,
                            index
                        )
                    }
                    style={styles.iconButton}>
                    <Icon name="save" size={22} style={styles.iconStyle} />
                    <Text style={styles.iconButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

HazardEditor.propTypes = {
    leaveHazardEditorPress: PropTypes.func.isRequired,
    isRiskAssessmentView: PropTypes.bool.isRequired,
    handleOnSavePress: PropTypes.func.isRequired,
    hazardDetails: PropTypes.object,
    index: PropTypes.number,
};

HazardEditor.defaultProps = {
    hazardDetails: {},
    index: -1,
};

export default HazardEditor;
