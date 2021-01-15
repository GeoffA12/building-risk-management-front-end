import cloneDeep from 'lodash/cloneDeep';
import { statusEnum } from '../config/StatusEnum';

export const buildingRiskAssessmentUtils = () => {
    function formatDueDate(date, time) {
        const timeObject = time ? time : date;
        let month =
            date.getMonth().toString().length < 2
                ? '0' + (date.getMonth() + 1).toString()
                : (date.getMonth() + 1).toString();
        let day =
            date.getDate().toString().length < 2
                ? '0' + date.getDate().toString()
                : date.getDate().toString();
        let hours =
            timeObject.getHours().toString().length < 2
                ? '0' + timeObject.getHours().toString()
                : timeObject.getHours().toString();
        let minutes =
            timeObject.getMinutes().toString().length < 2
                ? '0' + timeObject.getMinutes().toString()
                : timeObject.getMinutes().toString();
        let seconds =
            timeObject.getSeconds().toString().length < 2
                ? '0' + timeObject.getSeconds().toString()
                : timeObject.getSeconds().toString();
        return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    function formatRiskAssessmentSchedules(riskAssessmentSchedulesInput) {
        let scheduleContainer = [];
        for (let x = 0; x < riskAssessmentSchedulesInput.length; ++x) {
            let transformedSchedule = cloneDeep(
                riskAssessmentSchedulesInput[x]
            );
            transformedSchedule.dueDate = formatDueDate(
                new Date(transformedSchedule.dueDate)
            );
            transformedSchedule.status =
                statusEnum[transformedSchedule.status].label;
            scheduleContainer.push(transformedSchedule);
        }
        return scheduleContainer;
    }

    return {
        formatDueDate,
        formatRiskAssessmentSchedules,
    };
};
