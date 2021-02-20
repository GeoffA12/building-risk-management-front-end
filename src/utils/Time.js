export const convertUTCDateToLocalDate = (dateString, isCurrentTime) => {
    let date = new Date(dateString);

    let offset = date.getTimezoneOffset();

    if (!isCurrentTime) {
        date.setHours(date.getHours() + offset / 60);
    }

    // if (date.getHours() === 17 || date.getHours() === 18) {
    //     date.setMinutes(date.getMinutes() + offset);
    // }

    // if (date.getHours() === 11) {
    //     date.setHours(date.getHours() + 6);
    // }

    let militaryHours = date.getHours();
    let localHours = militaryHours;
    let isAM = true;
    if (militaryHours >= 12) {
        localHours = militaryHours % 12;
        isAM = false;
    }
    // The hour '0' in military time should be '12' in local time.
    localHours = localHours ? localHours : 12;

    let militaryMinutes = date.getMinutes();
    let localMinutes =
        militaryMinutes < 10 ? '0' + militaryMinutes : militaryMinutes;

    let timeSuffix = isAM ? 'AM' : 'PM';

    let dateOfWeek = date.toDateString();
    let strTimeToFormat =
        localHours + ':' + localMinutes + ' ' + timeSuffix + ' ' + dateOfWeek;

    return strTimeToFormat;
};
