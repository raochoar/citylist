import {Form, ListGroup, Spinner, Stack} from "react-bootstrap";
import {useEffect, useState} from "react";

function CityItem({city, checkedItems = [], isCheckedItemLoading = false}) {
    const [checkedValue, setCheckedValue] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(isCheckedItemLoading);
    }, [isCheckedItemLoading]);

    useEffect(() => {
        setCheckedValue(checkedItems.includes(city.geonameid));
    }, [checkedItems, city]);

    function patchItemData(cityId, newCheckedValue) {
        const body = {};
        body[cityId] = newCheckedValue;
        setIsLoading(true);
        fetch('http://localhost:3030/preferences/cities', {
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
                    <Form.Check checked={checkedValue} onChange={() => null}/>
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
