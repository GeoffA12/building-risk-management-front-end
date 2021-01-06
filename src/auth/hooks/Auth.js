import { useReducer, useMemo, useEffect } from 'react';
import axios from 'axios';
import SecureStorage from 'react-native-secure-storage';
import { createAction } from '../../utils/CreateAction';
import { BASE_URL } from '../../config/APIConfig';
import SiteRoles from '../../config/SiteRolesConfig';

export const useAuth = () => {
    const userKey = 'user';
    const [state, dispatch] = useReducer(
        (currentState, action) => {
            switch (action.type) {
                case 'SET_USER':
                    return {
                        ...state,
                        loading: false,
                        user: { ...action.payload },
                    };
                case 'REMOVE_USER':
                    return {
                        ...state,
                        user: undefined,
                    };
                case 'SET_LOADING_FOR_SPLASH_SCREEN':
                    return {
                        ...state,
                        loading: action.payload,
                    };
                default:
                    return currentState;
            }
        },
        {
            user: undefined,
            loading: true,
        }
    );
    const auth = useMemo(
        () => ({
            login: async (username, password) => {
                const url = `${BASE_URL}/authenticateUserLogin`;
                const response = await axios.post(url, {
                    username,
                    hashPassword: password,
                });
                const { data } = response;
                if (data) {
                    const user = {
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        username: data.username,
                        phone: data.phone,
                        email: data.email,
                        authToken: data.authToken,
                        associatedSiteIds: data.associatedSiteIds,
                        siteRole: data.siteRole,
                    };
                    await SecureStorage.setItem(userKey, JSON.stringify(user));
                    dispatch(createAction('SET_USER', user));
                }
            },
            logout: async () => {
                await SecureStorage.removeItem(userKey);
                dispatch(createAction('REMOVE_USER'));
            },
            register: async (
                siteRole,
                firstName,
                lastName,
                email,
                phone,
                username,
                password,
                siteId,
                siteMaintenanceManagerId
            ) => {
                console.log(SiteRoles[siteRole].urlValue);
                const url = `${BASE_URL}/create${SiteRoles[siteRole].urlValue}`;
                const userFormInput = {
                    siteRole,
                    firstName,
                    lastName,
                    email,
                    phone,
                    username,
                    password,
                    siteId,
                };

                if (siteRole !== 'SITEMAINTENANCEASSC') {
                    const response = await axios.post(url, userFormInput);
                    return response;
                } else {
                    const response = await axios.post(url, {
                        createUserInput: userFormInput,
                        siteMaintenanceManagerId,
                    });
                    return response;
                }
            },
        }),
        []
    );

    useEffect(() => {
        SecureStorage.getItem(userKey).then((user) => {
            console.log('user retrieved from local storage', user);
            if (user) {
                dispatch(createAction('SET_USER', JSON.parse(user)));

                // TODO: Before setting the global user, make sure that we authenticate the user's token using an API /authenticateToken once the backend supports this.
            } else {
                dispatch(createAction('SET_LOADING_FOR_SPLASH_SCREEN', false));
            }
        });
    }, []);

    return { auth, state };
};
