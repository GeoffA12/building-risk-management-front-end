import { screenerEnum } from '../config/ScreenerEnum';

export const useRiskAssessmentScheduleValidation = () => {
    function validateScreeners(screenerList) {
        let isValid = true;
        for (let x = 0; x < screenerList.length; ++x) {
            let currentScreener = screenerList[x];
            if (currentScreener.response === screenerEnum.EMPTY.apiEnumValue) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    function validateHazards(hazardList) {
        let isValid = true;
        for (let x = 0; x < hazardList.length; ++x) {
            let currentHazard = hazardList[x];
            if (!currentHazard.didFulfillHazard) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    return {
        validateScreeners,
        validateHazards,
    };
};
