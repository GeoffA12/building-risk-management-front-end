import { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { useAPI } from '../../common/hooks/API';
import SiteRoles from '../../config/SiteRolesConfig';
import { BASE_URL } from '../../config/APIConfig';

export const useUser = () => {
    const defaultPageSize = 50;
    const { loadData, responseObject } = useAPI();
    const [userModel, setUserModel] = useState({
        id: '',
        entityTrail: '',
        createdAt: '',
        updatedAt: '',
        publisherId: '',
        siteRole: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        username: '',
        associatedSiteIds: '',
        authToken: '',
        hashPassword: '',
    });

    const [userModelPlayground, setUserModelPlayground] = useState(
        cloneDeep(userModel)
    );

    async function getUserProfile(userId) {
        let userProfile;
        const userProfileObject = { ...responseObject };
        try {
            userProfile = await loadData(
                `${BASE_URL}/getUserById?id=${userId}`,
                'GET'
            );
            userProfileObject.data = userProfile;
        } catch (e) {
            userProfileObject.error = e;
        }
        return userProfileObject;
    }

    async function getAllSites() {
        let sites;
        const siteObject = { ...responseObject };
        try {
            sites = await loadData(`${BASE_URL}/getAllSites`, 'GET');
            siteObject.data = sites;
        } catch (e) {
            siteObject.error = e;
        }
        return siteObject;
    }

    async function getAllSiteMaintenanceManagers() {
        let siteMaintenanceManagers;
        const smmObject = { ...responseObject };
        try {
            siteMaintenanceManagers = await loadData(
                `${BASE_URL}/getUsersBySiteRole?siteRole=SITEMAINTENANCEMGR`,
                'GET'
            );
            smmObject.data = siteMaintenanceManagers;
        } catch (e) {
            smmObject.error = e;
        }
        return smmObject;
    }

    // TODO: Go to the UserForm.js component and make sure we're updating the saveUser function accordingly.
    async function saveUser(userSites, updateUserInputObject, siteRole) {
        let updatedAssociatedSiteIds = [];
        userSites.map((site) => {
            updatedAssociatedSiteIds.push(site.id);
        });
        const siteRoleURLValue = SiteRoles[siteRole].urlValue;
        let updatedUser;
        const userObject = { ...responseObject };
        try {
            updatedUser = await loadData(
                `${BASE_URL}/update${siteRoleURLValue}`,
                'POST',
                updateUserInputObject
            );
            userObject.data = updatedUser;
        } catch (e) {
            userObject.error = e;
        }
        return userObject;
    }

    async function deleteUser(userPlayground, userId) {
        const siteRoleURLValue = SiteRoles[userPlayground.siteRole].urlValue;
        let deletedUser;
        const deletedUserObject = { ...responseObject };
        try {
            deletedUser = await loadData(
                `${BASE_URL}/delete${siteRoleURLValue}?id=${userPlayground.id}&userId=${userId}`,
                'DELETE'
            );
            deletedUserObject.data = deletedUser;
        } catch (e) {
            deletedUserObject.error = e;
        }
        return deletedUserObject;
    }

    async function getUsers(associatedSiteIds, userId) {
        let userPages;
        const userPageObject = { ...responseObject };
        try {
            userPages = await loadData(
                `${BASE_URL}/getAllUsersBySite`,
                'POST',
                {
                    pageInput: {
                        sortBy: 'updatedAt',
                        sortDirection: 'DESC',
                        pageSize: `${defaultPageSize}`,
                    },
                    siteIds: associatedSiteIds,
                    userId: userId,
                }
            );
            userPageObject.data = userPages.users;
        } catch (e) {
            userPageObject.error = e;
        }
        return userPageObject;
    }

    async function authenticateUserPassword(userId, password) {
        let authenticateUserPasswordData;
        let authenticateUserPasswordResponse = { ...responseObject };
        try {
            authenticateUserPasswordData = await loadData(
                `${BASE_URL}/authenticateUserPassword`,
                'POST',
                {
                    userId: userId,
                    password: password,
                }
            );
            authenticateUserPasswordResponse.data = authenticateUserPasswordData;
        } catch (e) {
            authenticateUserPasswordResponse.error = e;
        }
        return authenticateUserPasswordResponse;
    }

    async function getUserSites(associatedSiteIds) {
        let userSites;
        let userSitesResponse = { ...responseObject };
        try {
            userSites = await loadData(`${BASE_URL}/getSites`, 'POST', {
                siteIds: associatedSiteIds,
            });
            userSitesResponse.data = userSites;
        } catch (e) {
            userSitesResponse.error = e;
        }
        return userSitesResponse;
    }

    return {
        userModel,
        setUserModel,
        userModelPlayground,
        setUserModelPlayground,
        getUserProfile,
        getAllSites,
        getAllSiteMaintenanceManagers,
        saveUser,
        deleteUser,
        getUsers,
        authenticateUserPassword,
        getUserSites,
    };
};
