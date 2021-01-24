import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { LIGHT_TEAL } from '../styles/Colors';

const styles = StyleSheet.create({
    input: {
        backgroundColor: `${LIGHT_TEAL}`,
        width: '90%',
        paddingHorizontal: 10,
        borderRadius: 10,
    },
});

const FormInput = ({ style, ...props }) => {
    // const defaultLineHeight = 42;
    // const [formLineHeight, setFormLineHeight] = useState(defaultLineHeight);

    // function handleFormLineHeightChange(event) {
    //     console.log(event.nativeEvent);
    //     setFormLineHeight(event.nativeEvent.contentSize.height);
    // }

    return (
        <TextInput
            {...props}
            style={[styles.input, style]}
            // onChange={(e) => handleFormLineHeightChange(e)}
        />
    );
};

export default FormInput;
