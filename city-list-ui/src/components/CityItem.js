import {Form, ListGroup, Stack} from "react-bootstrap";
import { useState} from "react";

function CityItem(props) {
    const [checked, setChecked] = useState(false);

    function cityClicked(cityId) {
        setChecked(!checked);
        console.log('action');
        console.log(cityId + " state is:" + checked);
    }
    return (
        <ListGroup.Item action className="d-flex justify-content-between align-items-start"
                        onClick={() => cityClicked(props.city.geonameid)}
                        eventKey={props.city.geonameid}

        >
        <Stack direction={"horizontal"} gap={2}>
            <Form.Check checked={checked} onChange={ ()=> null}/>
            <Stack>
                <div className="ms-2 ">
                    <div className="fw-bold">{props.city.name}</div>
                    {props.city.subcountry} - {props.city.country}
                </div>
            </Stack>
        </Stack>
    </ListGroup.Item>
    );
}

export default CityItem;
