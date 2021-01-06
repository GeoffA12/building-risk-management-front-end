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

    async function saveUser(userPlayground, userSites, userId) {
        let updatedAssociatedSiteIds = [];
        userSites.map((site) => {
            updatedAssociatedSiteIds.push(site.id);
        });
        const siteRoleURLValue =
            SiteRoles[userModelPlayground.siteRole].urlValue;
        let updatedUser;
        const userObject = { ...responseObject };
        try {
            updatedUser = await loadData(
                `${BASE_URL}/update${siteRoleURLValue}`,
                'POST',
                {
                    id: userPlayground.id,
                    username: userPlayground.username,
                    siteRole: userPlayground.siteRole,
                    firstName: userPlayground.firstName,
                    lastName: userPlayground.lastName,
                    email: userPlayground.email,
                    phone: userPlayground.phone,
                    siteIds: updatedAssociatedSiteIds,
                    userId: userId,
                }
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
    };
};
