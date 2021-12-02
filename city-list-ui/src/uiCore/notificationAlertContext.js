import React from 'react';

const NotificationAlertContext = React.createContext();

const defaultState = {
    show: false,
    message: 'Default message',
    alertType: 'danger'
}

/**
 * This is the reducer function that manages the alert state
 *
 * @param state
 * @param action
 * @returns {(*&{alertType: (string|*), show: boolean, message})|(*&{show: boolean})}
 */
function notificationAlertReducer(state, action) {
    switch (action.type) {
        case 'SHOW': {
            return {...state, show: true, message: action.message, alertType: action.alertType}
        }
        case 'HIDE': {
            return {...state, show: false}
        }
        default: {
            throw new Error('Action not supported');
        }
    }
}

/**
 * This is a custom provider that you need to wrap your components
 * if you want to render alerts.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const NotificationAlertProvider = (props) => {
    const [state, dispatch] = React.useReducer(notificationAlertReducer, defaultState);
    const value = React.useMemo(() => [state, dispatch], [state]);
    return <NotificationAlertContext.Provider value={value} {...props} />;
}
/**
 * This wrapper expose the last status and also some function
 * that allows you to manipulate show and hide the notification.
 * @returns {{showErrorNotification: (function(*=): *), state: *, hideErrorNotification: (function(*): *)}}
 */
const useNotificationAlert = () => {
    const context = React.useContext(NotificationAlertContext)
    if (!context) {
        throw new Error('Please wrap your component with a NotificationAlertProvider');
    }
    const [state, dispatch] = context;

    const showErrorNotification = (message) => dispatch({type: 'SHOW', alertType: 'danger', message: message});
    const hideErrorNotification = (message) => dispatch({type: 'HIDE'});

    return {
        state,
        showErrorNotification,
        hideErrorNotification
    };
}

export {useNotificationAlert, NotificationAlertProvider};
