import {useNotificationAlert} from "../uiCore/notificationAlertContext";
import Configs from "../configs";

/**
 * This is a handler to manage errors. It has error connection issue
 * because it may render an alert. It requires that the component will be wrapped
 * by an AlertProvider.
 * @returns {{handleConnectionIssue: handleConnectionIssue}}
 */
export function useErrorNotificationHandling() {
    const {showErrorNotification} = useNotificationAlert();

    /**
     * Renders an alert and after a time reload the browser
     * to try to recover the app from a connection break.
     */
    const handleConnectionIssue = () => {
        showErrorNotification('Ups!: We are having troubles to contact the server. We will resolve this soon, we will reload the page soon.');
        setTimeout(() => window.location.reload(), Configs.getReloadPageTimer());
    }
    return { handleConnectionIssue };
};
