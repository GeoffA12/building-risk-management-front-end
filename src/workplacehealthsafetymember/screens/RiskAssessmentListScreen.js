import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import HeaderButton from '../../components/HeaderButton';
import RiskAssessment from '../components/RiskAssessment';
import Loading from '../../components/Loading';
import RiskAssessmentListHeader from '../components/RiskAssessmentListHeader';
import { riskAssessmentPickerOptions } from '../config/PickerOptions';
import { navigationRoutes } from '../../config/NavConfig';
import { BASE_URL } from '../../config/APIConfig';
import { LIGHT_TEAL } from '../../styles/Colors';

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        marginHorizontal: 8,
        padding: 6,
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    modalToggle: {
        marginBottom: 5,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: `${LIGHT_TEAL}`,
        padding: 10,
        alignSelf: 'center',
        marginTop: 20,
    },
});

const RiskAssessmentListScreen = ({ navigation }) => {
    const {
        auth: { logout },
        user,
    } = useContext(AuthContext);
    const [riskAssessments, setRiskAssessments] = useState([]);
    const [selectedFilterValue, setSelectedFilterValue] = useState('0');
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filteredRiskAssessments, setFilteredRiskAssessments] = useState([]);

    useEffect(() => {
        getRiskAssessments(user.associatedSiteIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredRiskAssessments(riskAssessments);
    }, [riskAssessments]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton
                        name={'add'}
                        onPress={handleAddRiskAssessmentPress}
                    />
                    <HeaderButton name={'exit'} onPress={() => logout()} />
                </View>
            ),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, logout]);

    useEffect(() => {
        setFilteredRiskAssessments((prevRiskAssessments) => {
            const filteredFirstNameUsers = riskAssessments.filter(
                (riskAssessment) =>
                    riskAssessment.title.includes(searchText) || !searchText
            );
            return filteredFirstNameUsers;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    async function getRiskAssessments(idList) {
        let riskAssessmentPages;
        setLoading(true);
        try {
            riskAssessmentPages = await axios.post(
                `${BASE_URL}/getRiskAssessmentsBySite`,
                {
                    pageInput: {
                        sortBy: 'updatedAt',
                        sortDirection: 'DESC',
                    },
                    associatedSiteIds: idList,
                }
            );
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
        const riskAssessmentData = riskAssessmentPages.data.riskassessments;
        setRiskAssessments(riskAssessmentData);
    }

    function handleFilterValueChange(val) {
        console.log(val);
        if (
            val === riskAssessmentPickerOptions.INITIAL_VALUE.value ||
            val === riskAssessmentPickerOptions.ALL_ASSESSMENTS.value
        ) {
            setFilteredRiskAssessments(riskAssessments);
        } else if (val === riskAssessmentPickerOptions.MY_ASSESSMENTS.value) {
            let filteredAssessments = [];
            for (let x = 0; x < riskAssessments.length; ++x) {
                const currentAssessment = riskAssessments[x];
                const createdEntityTrail = currentAssessment.entityTrail[0];
                const publisherId = createdEntityTrail.userId;
                const userIdOfUserLoggedIn = user.id;
                if (publisherId === userIdOfUserLoggedIn) {
                    filteredAssessments.push(currentAssessment);
                }
            }
            setFilteredRiskAssessments(filteredAssessments);
        } else {
            const idList = [val];
            getRiskAssessments(idList);
        }
        setSelectedFilterValue(val);
    }

    function handleRiskAssessmentCardPress(event) {
        console.log('Card in risk assessment list pressed.');
        console.log(event);
        console.log(event.id);
        navigation.navigate(navigationRoutes.RISKASSESSMENTEDITOR, {
            riskAssessmentId: event.id,
        });
    }

    function handleAddRiskAssessmentPress() {
        navigation.navigate(navigationRoutes.RISKASSESSMENTEDITOR, {
            riskAssessmentId: undefined,
        });
    }

    function handleRefresh() {
        setRefreshing(true);
        getRiskAssessments(user.associatedSiteIds);
        setRefreshing(false);
    }

    function renderRiskAssessment({ item: existingRiskAssessment }) {
        return (
            <RiskAssessment
                riskAssessment={existingRiskAssessment}
                onPress={handleRiskAssessmentCardPress}
                activeView={false}
            />
        );
    }

    return (
        <View style={styles.container}>
            <RiskAssessmentListHeader
                searchText={searchText}
                handleSearchTextChange={setSearchText}
                placeholder={'Title..'}
                handleFilterValueChange={handleFilterValueChange}
                selectedFilterValue={selectedFilterValue}
                associatedSiteIds={user.associatedSiteIds}
            />

            <FlatList
                data={filteredRiskAssessments}
                renderItem={renderRiskAssessment}
                keyExtractor={(riskAssessmentInList) => riskAssessmentInList.id}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
            <Loading loading={loading} />
        </View>
    );
};

export default RiskAssessmentListScreen;
