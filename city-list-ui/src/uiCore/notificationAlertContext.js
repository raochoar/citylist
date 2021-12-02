import React from 'react';

const NotificationAlertContext = React.createContext();

const defaultState = {
    show: false,
    message: 'Default message',
    alertType: 'danger'
}


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

const NotificationAlertProvider = (props) => {
    const [state, dispatch] = React.useReducer(notificationAlertReducer, defaultState);
    const value = React.useMemo(() => [state, dispatch], [state]);
    return <NotificationAlertContext.Provider value={value} {...props} />;
}

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
