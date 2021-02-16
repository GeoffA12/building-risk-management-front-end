import { useState } from 'react';
import { BASE_URL } from '../../config/APIConfig';
import { useAPI } from '../../common/hooks/API';

export const useManagerCalendarHooks = () => {
    const { loadData, responseObject } = useAPI();
    const [
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
    ] = useState([]);

    const [agendaItems, setAgendaItems] = useState({});

    async function getAssociatesRiskAssessmentSchedules(id) {
        let riskAssessmentSchedules;
        const riskAssessmentSchedulesResponseObject = { ...responseObject };
        try {
            riskAssessmentSchedules = await loadData(
                `${BASE_URL}/getRiskAssessmentSchedulesOfSiteMaintenanceAssociatesOfManager?id=${id}&activeSchedules=true`,
                'GET'
            );
            riskAssessmentSchedulesResponseObject.data = riskAssessmentSchedules;
        } catch (e) {
            riskAssessmentSchedulesResponseObject.error = e;
        }
        return riskAssessmentSchedulesResponseObject;
    }

    return {
        getAssociatesRiskAssessmentSchedules,
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
        agendaItems,
        setAgendaItems,
    };
};
