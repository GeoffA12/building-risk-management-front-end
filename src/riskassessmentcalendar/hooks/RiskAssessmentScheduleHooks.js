import { useAPI } from '../../common/hooks/API';
import { BASE_URL } from '../../config/APIConfig';

export const useRiskAssessmentSchedule = () => {
    const { responseObject, loadData } = useAPI();

    async function getRiskAssessmentScheduleById(id) {
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

    return {
        getRiskAssessmentScheduleById,
    };
};
