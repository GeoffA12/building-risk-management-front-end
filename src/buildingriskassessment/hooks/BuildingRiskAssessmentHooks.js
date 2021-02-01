import { useState } from 'react';
import { useRiskAssessment } from '../../riskassessment/hooks/RiskAssessmentHooks';
import { useAPI } from '../../common/hooks/API';
import { filterOptions } from '../config/FilterOptions';
import { BASE_URL } from '../../config/APIConfig';

export const useBuildingRiskAssessment = () => {
    const { responseObject, loadData } = useAPI();

    const [
        buildingRiskAssessmentModel,
        setBuildingRiskAssessmentModel,
    ] = useState({
        id: '',
        createdAt: '',
        updatedAt: '',
        entityTrail: [],
        publisherId: '',
        riskAssessmentIds: [],
        buildingId: '',
        title: '',
        description: '',
    });

    const { riskAssessmentModel, setRiskAssessmentModel } = useRiskAssessment();

    function getInitialPickerState() {
        return [
            {
                label: filterOptions.INITIAL_VALUE.label,
                value: filterOptions.INITIAL_VALUE.value,
            },
            {
                label: filterOptions.ALL_BUILDING_ASSESSMENTS.label,
                value: filterOptions.ALL_BUILDING_ASSESSMENTS.value,
            },
            {
                label: filterOptions.MY_BUILDING_ASSESSMENTS.label,
                value: filterOptions.MY_BUILDING_ASSESSMENTS.value,
            },
        ];
    }

    async function getBuildingRiskAssessments(associatedSiteIds) {
        let buildingRiskAssessments;
        let bulidingRiskAssessmentResponse = { ...responseObject };
        try {
            buildingRiskAssessments = await loadData(
                `${BASE_URL}/getBuildingRiskAssessmentsBySite`,
                'POST',
                {
                    pageInput: {
                        sortBy: 'updatedAt',
                        sortDirection: 'DESC',
                    },
                    getEntityBySiteInput: {
                        associatedSiteIds: associatedSiteIds,
                    },
                }
            );
            bulidingRiskAssessmentResponse.data =
                buildingRiskAssessments.buildingriskassessments;
        } catch (e) {
            bulidingRiskAssessmentResponse.error = e;
        }
        return bulidingRiskAssessmentResponse;
    }

    async function getSiteMaintenanceAssociates(associatedSiteIds) {
        let siteMaintenanceAssociates;
        let siteMaintenanceAssociatesResponse = { ...responseObject };
        try {
            siteMaintenanceAssociates = await loadData(
                `${BASE_URL}/getSiteMaintenanceAssociatesBySite`,
                'POST',
                {
                    associatedSiteIds: associatedSiteIds,
                }
            );
            siteMaintenanceAssociatesResponse.data = siteMaintenanceAssociates;
        } catch (e) {
            siteMaintenanceAssociatesResponse.error = e;
        }
        return siteMaintenanceAssociatesResponse;
    }

    async function saveBuildingRiskAssessment(uri, inputObject) {
        let buildingRiskAssessmentResponse = { ...responseObject };
        let buildingRiskAssessment;
        try {
            buildingRiskAssessment = await loadData(
                `${BASE_URL}/${uri}`,
                'POST',
                inputObject
            );
            buildingRiskAssessmentResponse.data = buildingRiskAssessment;
        } catch (e) {
            buildingRiskAssessmentResponse.error = e;
        }
        return buildingRiskAssessmentResponse;
    }

    async function getBuildingRiskAssessment(buildingRiskAssessmentId) {
        let buildingRiskAssessmentResponse = { ...responseObject };
        let buildingRiskAssessment;
        try {
            buildingRiskAssessment = await loadData(
                `${BASE_URL}/getBuildingRiskAssessmentById?id=${buildingRiskAssessmentId}`,
                'GET'
            );
            buildingRiskAssessmentResponse.data = buildingRiskAssessment;
        } catch (e) {
            buildingRiskAssessment.error = e;
        }
        return buildingRiskAssessmentResponse;
    }

    async function deleteBuildingRiskAssessment(id, publisherId) {
        let deletedBuildingRiskAssessment;
        let deletedBuildingRiskAssessmentResponse = { ...responseObject };
        try {
            deletedBuildingRiskAssessment = await loadData(
                `${BASE_URL}/deleteBuildingRiskAssessment?id=${id}&publisherId=${publisherId}`,
                'DELETE'
            );
            deletedBuildingRiskAssessmentResponse.data = deletedBuildingRiskAssessment;
        } catch (e) {
            deletedBuildingRiskAssessmentResponse.error = e;
        }
        return deletedBuildingRiskAssessmentResponse;
    }

    return {
        buildingRiskAssessmentModel,
        setBuildingRiskAssessmentModel,
        riskAssessmentModel,
        setRiskAssessmentModel,
        getBuildingRiskAssessments,
        getSiteMaintenanceAssociates,
        saveBuildingRiskAssessment,
        getBuildingRiskAssessment,
        getInitialPickerState,
        deleteBuildingRiskAssessment,
    };
};
