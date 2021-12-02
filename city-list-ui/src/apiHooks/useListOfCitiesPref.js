import {useState} from "react";
import Configs from "../configs";
import {useErrorNotificationHandling} from "../uiCore/useErrorNotificationHandling";

/**
 * This hook is responsible to fetch the data of the cities prefer. It provides an array of
 * checked items, and a flag to determine the loading status.
 * @returns {{isLoading: boolean, fetchListOfCitiesPref: fetchListOfCitiesPref, checkedItems: *[]}}
 */
export function useListOfCitiesPref() {
    const [checkedItems, setCheckedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {handleConnectionIssue} = useErrorNotificationHandling();

    const fetchListOfCitiesPref = function(page, itemAcum = []) {
        const url = new URL(`${Configs.getBackendEndpoint()}/preferences/cities`);
        const pageSize = Configs.getPageSize();
        const params = {offset: pageSize * page, limit: pageSize};
        url.search = new URLSearchParams(params).toString();
        setIsLoading(true);
        fetch(url.toString())
            .then(result => {
                    if (result.status === 200) {
                        result.json().then(r => {
                            const newItemAcum = itemAcum.concat(r.data);
                            if (r.total > (params.offset + pageSize)) {
                                fetchListOfCitiesPref(page + 1, newItemAcum);
                            } else {
                                setIsLoading(false);
                                setCheckedItems(newItemAcum);
                            }
                        })
                    } else {
                        setTimeout(() => fetchListOfCitiesPref(page), Configs.getRetryTime()); //re-try
                    }
                },
                e => {
                    handleConnectionIssue();
                });
    }

    return {
        fetchListOfCitiesPref,
        checkedItems,
        isLoading
    }
}
