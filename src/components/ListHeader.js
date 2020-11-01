import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SearchBar } from 'react-native-elements';
import ShowHideToggleButton from '../components/ShowHideToggleButton';
import EnhancedPicker from '../components/EnhancedPicker';
import { DARK_BLUE, LIGHT_TEAL } from '../styles/Colors';
import { SiteRoles } from '../config/SiteRolesConfig';
import StyledButton from './StyledButton';

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
    filter: {
        width: 250,
        borderWidth: 2,
        borderRadius: 10,
        height: 40,
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

const ListHeader = ({
    searchText,
    handleSearchTextChange,
    handleCancelPress,
    placeholder,
    handleSiteRoleChange,
    selectedSiteRole,
}) => {
    const [openFilters, setOpenFilters] = useState(false);
    const [filterButtonTitle, setFilterButtonTitle] = useState(
        'Show search filters'
    );

    function setSiteRolePickerOptions() {
        const siteRoles = Object.keys(SiteRoles);
        let pickerOptions = [];
        pickerOptions.push({
            label: 'Site role',
            value: '0',
        });
        for (let x = 0; x < siteRoles.length; ++x) {
            let currentOption = {};
            let currentSiteRoleKey = siteRoles[x];
            currentOption.label = SiteRoles[currentSiteRoleKey].textField;
            currentOption.value = SiteRoles[currentSiteRoleKey].apiEnumValue;
            pickerOptions.push(currentOption);
        }
        return pickerOptions;
    }

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
                        onCancel={handleCancelPress}
                        value={searchText}
                    />

                    <View style={styles.rowContainer}>
                        <View style={styles.cell}>
                            <Text style={styles.cellFont}>Filter by: </Text>
                        </View>
                        <View style={styles.doubleCell}>
                            <EnhancedPicker
                                onChange={handleSiteRoleChange}
                                currentRoleSelected={selectedSiteRole}
                                pickerOptions={setSiteRolePickerOptions()}
                                prompt={'Select your site role'}
                                style={styles.filter}
                            />
                        </View>
                    </View>
                </>
            ) : null}
        </View>
    );
};

export default ListHeader;
