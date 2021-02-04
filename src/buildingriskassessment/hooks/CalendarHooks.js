import { useState } from 'react';
import { BASE_URL } from '../../config/APIConfig';
import { useAPI } from '../../common/hooks/API';
import { convertUTCDateToLocalDate } from '../../utils/Time.js';

export const useCalendarHooks = () => {
    const { loadData } = useAPI();
    const [
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
    ] = useState([]);

    const [agendaItems, setAgendaItems] = useState([]);

    async function getAssociatesRiskAssessmentSchedules(id) {
        const riskAssessmentSchedules = await loadData(
            `${BASE_URL}/getRiskAssessmentSchedulesOfSiteMaintenanceAssociatesOfManager?id=${id}&activeSchedules=true`,
            'GET'
        );
        return riskAssessmentSchedules;
    }

    function formatRiskAssessmentSchedules(riskAssessmentSchedules) {
        const items = {};
        for (let x = 0; x < riskAssessmentSchedules.length; ++x) {
            const schedule = riskAssessmentSchedules[x];
            items[schedule.dueDate.slice(0, 10)] = [
                {
                    name:
                        schedule.title +
                        '\n\n' +
                        convertUTCDateToLocalDate(schedule.dueDate) +
                        '\n' +
                        formatStatus(schedule.status),
                    id: schedule.id,
                },
            ];
        }
        return items;
    }

    function formatStatus(status) {
        const splitStatus = status.split('_');
        var formattedStatus = '';
        for (const word in splitStatus) {
            var lower = splitStatus[word].toLowerCase();
            var capital = lower[0].toUpperCase() + lower.slice(1);
            formattedStatus += capital + ' ';
        }
        return formattedStatus;
    }

    return {
        getAssociatesRiskAssessmentSchedules,
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
        formatRiskAssessmentSchedules,
        agendaItems,
        setAgendaItems,
    };
};
