import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import IconButton from './IconButton';
import { DARK_BLUE } from '../styles/Colors';

const styles = StyleSheet.create({
    row: {
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        // borderWidth: 1,
        // borderColor: `${DARK_BLUE}`,
        // borderRadius: 10,
        padding: 8,
        marginHorizontal: 8,
        marginVertical: 2,
    },
    iconCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCell: {
        flex: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    rowText: {
        fontWeight: '600',
        fontSize: 16,
    },
});

const Row = ({ entity, iconName, onPress }) => {
    return (
        <View style={styles.row}>
            <View style={styles.textCell}>
                <Text style={styles.rowText}>{entity.siteName}</Text>
            </View>
            <View style={styles.iconCell}>
                <IconButton
                    name={iconName}
                    onPress={() => onPress(entity.id)}
                    iconSize={23}
                />
            </View>
        </View>
    );
};
export default Row;
