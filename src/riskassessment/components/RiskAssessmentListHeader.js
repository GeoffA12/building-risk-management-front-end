import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { SearchBar } from 'react-native-elements';
import ShowHideToggleButton from '../../common/components/ShowHideToggleButton';
import EnhancedPicker from '../../common/components/EnhancedPicker';
import Loading from '../../common/components/Loading';
import { riskAssessmentPickerOptions } from '../config/PickerOptions';
import { BASE_URL } from '../../config/APIConfig';
import { DARK_BLUE, LIGHT_TEAL } from '../../common/styles/Colors';

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
        width: 200,
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
    pickerContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const RiskAssessmentListHeader = ({
    searchText,
    handleSearchTextChange,
    placeholder,
    handleFilterValueChange,
    selectedFilterValue,
    associatedSiteIds,
}) => {
    const [openFilters, setOpenFilters] = useState(false);
    const [filterButtonTitle, setFilterButtonTitle] = useState(
        'Show search filters'
    );
    const [loading, setLoading] = useState(false);
    const [sites, setSites] = useState([]);

    useEffect(() => {
        getSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getSites() {
        let response;
        try {
            setLoading(true);
            response = await axios.post(`${BASE_URL}/getSites`, {
                siteIds: associatedSiteIds,
            });
        } catch (e) {
            console.error(e);
            setLoading(false);
            return;
        }
        setLoading(false);
        setSites(response.data);
    }

    function setRiskAssessmentPickerOptions() {
        let pickerOptions = [];
        Object.keys(riskAssessmentPickerOptions).map((optionKey) => {
            pickerOptions.push({
                label: riskAssessmentPickerOptions[optionKey].label,
                value: riskAssessmentPickerOptions[optionKey].value,
            });
        });
        if (sites) {
            for (let x = 0; x < sites.length; ++x) {
                const siteObject = {
                    label: sites[x].siteName,
                    value: sites[x].id,
                };
                pickerOptions.push(siteObject);
            }
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
                        value={searchText}
                    />

                    <View style={styles.rowContainer}>
                        <View style={styles.cell}>
                            <Text style={styles.cellFont}>Filter by: </Text>
                        </View>
                        <View style={styles.doubleCell}>
                            <View style={styles.pickerContainer}>
                                <EnhancedPicker
                                    onChange={handleFilterValueChange}
                                    currentRoleSelected={selectedFilterValue}
                                    pickerOptions={setRiskAssessmentPickerOptions()}
                                    prompt={'Select Filter option: '}
                                    style={styles.filter}
                                />
                            </View>
                        </View>
                    </View>
                    <Loading loading={loading} />
                </>
            ) : null}
        </View>
    );
};

export default RiskAssessmentListHeader;
