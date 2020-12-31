import { useState } from 'react';
import { useRiskAssessment } from '../../riskassessment/hooks/RiskAssessmentHooks';
import { useAPI } from '../../common/hooks/API';
import { riskLevelEnum } from '../config/RiskLevelEnum';
import { statusEnum } from '../config/StatusEnum';
import { BASE_URL } from '../../config/APIConfig';

export const useBuildingRiskAssessment = () => {
    const { responseObject, setResponseObject, loadData } = useAPI();

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

    const [
        riskAssessmentScheduleModel,
        setRiskAssessmentScheduleModel,
    ] = useState({
        title: '',
        status: statusEnum.NOT_ASSIGNED.label,
        dueDate: '',
        riskLevel: riskLevelEnum.EMPTY.label,
        siteMaintenanceAssociateIds: [],
        workOrder: 0,
    });

    const { riskAssessmentModel, setRiskAssessmentModel } = useRiskAssessment();

    async function getBuildingRiskAssessments(associatedSiteIds) {
        let buildingRiskAssessments;
        let bulidingRiskAssessmentResponse = { ...responseObject };
        try {
            buildingRiskAssessments = await loadData(
                `${BASE_URL}/getBuildingRiskAssessmentsBySite`,
                'POST',
                {
                    associatedSiteIds: associatedSiteIds,
                }
            );
            bulidingRiskAssessmentResponse.data = buildingRiskAssessments;
        } catch (e) {
            bulidingRiskAssessmentResponse.error = e;
        }
        return bulidingRiskAssessmentResponse;
    }

    async function getBuildings(associatedSiteIds) {
        let buildings;
        let buildingsResponse = { ...responseObject };
        try {
            buildings = await loadData(
                `${BASE_URL}/getBuildingsBySite`,
                'POST',
                {
                    associatedSiteIds: associatedSiteIds,
                }
            );
            buildingsResponse.data = buildings;
        } catch (e) {
            buildingsResponse.error = e;
        }
        return buildingsResponse;
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

    return {
        buildingRiskAssessmentModel,
        setBuildingRiskAssessmentModel,
        riskAssessmentScheduleModel,
        setRiskAssessmentScheduleModel,
        riskAssessmentModel,
        setRiskAssessmentModel,
        getBuildingRiskAssessments,
        getBuildings,
        getSiteMaintenanceAssociates,
    };
};
