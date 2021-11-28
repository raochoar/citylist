import {Form, ListGroup, Stack} from "react-bootstrap";
import {useState} from "react";
import CityItemPlaceholder from "./CityItemPlaceholder";

function CityItem({city, isPlaceHolder = false}) {
    const [checked, setChecked] = useState(false);

    //48 height

    function cityClicked(cityId) {
        setChecked(!checked);
        console.log('action');
        console.log(cityId + " state is:" + checked);
    }

    return (
        <>

            {!isPlaceHolder &&
            <ListGroup.Item action className="d-flex justify-content-between align-items-start"
                            onClick={() => cityClicked(city.geonameid)}
                            eventKey={city.geonameid}>
                <Stack direction={"horizontal"} gap={2}>
                    <Form.Check checked={checked} onChange={() => null}/>
                    <Stack>
                        <div className="ms-2 ">
                            <div className="fw-bold">{city.name}</div>
                            {city.subcountry} - {city.country}
                        </div>
                    </Stack>
                </Stack>
            </ListGroup.Item>
            }

            {isPlaceHolder &&
            <CityItemPlaceholder/>
            }

        </>
    );
}

export default CityItem;
