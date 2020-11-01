import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { LIGHT_TEAL, DARK_BLUE } from '../styles/Colors';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: `${LIGHT_TEAL}`,
    },
    picker: {
        color: `${DARK_BLUE}`,
        height: 55,
        width: 305,
        padding: 20,
    },
});

const EnhancedPicker = ({
    onChange,
    currentRoleSelected,
    pickerOptions,
    prompt,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <Picker
                style={[styles.picker, style]}
                onValueChange={onChange}
                selectedValue={currentRoleSelected}
                prompt={prompt}>
                {pickerOptions.map((option) => {
                    return (
                        <Picker.Item
                            label={option.label}
                            value={option.value}
                            key={parseInt(option.value, 10)}
                        />
                    );
                })}
            </Picker>
        </View>
    );
};

export default EnhancedPicker;
