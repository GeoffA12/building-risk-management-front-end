import SiteRoles from '../config/SiteRolesConfig';

export const pickerUtils = () => {
    const defaultFirstOptionValue = '0';
    function setPickerOptions(firstLabel, dataArray, labelPropName, valueProp) {
        let pickerOptions = setInitialPickerState(firstLabel);
        for (let x = 0; x < dataArray.length; ++x) {
            let optionToAdd = {};
            optionToAdd.label = dataArray[x][labelPropName];
            optionToAdd.value = dataArray[x][valueProp];
            pickerOptions.push(optionToAdd);
        }
        return pickerOptions;
    }

    function setSiteRolePickerOptions(
        firstLabel,
        dataArray,
        labelPropName,
        valueProp
    ) {
        let pickerOptions = setInitialPickerState(firstLabel);
        for (let x = 0; x < dataArray.length; ++x) {
            const optionToAdd = {};
            optionToAdd.label = SiteRoles[dataArray[x]][labelPropName];
            optionToAdd.value = SiteRoles[dataArray[x]][valueProp];
            pickerOptions.push(optionToAdd);
        }
        return pickerOptions;
    }

    function setInitialPickerState(firstLabel) {
        const pickerOptions = [];
        pickerOptions.push({
            label: `${firstLabel}`,
            value: `${defaultFirstOptionValue}`,
        });
        return pickerOptions;
    }

    return {
        setPickerOptions,
        setSiteRolePickerOptions,
    };
};
