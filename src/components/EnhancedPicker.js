import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { LIGHT_TEAL, DARK_BLUE } from '../styles/Colors';

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: `${LIGHT_TEAL}`,
        flexDirection: 'row',
    },
    picker: {
        color: `${DARK_BLUE}`,
        height: 45,
        width: 150,
    },
    itemStyle: {
        fontSize: 16,
        height: 65,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
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
        <View style={styles.container}>
            <Picker
                style={[styles.picker, style]}
                onValueChange={onChange}
                selectedValue={currentRoleSelected}
                prompt={prompt}
                itemStyle={styles.itemStyle}>
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
