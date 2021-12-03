import React from 'react';
import Configs from "../configs";
import {useListOfCities} from "./useListOfCities";
import TestHelpers from "../testHelpers";
import {useErrorNotificationHandling} from "../uiCore/useErrorNotificationHandling";


jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useState: jest.fn(),
    };
});

jest.mock('../uiCore/useErrorNotificationHandling', () => {
    const connectionIssuesMock = jest.fn();
    return {
        useErrorNotificationHandling: () => {
            return {
                handleConnectionIssue: connectionIssuesMock
            };
        }
    }
});

describe('List of cities hook unit test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    function prepareMocks(response, mockStatesDict = {}) {
        const flushPromises = () => new Promise(setImmediate);
        fetch = jest.fn(() =>
            Promise.resolve(response)
        );
        const {states} = TestHelpers.prepareUseStateMock(mockStatesDict);

        return {
            flushPromises,
            states
        }
    }

    test('It has to handle connection errors', async () => {
        // Arrange
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        jest.spyOn(console, 'log').mockImplementation(f => f); //keep clean the log :)
        const {flushPromises} = prepareMocks();
        fetch = jest.fn(() => Promise.reject({code: DOMException.ABORT_ERR}));
        const {getMoreCities} = useListOfCities();


        // Act
        getMoreCities('filter');
        await flushPromises();

        // Assert
        expect(fetch).toBeCalledTimes(1);
        expect(useErrorNotificationHandling().handleConnectionIssue).toBeCalledTimes(1);

        jest.useRealTimers();
    })

    test('It should re-try the request if the request is not successful', async () => {
        // Arrange
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        const response = {
            status: 500
        };
        const {flushPromises} = prepareMocks(response);
        const {getMoreCities} = useListOfCities();


        // Act
        getMoreCities('filter');
        await flushPromises();

        // Assert
        expect(setTimeout).toBeCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), Configs.getRetryTime());

        jest.useRealTimers();
    })

    test('It should change the status when a the filterhandler is called', () => {
        //Arrange
        const stateDict = {filter: 5, page: 6, citiesCollection: 7, noMoreDataFlag: 8}
        const {states} = prepareMocks();
        const {onFilterChangeHandler} = useListOfCities();

        //Act
        onFilterChangeHandler('newFilter');

        //Assert
        expect(states[stateDict.filter].newValue).toBe('newFilter');
        expect(states[stateDict.page].newValue).toBe(0);
        expect(states[stateDict.citiesCollection].newValue.length).toBe(0);
        expect(states[stateDict.noMoreDataFlag].newValue).toBeFalsy();
    });

    test('It has to cancel the http request if there is a current request in progress', async () => {
        // Arrange
        const stateDict = {
            noMoreDataFlag: 3,
            citiesCollection: 6,
        }
        const filterValue = 'filter';
        const abortControllerMock = {abort: jest.fn()};
        jest.spyOn(Configs, 'getPageSize').mockImplementation(() => 4);
        const response = {
            json: () => Promise.resolve({
                data: [1, 2, 3, 4],
                total: 8
            }),
            status: 200
        };
        const {flushPromises, states} = prepareMocks(response, {'4': abortControllerMock});
        const {getMoreCities} = useListOfCities();

        // Act
        getMoreCities(filterValue);
        await flushPromises();

        // Assert
        expect(states[stateDict.noMoreDataFlag].initialValue).toBe('INIT');
        expect(states[stateDict.noMoreDataFlag].newValue).toBeFalsy();
        expect(states[stateDict.citiesCollection].initialValue.length).toBe(0);
        expect(states[stateDict.citiesCollection].newValue.length).toBe(4);
        expect(Configs.getPageSize).toBeCalledTimes(1);
        expect(fetch).toBeCalledTimes(1);
        expect(abortControllerMock.abort).toBeCalledTimes(1);

    });

    test('It should return the first page of data', async () => {
        // Arrange
        const stateDict = {
            noMoreDataFlag: 3,
            citiesCollection: 6,
        }
        const filterValue = 'filter';
        jest.spyOn(Configs, 'getPageSize').mockImplementation(() => 4);
        const response = {
            json: () => Promise.resolve({
                data: [1, 2, 3, 4],
                total: 8
            }),
            status: 200
        };
        const {flushPromises, states} = prepareMocks(response);
        const {getMoreCities} = useListOfCities();

        // Act
        getMoreCities(filterValue);
        await flushPromises();

        // Assert
        expect(states[stateDict.noMoreDataFlag].initialValue).toBe('INIT');
        expect(states[stateDict.noMoreDataFlag].newValue).toBeFalsy();
        expect(states[stateDict.citiesCollection].initialValue.length).toBe(0);
        expect(states[stateDict.citiesCollection].newValue.length).toBe(4);
        expect(Configs.getPageSize).toBeCalledTimes(1);
        expect(fetch).toBeCalledTimes(1);

    });

    test('It should return no more flags on true if the total is 0', async () => {
        // Arrange
        const filterValue = 'filter';
        const stateDict = {noMoreDataFlag: 7};
        const response = {
            json: () => Promise.resolve({
                data: [],
                total: 0
            }),
            status: 200
        };
        const {flushPromises, states} = prepareMocks(response);
        const {getMoreCities} = useListOfCities();

        // Act
        getMoreCities(filterValue);
        await flushPromises();

        // Assert
        expect(states[stateDict.noMoreDataFlag].initialValue).toBeFalsy();
        expect(states[stateDict.noMoreDataFlag].newValue).toBeTruthy();
        expect(fetch).toBeCalledTimes(1);
    });
});
