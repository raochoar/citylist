import {Alert} from "react-bootstrap";
import {useNotificationAlert} from "./notificationAlertContext";

/**
 * This component rendres an alert when the state changes.
 * You need to useNotifcationAlert hook to create the provider
 * and render alerts.
 * @returns {JSX.Element}
 * @constructor
 */
function NotificationAlert() {
    const {state} = useNotificationAlert();
    return (
        <Alert variant={state.alertType} show={state.show} transition={true} >
            {state.message}
        </Alert>
    );

}

export default NotificationAlert;
