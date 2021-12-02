import {Alert} from "react-bootstrap";
import {useNotificationAlert} from "./notificationAlertContext";

function NotificationAlert() {
    const {state} = useNotificationAlert();
    return (
        <Alert variant={state.alertType} show={state.show} transition={true} >
            {state.message}
        </Alert>
    );

}

export default NotificationAlert;
