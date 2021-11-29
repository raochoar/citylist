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
        return 25;
    }
}
