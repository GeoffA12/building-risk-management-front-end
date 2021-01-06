import { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { useAPI } from '../../common/hooks/API';
import { BASE_URL } from '../../config/APIConfig';
import { riskAssessmentPickerOptions } from '../config/PickerOptions';

export const useRiskAssessment = () => {
    const { responseObject, loadData, getAuthenticatedSites } = useAPI();
    const [riskAssessmentModel, setRiskAssessmentModel] = useState({
        id: '',
        createdAt: '',
        updatedAt: '',
        entityTrail: [],
        publisherId: '',
        title: '',
        taskDescription: '',
        hazards: [],
        screeners: [],
        riskAssessmentScheduleIds: [],
    });

    const [riskAssessmentPlayground, setRiskAssessmentPlayground] = useState(
        cloneDeep(riskAssessmentModel)
    );

    function getInitialPickerState() {
        return [
            {
                label: riskAssessmentPickerOptions.ALL_ASSESSMENTS.label,
                value: riskAssessmentPickerOptions.ALL_ASSESSMENTS.value,
            },
            {
                label: riskAssessmentPickerOptions.MY_ASSESSMENTS.label,
                value: riskAssessmentPickerOptions.ALL_ASSESSMENTS.value,
            },
        ];
    }

    async function getRiskAssessments(associatedSiteIds) {
        let riskAssessmentPages;
        const riskAssessmentResponseObject = { ...responseObject };
        try {
            riskAssessmentPages = await loadData(
                `${BASE_URL}/getRiskAssessmentsBySite`,
                'POST',
                {
                    pageInput: {
                        sortBy: 'updatedAt',
                        sortDirection: 'DESC',
                    },
                    associatedSiteIds: associatedSiteIds,
                }
            );
            riskAssessmentResponseObject.data = riskAssessmentPages;
        } catch (e) {
            riskAssessmentResponseObject.error = e;
        }
        return riskAssessmentResponseObject;
    }

    async function setPickerCallback(associatedSiteIds) {
        const authenticatedSitesObject = await getAuthenticatedSites({
            siteIds: associatedSiteIds,
        });
        return authenticatedSitesObject;
    }

    async function getRiskAssessment(id) {
        let riskAssessment;
        let riskAssessmentResponseObject = { ...responseObject };
        try {
            riskAssessment = await loadData(
                `${BASE_URL}/getRiskAssessmentById?id=${id}`,
                'GET'
            );
            riskAssessmentResponseObject.data = riskAssessment;
        } catch (e) {
            riskAssessmentResponseObject.error = e;
        }
        return riskAssessmentResponseObject;
    }

    async function saveRiskAssessment(playground, userId) {
        let uri;
        let inputObject;
        if (playground.id) {
            uri = 'updateRiskAssessment';
            inputObject = {
                id: playground.id,
                publisherId: userId,
                title: playground.title,
                taskDescription: playground.taskDescription,
                hazards: playground.hazards,
                screeners: playground.screeners,
            };
        } else {
            uri = 'createRiskAssessment';
            inputObject = {
                publisherId: userId,
                title: playground.title,
                taskDescription: playground.taskDescription,
                hazards: playground.hazards,
                screeners: playground.screeners,
            };
        }
        let riskAssessment;
        let riskAssessmentResponseObject = { ...responseObject };

        try {
            riskAssessment = await loadData(
                `${BASE_URL}/${uri}`,
                'POST',
                inputObject
            );
            riskAssessmentResponseObject.data = riskAssessment;
        } catch (e) {
            riskAssessmentResponseObject.error = e;
        }
        return riskAssessmentResponseObject;
    }

    async function deleteRiskAssessment(riskAssessmentId, userId) {
        let deletedRiskAssessment;
        let deletedRiskAssessmentResponseObject = { ...responseObject };
        try {
            deletedRiskAssessment = await loadData(
                `${BASE_URL}/deleteRiskAssessment?id=${riskAssessmentId}&publisherId=${userId}`,
                'DELETE'
            );
            deletedRiskAssessmentResponseObject.data = deletedRiskAssessment;
        } catch (e) {
            deletedRiskAssessmentResponseObject.error = e;
        }
        return deletedRiskAssessmentResponseObject;
    }

    return {
        riskAssessmentModel,
        setRiskAssessmentModel,
        riskAssessmentPlayground,
        setRiskAssessmentPlayground,
        getRiskAssessments,
        getInitialPickerState,
        setPickerCallback,
        getRiskAssessment,
        saveRiskAssessment,
        deleteRiskAssessment,
    };
};
