import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import ShowHideToggleButton from './ShowHideToggleButton';
import EnhancedPicker from './EnhancedPicker';
import { DARK_BLUE, LIGHT_TEAL } from '../styles/Colors';

const styles = StyleSheet.create({
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 18,
        marginVertical: 10,
        alignSelf: 'stretch',
    },
    cell: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
    },
    doubleCell: {
        flex: 2,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
    },
    cellFont: {
        textAlign: 'center',
        fontSize: 16,
        color: `${DARK_BLUE}`,
    },
    containerStyle: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    inputContainerStyle: {
        backgroundColor: `${DARK_BLUE}`,
    },
    inputStyle: {
        padding: 2,
        fontSize: 16,
        color: `${LIGHT_TEAL}`,
    },
    picker: {
        width: 215,
    },
    pickerContainer: {
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addIconButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
    },
    filterButton: {
        fontSize: 17,
        fontWeight: '700',
        padding: 4,
        margin: 4,
        width: '70%',
        textAlign: 'center',
    },
});

const SearchFilters = ({
    searchText,
    handleSearchTextChange,
    placeholder,
    handleFilterChange,
    selectedFilterValue,
    setPickerCallback,
}) => {
    const [openFilters, setOpenFilters] = useState(false);
    const [filterButtonTitle, setFilterButtonTitle] = useState(
        'Show search filters'
    );

    function handleFilterPress() {
        setOpenFilters((prevState) => {
            return !prevState;
        });
        setFilterButtonTitle((prevTitle) => {
            if (prevTitle === 'Show search filters') {
                return 'Hide search filters';
            } else {
                return 'Show search filters';
            }
        });
    }

    return (
        <View style={styles.container}>
            <ShowHideToggleButton
                buttonText={filterButtonTitle}
                onPress={handleFilterPress}
            />
            {openFilters ? (
                <>
                    <SearchBar
                        placeholder={placeholder}
                        placeholderTextColor={`${LIGHT_TEAL}`}
                        lightTheme
                        round
                        containerStyle={styles.containerStyle}
                        inputContainerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                        onChangeText={(text) => handleSearchTextChange(text)}
                        // onCancel={handleCancelPress}
                        value={searchText}
                    />

                    <View style={styles.rowContainer}>
                        <View style={styles.cell}>
                            <Text style={styles.cellFont}>Filter by: </Text>
                        </View>
                        <View style={styles.doubleCell}>
                            <View style={styles.pickerContainer}>
                                <EnhancedPicker
                                    onChange={handleFilterChange}
                                    currentRoleSelected={selectedFilterValue}
                                    pickerOptions={setPickerCallback()}
                                    prompt={'Select your site role'}
                                    style={styles.picker}
                                />
                            </View>
                        </View>
                    </View>
                </>
            ) : null}
        </View>
    );
};

SearchFilters.propTypes = {
    searchText: PropTypes.string.isRequired,
    handleSearchTextChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    handleFilterChange: PropTypes.func.isRequired,
    selectedFilterValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]).isRequired,
    setPickerCallback: PropTypes.func.isRequired,
};

SearchFilters.defaultProps = {
    placeholder: '',
};

export default SearchFilters;
