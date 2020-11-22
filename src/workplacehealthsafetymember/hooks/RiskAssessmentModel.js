import { useState } from 'react';

export const useRiskAssessment = () => {
    const [riskAssessmentModel, setRiskAssessmentModel] = useState({
        id: '',
        createdAt: '',
        updatedAt: '',
        entityTrail: [],
        publisherId: '',
        title: '',
        workOrder: 0,
        taskDescription: '',
        hazards: [],
        screeners: [],
    });
    return {
        riskAssessmentModel,
        setRiskAssessmentModel,
    };
};
