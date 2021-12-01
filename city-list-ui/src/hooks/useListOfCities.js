import {useState} from "react";
import Configs from "../configs";


/**
 * This hook contains the logic to paginate the infinite scroll in a list of cities.
 * Also handle filtering logic.
 * It provides, the last filter value, flags to detect end of list, a method to fetch
 * more pages, an array with the last list of cities and a event handler for filter changes
 * @returns {{filter: string, noMoreDataFlag: boolean, getMoreCities: getMoreCities, citiesCollection: *[],
 * onFilterChangeHandler: onFilterChangeHandler}}
 */
export function useListOfCities() {
    const [citiesCollection, setCitiesCollection] = useState([]);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('');
    const [noMoreDataFlag, setNoMoreDataFlag] = useState(false);
    const [controllerRef, setControllerRef] = useState();

    const fetchCityData = function (pageValue, filterValue) {
        if (controllerRef) {
            controllerRef.abort();
        }
        const controller = new AbortController();
        setControllerRef(controller);

        const pageSize = Configs.getPageSize();
        const offset = pageSize * pageValue;
        const url = new URL(`${Configs.getBackendEndpoint()}/cities`);
        const params = {offset, limit: pageSize, filter: filterValue || ''};
        url.search = new URLSearchParams(params).toString();
        fetch(url.toString(), {signal: controller.signal})
            .then(result => {
                    if (result.status === 200) {
                        result.json().then(r => {
                            setCitiesCollection(citiesCollection.concat(r.data));
                            if (r.total > (offset + pageSize)) {
                                setPage(page + 1);
                            } else {
                                setNoMoreDataFlag(true);
                            }
                        })
                    } else {
                        setTimeout(() => getMoreCities(filterValue), Configs.getRetryTime());
                    }
                },
                e => {
                    console.log('running error promise');
                });
    }

    const getMoreCities = (filterValue) => {
        fetchCityData(page, filterValue);
    };

    const onFilterChangeHandler = (newFilter) => {
        setFilter(newFilter);
        setPage(0);
        setCitiesCollection([]);
        setNoMoreDataFlag(false);
    }

    return {
        citiesCollection,
        getMoreCities,
        onFilterChangeHandler,
        filter,
        noMoreDataFlag
    }
}
