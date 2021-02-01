import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import AuthContext from '../../auth/contexts/AuthContext';
import RiskAssessment from '../components/RiskAssessment';
import Loading from '../../common/components/Loading';
import SearchFilters from '../../common/components/SearchFilters';
import { riskAssessmentPickerOptions } from '../config/PickerOptions';
import { navigationRoutes } from '../../config/NavConfig';
import { useAPI } from '../../common/hooks/API';
import { useHeader } from '../../common/hooks/Header';
import { useRiskAssessment } from '../hooks/RiskAssessmentHooks';
import { LIGHT_TEAL } from '../../common/styles/Colors';

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

const RiskAssessmentListScreen = ({ navigation, route }) => {
    const {
        auth: { logout },
        user,
    } = useContext(AuthContext);
    const { error, setError, loading, setLoading } = useAPI();
    const { setListHeader } = useHeader();
    const {
        getRiskAssessments,
        getInitialPickerState,
        setPickerCallback,
    } = useRiskAssessment();

    const [riskAssessments, setRiskAssessments] = useState([]);
    const [selectedFilterValue, setSelectedFilterValue] = useState('0');
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [filteredRiskAssessments, setFilteredRiskAssessments] = useState([]);
    const [authenticatedSites, setAuthenticatedSites] = useState([]);
    const [pickerOptions, setPickerOptions] = useState(getInitialPickerState());

    useEffect(() => {
        loadRiskAssessments(user.associatedSiteIds);
        loadPickerCallback(user.associatedSiteIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredRiskAssessments(riskAssessments);
    }, [riskAssessments]);

    useEffect(() => {
        setListHeader(navigation, handleAddRiskAssessmentPress, logout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, logout]);

    useEffect(() => {
        if (route.params && route.params.refresh) {
            loadRiskAssessments(user.associatedSiteIds);
            loadPickerCallback(user.associatedSiteIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

    useEffect(() => {
        if (riskAssessments && riskAssessments.length > 0) {
            setFilteredRiskAssessments((prevRiskAssessments) => {
                const filteredFirstNameUsers = riskAssessments.filter(
                    (riskAssessment) =>
                        riskAssessment.title.includes(searchText) || !searchText
                );
                return filteredFirstNameUsers;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    useEffect(() => {
        let pickers;
        if (authenticatedSites.length > 0) {
            pickers = getInitialPickerState();
            for (let x = 0; x < authenticatedSites.length; ++x) {
                const siteObject = {
                    label: authenticatedSites[x].siteName,
                    value: authenticatedSites[x].id,
                };
                pickers.push(siteObject);
            }
        }
        setPickerOptions(pickers);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticatedSites]);

    async function loadRiskAssessments(idList) {
        setLoading(true);
        const riskAssessmentPages = await getRiskAssessments(idList);
        if (riskAssessmentPages.data) {
            setRiskAssessments(riskAssessmentPages.data.riskassessments);
            if (error) {
                setError('');
            }
        } else {
            console.error(riskAssessmentPages.error);
            setError(riskAssessmentPages.error.message);
        }
        setLoading(false);
    }

    function handleFilterChange(val) {
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
        navigation.navigate(navigationRoutes.RISKASSESSMENTEDITOR, {
            riskAssessmentId: event.id,
        });
    }

    function handleAddRiskAssessmentPress() {
        navigation.navigate(navigationRoutes.RISKASSESSMENTEDITOR, {
            riskAssessmentId: undefined,
        });
    }

    function getPickers() {
        return pickerOptions;
    }

    async function loadPickerCallback(associatedSiteIds) {
        const authenticatedSitesObject = await setPickerCallback(
            associatedSiteIds
        );
        if (authenticatedSitesObject.data) {
            setAuthenticatedSites(authenticatedSitesObject.data);
        }
    }

    async function handleRefresh() {
        setRefreshing(true);
        await loadRiskAssessments(user.associatedSiteIds);
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
            <SearchFilters
                searchText={searchText}
                handleSearchTextChange={setSearchText}
                placeholder={'Title..'}
                handleFilterChange={handleFilterChange}
                selectedFilterValue={selectedFilterValue}
                setPickerCallback={getPickers}
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
