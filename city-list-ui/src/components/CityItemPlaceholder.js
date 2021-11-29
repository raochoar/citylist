import {Form, ListGroup, Placeholder, Stack} from "react-bootstrap";
import {memo} from "react";

/**
 * This is just a placeholder static component that renders
 * @returns {JSX.Element}
 * @constructor
 */
function CityItemPlaceholder() {
    return <ListGroup.Item className="d-flex justify-content-between align-items-start">
        <Stack direction={"horizontal"} gap={2}>
            <Form.Check checked={false} disabled={true}/>
            <Stack>
                <div className="ms-2 " style={{width: "300px", height: "48px"}}>
                    <div className="fw-bold"><Placeholder animation="glow">
                        <Placeholder xs={6}/>
                    </Placeholder></div>
                    <Placeholder animation="glow">
                        <Placeholder xs={12}/>
                    </Placeholder>
                </div>
            </Stack>
        </Stack>
    </ListGroup.Item>;
}

export default memo(CityItemPlaceholder);
