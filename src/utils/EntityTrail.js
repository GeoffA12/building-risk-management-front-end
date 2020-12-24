export const entityTrailUtils = () => {
    function getUserLastUpdatedId(entity) {
        const entityTrail = entity.entityTrail;
        const mostRecentUpdate = entityTrail[entityTrail.length - 1];
        return mostRecentUpdate.userId;
    }

    return {
        getUserLastUpdatedId,
    };
};
