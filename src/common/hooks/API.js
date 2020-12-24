import axios from 'axios';
import { useState } from 'react';
import { BASE_URL } from '../../config/APIConfig';

export const useAPI = () => {
    async function loadData(httpString, requestMethod, requestInput = {}) {
        let response;
        switch (requestMethod) {
            case 'GET':
                response = await axios.get(httpString);
                break;
            case 'POST':
                response = await axios.post(httpString, requestInput);
                break;
            case 'DELETE':
                response = await axios.delete(httpString);
                break;
            default:
                return;
        }
        return response.data;
    }

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const [responseObject, setResponseObject] = useState({
        data: {},
        error: {},
    });

    async function getAuthenticatedSites(associatedSiteIdsObject) {
        let userSites;
        const userSiteResponseObject = { ...responseObject };
        try {
            userSites = await loadData(
                `${BASE_URL}/getSites`,
                'POST',
                associatedSiteIdsObject
            );
            userSiteResponseObject.data = userSites;
        } catch (e) {
            userSiteResponseObject.error = e;
        }
        return userSiteResponseObject;
    }

    return {
        loadData,
        loading,
        setLoading,
        error,
        setError,
        responseObject,
        setResponseObject,
        getAuthenticatedSites,
    };
};
