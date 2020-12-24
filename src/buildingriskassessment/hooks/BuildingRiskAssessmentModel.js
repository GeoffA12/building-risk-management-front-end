import { useState } from 'react';

export const useBuildingRiskAssessment = () => {
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
        siteMaintenanceAssociateIds: [],
        buildingId: '',
        title: '',
        description: '',
    });
    return {
        buildingRiskAssessmentModel,
        setBuildingRiskAssessmentModel,
    };
};
