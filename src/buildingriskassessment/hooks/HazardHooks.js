import { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { riskImpactEnum } from '../../riskassessmentcalendar/config/RiskImpactEnum';
import { riskCategoryEnum } from '../../riskassessmentcalendar/config/RiskCategoryEnum';

export const useHazard = () => {
    const [hazardModel, setHazardModel] = useState({
        description: '',
        riskImpact: riskImpactEnum.EMPTY.apiEnumValue,
        directions: '',
        riskCategory: riskCategoryEnum.EMPTY.apiEnumValue,
        comments: '',
        didFulfillHazard: false,
    });

    const [hazardPlayground, setHazardPlayground] = useState(
        cloneDeep(hazardModel)
    );

    return {
        hazardModel,
        setHazardModel,
        hazardPlayground,
        setHazardPlayground,
    };
};
