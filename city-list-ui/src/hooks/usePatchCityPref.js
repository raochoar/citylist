import {useState} from "react";
import Configs from "../configs";

/**
 * This hook is responsible of change the state of a city selection,
 * calling to the API.
 * @returns {{isLoading: boolean, setIsLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void, setCheckedValue: (value: (((prevState: boolean) => boolean) | boolean)) => void, checkedValue: boolean, patchItemData: patchItemData}}
 */
export function usePatchCityPref() {
    const [checkedValue, setCheckedValue] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const patchItemData = function(cityId, newCheckedValue) {
        const body = {};
        body[cityId] = newCheckedValue;
        setIsLoading(true);
        fetch(`${Configs.getBackendEndpoint()}/preferences/cities`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(result => {
                if (result.status === 204) {
                    setCheckedValue(newCheckedValue);
                    setIsLoading(false);
                } else {
                    console.log('Server error found');
                    patchItemData(cityId, newCheckedValue); //re-try
                }
            },
            e => {
                console.log('Connection issue: ' + JSON.stringify(e));
            });
    }

    return {
        patchItemData,
        checkedValue,
        isLoading,
        setIsLoading,
        setCheckedValue
    }
}
