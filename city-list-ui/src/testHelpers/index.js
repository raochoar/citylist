import React from "react";

export default class Index {

    /**
     * This is my mock version of use state, it uses an array to store the
     * states calls and values. And also you may provided pre-defined states
     * using a dictionary (where the key is the index of the state).
     * Sadly the only way that I found to mock state is accessing by index that
     * depends directly on the order and amount of setUse calls.
     * @param mockStatesDict
     * @returns {{states: *[]}}
     */
    static  prepareUseStateMock(mockStatesDict = {}) {
        const states = [];
        let stateCounter = 0;
        jest.spyOn(React, 'useState').mockImplementation(initialValue => {
            if (mockStatesDict[stateCounter]) {
                initialValue = mockStatesDict[stateCounter]
            }
            let currentValue = initialValue;
            stateCounter++;
            states.push({initialValue: 'INIT', newValue: initialValue})
            let setValue = newValue => {
                currentValue = newValue;
                states.push({initialValue, newValue});
            };
            return [currentValue, setValue];
        });
        return {
            states
        }
    }
}
