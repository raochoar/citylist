import React from 'react';
import TestHelpers from "../testHelpers";
import {usePatchCityPref} from "./usePatchCityPref";
import Configs from "../configs";

jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useState: jest.fn(),
    };
});

describe('Test related with the patch city preference hook', () => {

    function prepareMocks() {
        const {states} = TestHelpers.prepareUseStateMock();
        const flushPromises = () => new Promise(setImmediate);
        return {states, flushPromises};
    }

    test('it should fail and log when there are no connection', async () => {
        // Arrange
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        jest.spyOn(console, 'log').mockImplementation(f => f); //keep clean the log :)
        const {flushPromises} = prepareMocks();
        fetch = jest.fn(() => Promise.reject('no reason'));
        const {patchItemData} = usePatchCityPref();

        //Act
        patchItemData('cityId', true);
        await flushPromises();

        //Assert
        expect(fetch).toBeCalledTimes(1);
        expect(console.log).toBeCalledTimes(1); //todo: replace this with business logic

        jest.useRealTimers();
    });

    test('It should re-try if the server response error code', async () => {
        //Arrange
        const {flushPromises} = prepareMocks();
        const {patchItemData} = usePatchCityPref();
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        fetch = jest.fn(() => {
                return Promise.resolve({status: 500})
            }
        );

        //Act
        patchItemData('cityId', true);
        await flushPromises();

        //Assert
        expect(setTimeout).toBeCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), Configs.getRetryTime());

        jest.useRealTimers();
    });


    test('It should patch a value to the backend successfully', async () => {
        //Arrange
        const stateDict = {
            checked: 3,
            isLoading: 5
        }
        const {states, flushPromises} = prepareMocks();
        const {patchItemData} = usePatchCityPref();
        let url, body;
        fetch = jest.fn((u, b) => {
                url = u;
                body = b;
                return Promise.resolve({status: 204})
            }
        );

        //Act
        patchItemData('cityId', true);
        await flushPromises();

        //Assert
        expect(states).toBeDefined();
        expect(states[stateDict.isLoading]).toBeFalsy();
        expect(states[stateDict.checked]).toBeTruthy();
        expect(fetch).toBeCalledTimes(1);
        expect(url.indexOf('/preferences/cities')).toBeGreaterThan(0);
        expect(body.method).toBe('PATCH');
        expect(body.body).toBe(JSON.stringify({cityId: true}))
    });
});
