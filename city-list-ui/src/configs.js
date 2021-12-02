/**
 * This class exposes a static set of method
 * in order to provide configurations.
 */
export default  class Configs {

    static getBackendEndpoint = () => {
        const hostName = window.location.hostname;
        const port = 3030;
        return `http://${hostName}:${port}`;
    }

    static getPageSize = () => {
        return 25; //TODO: put a real value to be negotiated with backend stakeholders.
    }

    static getRetryTime = () => {
        return 150; //TODO: put a real value to be negotiated with backend stakeholders.
    }

    static getReloadPageTimer() {
        return 5000;
    }
}
