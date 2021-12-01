import React from 'react';
import TestHelpers from "../testHelpers";
import {useListOfCitiesPref} from "./useListOfCitiesPref";
import Configs from "../configs";

jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useState: jest.fn(),
    };
});

describe('Test suit of cities prefer API logic consumption',  () => {

    it('should fail when there are no connection', async () => {
        // Arrange
        TestHelpers.prepareUseStateMock();
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        jest.spyOn(console, 'log').mockImplementation(f => f); //keep clean the log :)
        const flushPromises = () => new Promise(setImmediate);
        fetch = jest.fn(() => Promise.reject('no reason'));
        const {fetchListOfCitiesPref} = useListOfCitiesPref();

        //Act
        fetchListOfCitiesPref(0);
        await flushPromises();

        //Assert
        expect(fetch).toBeCalledTimes(1);
        expect(console.log).toBeCalledTimes(1); //todo: replace this with business logic

        jest.useRealTimers();
    })

    it('it should re-try if the server respond an error code', async () => {
        //Arrange
        TestHelpers.prepareUseStateMock();
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        const flushPromises = () => new Promise(setImmediate);
        fetch = jest.fn(() => {
                return Promise.resolve({status: 500})
            }
        );
        const {fetchListOfCitiesPref} = useListOfCitiesPref(0);

        //Act
        fetchListOfCitiesPref(0);
        await flushPromises();

        //Assert
        expect(setTimeout).toBeCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), Configs.getRetryTime());
        expect(fetch).toBeCalledTimes(1);

        jest.useRealTimers();
    });

    it('It should bring all cities preferences using a pagination logic', async () => {
        //Arrange
        const {states} = TestHelpers.prepareUseStateMock();
        const flushPromises = () => new Promise(setImmediate);
        let t = (Configs.getPageSize() * 2) + 1; //force to have 2 pages.
        function getTotal() {
            t = t - Configs.getPageSize();
            return t;
        }
        fetch = jest.fn(() => {
                const res = Promise.resolve({
                    json: () => {
                        return Promise.resolve({
                            data: [1, 2, 3, 4],
                            total: getTotal()
                        });
                    },
                    status: 200
                });
                return res;
            }
        );
        const {fetchListOfCitiesPref} = useListOfCitiesPref(0);

        //Act
        fetchListOfCitiesPref(0);
        await flushPromises();
        const stateDict = {lastDataArray: 5, lastIsLoading: 4};
        //Assert
        expect(states).toBeDefined();
        expect(states[stateDict.lastDataArray].newValue.length).toBe(8); //2 pages
        expect(states[stateDict.lastIsLoading].newValue).toBeFalsy();
        expect(fetch).toBeCalledTimes(2);

    });
})
