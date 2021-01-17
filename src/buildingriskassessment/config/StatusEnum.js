export const statusEnum = {
    NOT_ASSIGNED: {
        label: 'Not assigned',
        urlValue: 'NOT_ASSIGNED',
    },
    IN_PROGRESS: {
        label: 'In progress',
        urlValue: 'IN_PROGRESS',
    },
    COMPLETE: {
        label: 'Complete',
        urlValue: 'COMPLETE',
    },
    OVERDUE: {
        label: 'Overdue',
        urlValue: 'OVERDUE',
    },
};

export function getUrlValueFromLabel(label) {
    switch (label) {
        case statusEnum.NOT_ASSIGNED.label:
            return statusEnum.NOT_ASSIGNED.urlValue;
        case statusEnum.IN_PROGRESS.label:
            return statusEnum.IN_PROGRESS.urlValue;
        case statusEnum.COMPLETE.label:
            return statusEnum.COMPLETE.urlValue;
        case statusEnum.OVERDUE.label:
            return statusEnum.COMPLETE.urlValue;
        default:
            return '';
    }
}
