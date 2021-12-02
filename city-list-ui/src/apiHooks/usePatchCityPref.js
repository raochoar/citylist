import {useState} from "react";
import Configs from "../configs";
import {useErrorNotificationHandling} from "../uiCore/useErrorNotificationHandling";

/**
 * This hook is responsible of change the state of a city selection,
 * calling to the API.
 * @returns {{isLoading: boolean, setIsLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void, setCheckedValue: (value: (((prevState: boolean) => boolean) | boolean)) => void, checkedValue: boolean, patchItemData: patchItemData}}
 */
export function usePatchCityPref() {
    const [checkedValue, setCheckedValue] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {handleConnectionIssue} = useErrorNotificationHandling();

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
                    setTimeout(() => patchItemData(cityId, newCheckedValue), Configs.getRetryTime());
                }
            },
            e => {
                handleConnectionIssue();
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
