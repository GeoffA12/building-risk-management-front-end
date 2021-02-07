import { useState } from 'react';
import { BASE_URL } from '../../config/APIConfig';
import { useAPI } from '../../common/hooks/API';
import { convertUTCDateToLocalDate } from '../../utils/Time.js';

export const useCalendarHooks = () => {
    const { loadData, responseObject } = useAPI();
    const [
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
    ] = useState([]);

    const [
        assignedRiskAssessmentScheduleIds,
        setAssignedRiskAssessmentScheduleIds,
    ] = useState([]);

    const [agendaItems, setAgendaItems] = useState([]);

    async function getSiteMaintenanceAssociateById(userId) {
        let siteMaintenanceAssociate;
        const siteMaintenanceAssociateResponseObject = { ...responseObject };
        try {
            siteMaintenanceAssociate = await loadData(
                `${BASE_URL}/getSiteMaintenanceAssociateById?id=${userId}`,
                'GET'
            );
            siteMaintenanceAssociateResponseObject.data = siteMaintenanceAssociate;
        } catch (e) {
            siteMaintenanceAssociateResponseObject.error = e;
        }
        return siteMaintenanceAssociateResponseObject;
    }

    async function getAssignedRiskAssessmentSchedules(
        riskAssessmentScheduleIdsList
    ) {
        let riskAssessmentSchedules = [];
        let riskAssessmentSchedulesResponse = { ...responseObject };
        if (riskAssessmentScheduleIdsList.length > 0) {
            try {
                riskAssessmentSchedules = await loadData(
                    `${BASE_URL}/getRiskAssessmentSchedulesByRiskAssessmentSchedulesIdsList`,
                    'POST',
                    {
                        riskAssessmentScheduleIds: riskAssessmentScheduleIdsList,
                    }
                );
                riskAssessmentSchedulesResponse.data = riskAssessmentSchedules;
            } catch (e) {
                riskAssessmentSchedulesResponse.error = e;
            }
        }
        return riskAssessmentSchedulesResponse;
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
        assignedRiskAssessmentScheduleIds,
        setAssignedRiskAssessmentScheduleIds,
        getAssignedRiskAssessmentSchedules,
        getSiteMaintenanceAssociateById,
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
        formatRiskAssessmentSchedules,
        agendaItems,
        setAgendaItems,
    };
};
