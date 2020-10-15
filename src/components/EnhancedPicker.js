import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-community/picker';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#45cff5',
    },
    picker: {
        color: '#026cb8',
        height: 55,
        width: 305,
        padding: 20,
    },
});

const EnhancedPicker = ({ onChange, currentRoleSelected, pickerOptions }) => {
    return (
        <View style={styles.container}>
            <Picker
                style={styles.picker}
                onValueChange={onChange}
                selectedValue={currentRoleSelected}
                prompt={'Select a site role'}>
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
