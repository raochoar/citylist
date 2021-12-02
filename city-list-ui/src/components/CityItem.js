import {Form, ListGroup, Spinner, Stack} from "react-bootstrap";
import {useEffect} from "react";
import {usePatchCityPref} from "../apiHooks/usePatchCityPref";

/**
 * This component renders and handle the logic of a city item.
 * It calls a hook to patch the data preferences and receive the
 * checkedItems to handle that state.
 * @param city
 * @param checkedItems
 * @param isCheckedItemLoading
 * @returns {JSX.Element}
 * @constructor
 */
function CityItem({city, checkedItems = [], isCheckedItemLoading = false}) {

    const {patchItemData, checkedValue, isLoading, setIsLoading, setCheckedValue} = usePatchCityPref();

    useEffect(() => {
        setIsLoading(isCheckedItemLoading);
        // eslint-disable-next-line
    }, [isCheckedItemLoading]);

    useEffect(() => {
        setCheckedValue(checkedItems.includes(city.geonameid));
        // eslint-disable-next-line
    }, [checkedItems, city]);


    function cityClicked(cityId) {
        if (!isLoading) {
            const newCheckedValue = !checkedValue;
            patchItemData(cityId, newCheckedValue);
        }
    }

    return (
        <ListGroup.Item action={!isLoading} className="d-flex justify-content-between align-items-start"
                        onClick={() => cityClicked(city.geonameid)}
                        eventKey={city.geonameid}>
            <Stack direction={"horizontal"} gap={2}>
                {isLoading ? <Spinner animation="grow" size="sm"/> :
                    <Form.Check data-testid="itemCheckBox" checked={checkedValue} onChange={() => null}/>
                }
                <Stack>
                    <div className="ms-2 ">
                        <div className="fw-bold">{city.name}</div>
                        {city.subcountry} - {city.country}
                    </div>
                </Stack>

            </Stack>
        </ListGroup.Item>

    );
}

export default CityItem;
