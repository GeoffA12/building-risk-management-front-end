import { useState } from 'react';
import { BASE_URL } from '../../config/APIConfig';
import { useAPI } from '../../common/hooks/API';

export const useCalendarHooks = () => {
    const { loadData } = useAPI();
    const [riskAssessmentScheduleList, setRiskAssessmentScheduleList] = useState([]);
    async function getRiskAssessmentSchedules(riskAssessmentScheduleIdsList) {
        console.log(riskAssessmentScheduleIdsList);
        if (riskAssessmentScheduleIdsList.length > 0) {
            //const rawData = JSON.stringify({
            //    riskAssessmentScheduleIds: riskAssessmentScheduleIdsList,
            //});
            const riskAssessmentSchedules = await loadData(`${BASE_URL}/getRiskAssessmentSchedulesByRiskAssessmentSchedulesIdsList`, 'POST', {
                riskAssessmentScheduleIds: riskAssessmentScheduleIdsList
            });

            setRiskAssessmentScheduleList(riskAssessmentSchedules);
            console.log(riskAssessmentSchedules);
        }
    }
    return {
        getRiskAssessmentSchedules,
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList
    }
}