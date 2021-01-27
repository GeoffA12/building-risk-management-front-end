import { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { useAPI } from '../../common/hooks/API';
import { riskLevelEnum } from '../config/RiskLevelEnum';
import { statusEnum, getUrlValueFromLabel } from '../config/StatusEnum';
import { BASE_URL } from '../../config/APIConfig';

export const useRiskAssessmentSchedule = () => {
    const { responseObject, loadData } = useAPI();

    const [
        riskAssessmentScheduleModel,
        setRiskAssessmentScheduleModel,
    ] = useState({
        id: '',
        createdAt: '',
        updatedAt: '',
        entityTrail: [],
        publisherId: '',
        title: '',
        status: statusEnum.NOT_ASSIGNED.urlValue,
        dueDate: null,
        riskLevel: riskLevelEnum.EMPTY.urlValue,
        siteMaintenanceAssociateIds: [],
        workOrder: 0,
        hazards: [],
        screeners: [],
        buildingRiskAssessmentId: '',
        riskAssessmentId: '',
    });

    const [
        riskAssessmentSchedulePlayground,
        setRiskAssessmentSchedulePlayground,
    ] = useState(cloneDeep(riskAssessmentScheduleModel));

    async function createRiskAssessmentSchedule(
        riskAssessmentScheduleInput,
        userId
    ) {
        let riskAssessmentSchedule;
        let riskAssessmentScheduleResponse = { ...responseObject };
        try {
            riskAssessmentSchedule = await loadData(
                `${BASE_URL}/createRiskAssessmentSchedule`,
                'POST',
                {
                    title: riskAssessmentScheduleInput.title,
                    publisherId: userId,
                    dueDate: riskAssessmentScheduleInput.dueDate,
                    riskLevel: riskAssessmentScheduleInput.riskLevel,
                    siteMaintenanceAssociateIds:
                        riskAssessmentScheduleInput.siteMaintenanceAssociateIds,
                    workOrder: riskAssessmentScheduleInput.workOrder,
                    hazards: riskAssessmentScheduleInput.hazards,
                    screeners: riskAssessmentScheduleInput.screeners,
                    buildingRiskAssessmentId:
                        riskAssessmentScheduleInput.buildingRiskAssessmentId,
                    riskAssessmentId:
                        riskAssessmentScheduleInput.riskAssessmentId,
                }
            );
            riskAssessmentScheduleResponse.data = riskAssessmentSchedule;
        } catch (e) {
            riskAssessmentScheduleResponse.error = e;
        }
        return riskAssessmentScheduleResponse;
    }

    async function getRiskAssessmentSchedule(id) {
        let riskAssessmentSchedule;
        let riskAssessmentScheduleResponse = { ...responseObject };
        try {
            riskAssessmentSchedule = await loadData(
                `${BASE_URL}/getRiskAssessmentScheduleById?id=${id}`,
                'GET'
            );
            riskAssessmentScheduleResponse.data = riskAssessmentSchedule;
        } catch (e) {
            riskAssessmentScheduleResponse.error = e;
        }
        return riskAssessmentScheduleResponse;
    }

    async function updateRiskAssessmentSchedule(
        userId,
        riskAssessmentScheduleId,
        riskAssessmentScheduleInput
    ) {
        let riskAssessmentSchedule;
        let riskAssessmentScheduleResponse = { ...responseObject };
        try {
            riskAssessmentSchedule = await loadData(
                `${BASE_URL}/updateRiskAssessmentSchedule`,
                'POST',
                {
                    id: riskAssessmentScheduleId,
                    createRiskAssessmentScheduleInput: {
                        title: riskAssessmentScheduleInput.title,
                        publisherId: userId,
                        dueDate: riskAssessmentScheduleInput.dueDate,
                        riskLevel: riskAssessmentScheduleInput.riskLevel,
                        siteMaintenanceAssociateIds:
                            riskAssessmentScheduleInput.siteMaintenanceAssociateIds,
                        workOrder: riskAssessmentScheduleInput.workOrder,
                        hazards: riskAssessmentScheduleInput.hazards,
                        screeners: riskAssessmentScheduleInput.screeners,
                        buildingRiskAssessmentId:
                            riskAssessmentScheduleInput.buildingRiskAssessmentId,
                        riskAssessmentId:
                            riskAssessmentScheduleInput.riskAssessmentId,
                    },
                }
            );
            riskAssessmentScheduleResponse.data = riskAssessmentSchedule;
        } catch (e) {
            riskAssessmentScheduleResponse.error = e;
        }
        return riskAssessmentScheduleResponse;
    }

    async function deleteRiskAssessmentSchedule(
        riskAssessmentScheduleId,
        publisherId
    ) {
        let deletedMessage;
        let deletedRiskAssessmentResponse = { ...responseObject };
        try {
            deletedMessage = await loadData(
                `${BASE_URL}/deleteRiskAssessmentSchedule?riskAssessmentScheduleId=${riskAssessmentScheduleId}&publisherId=${publisherId}`,
                'DELETE'
            );
            deletedRiskAssessmentResponse.data = deletedMessage;
        } catch (e) {
            deletedRiskAssessmentResponse.error = e;
        }
        return deletedRiskAssessmentResponse;
    }

    async function getRiskAssessmentSchedulesByBuildingRiskAssessmentId(
        buildingRiskAssessmentId
    ) {
        let riskAssessmentScheduleResponse = { ...responseObject };
        let riskAssessmentSchedules;
        try {
            riskAssessmentSchedules = await loadData(
                `${BASE_URL}/getRiskAssessmentSchedulesByBuildingRiskAssessmentId?buildingRiskAssessmentId=${buildingRiskAssessmentId}`,
                'GET'
            );
            riskAssessmentScheduleResponse.data = riskAssessmentSchedules;
        } catch (e) {
            riskAssessmentScheduleResponse.error = e;
        }
        return riskAssessmentScheduleResponse;
    }

    async function getRiskAssessmentSchedulesByRiskAssessmentIdListOfBuilding(
        riskAssessmentIds
    ) {
        let riskAssessmentSchedules;
        let riskAssessmentScheduleResponse = { ...responseObject };
        try {
            riskAssessmentSchedules = await loadData(
                `${BASE_URL}/getRiskAssessmentSchedulesByRiskAssessmentIdListOfBuilding`,
                'POST',
                {
                    riskAssessmentIds: riskAssessmentIds,
                }
            );
            riskAssessmentScheduleResponse.data = riskAssessmentSchedules;
        } catch (e) {
            riskAssessmentScheduleResponse.error = e;
        }
        return riskAssessmentScheduleResponse;
    }

    async function attachBuildingRiskAssessmentIdToRiskAssessmentSchedules(
        riskAssessmentSchedules,
        publisherId,
        buildingRiskAssessmentId
    ) {
        let attachmentResponse;
        let attachmentResponseObject = { ...responseObject };
        try {
            attachmentResponse = await loadData(
                `${BASE_URL}/attachBuildingRiskAssessmentIdToRiskAssessmentSchedules`,
                'POST',
                {
                    riskAssessmentScheduleList: riskAssessmentSchedules,
                    buildingRiskAssessmentId: buildingRiskAssessmentId,
                    publisherId: publisherId,
                }
            );
            attachmentResponseObject.data = attachmentResponse;
        } catch (e) {
            attachmentResponseObject.error = e;
        }
        return attachmentResponseObject;
    }

    return {
        riskAssessmentScheduleModel,
        setRiskAssessmentScheduleModel,
        riskAssessmentSchedulePlayground,
        setRiskAssessmentSchedulePlayground,
        createRiskAssessmentSchedule,
        getRiskAssessmentSchedule,
        updateRiskAssessmentSchedule,
        deleteRiskAssessmentSchedule,
        getRiskAssessmentSchedulesByBuildingRiskAssessmentId,
        getRiskAssessmentSchedulesByRiskAssessmentIdListOfBuilding,
        attachBuildingRiskAssessmentIdToRiskAssessmentSchedules,
    };
};
