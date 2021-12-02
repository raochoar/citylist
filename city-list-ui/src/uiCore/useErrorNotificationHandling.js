import {useNotificationAlert} from "../uiCore/notificationAlertContext";
import Configs from "../configs";

export function useErrorNotificationHandling() {
    const {showErrorNotification} = useNotificationAlert();
    const handleConnectionIssue = () => {
        showErrorNotification('Ups!: We are having troubles to contact the server. We will resolve this soon, we will reload the page soon.');
        setTimeout(() => window.location.reload(), Configs.getReloadPageTimer());
    }
    return { handleConnectionIssue };
};
