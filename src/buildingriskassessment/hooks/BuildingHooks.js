import { useAPI } from '../../common/hooks/API';
import { BASE_URL } from '../../config/APIConfig';

export const useBuilding = () => {
    const { responseObject, loadData } = useAPI();

    async function getBuildingsByAssociatedSiteIds(associatedSiteIds) {
        let buildings;
        let buildingsResponse = { ...responseObject };
        try {
            buildings = await loadData(
                `${BASE_URL}/getBuildingsByAssociatedSiteIds`,
                'POST',
                {
                    associatedSiteIds: associatedSiteIds,
                }
            );
            buildingsResponse.data = buildings;
        } catch (e) {
            buildingsResponse.error = e;
        }
        return buildingsResponse;
    }

    return {
        getBuildingsByAssociatedSiteIds,
    };
};
