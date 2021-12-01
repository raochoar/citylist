import React from 'react';
import {render} from "@testing-library/react";
import CityItem from "./CityItem";
import * as customHook from '../hooks/usePatchCityPref';
import userEvent from "@testing-library/user-event";

jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useEffect: f => f(),
    };
});


describe('This suite test the city item component', () => {

    test('It has to call patchItemData when te user click on a city item in the list', () => {
        //Arrange
        const c = prepareMocks();

        //Act
        const result = render(<CityItem city={c} checkedItems={[]}></CityItem>);
        userEvent.click( result.getByText(c.name), {})

        //Assert
        expect(customHook.usePatchCityPref().patchItemData).toHaveBeenCalledWith(c.geonameid, true);

    });

    function prepareMocks() {
        const hooksDependencies = {
            patchItemData: jest.fn(),
            checkedValue: false,
            isLoading: false,
            setIsLoading: jest.fn(),
            setCheckedValue: jest.fn()
        };
        jest.spyOn(customHook, 'usePatchCityPref').mockImplementation(() => {
            return hooksDependencies;
        });
        const c = {
            name: 'name', subcountry: 'subcountry', country: 'country', geonameid: 1234
        }
        return c;
    }

    test('It has to render an item with the city name and unchecked', () => {
        //Arrange
        const c = prepareMocks();

        //Act
        const result = render(<CityItem city={c} checkedItems={[]}></CityItem>);


        //Assert
        expect(result.getByTestId('itemCheckBox')).not.toBeChecked()
        expect(result.getByText(c.name)).toHaveTextContent(c.name)
        expect(result.getByText(/subcountry/)).toBeDefined();
        expect(result.getByText(/country/)).toBeDefined();
        expect(customHook.usePatchCityPref).toHaveBeenCalledTimes(1);
        expect(customHook.usePatchCityPref().setCheckedValue).toHaveBeenCalledTimes(1);
        expect(customHook.usePatchCityPref().setIsLoading).toHaveBeenCalledTimes(1);
        expect(customHook.usePatchCityPref().patchItemData).toHaveBeenCalledTimes(0);
    });

});
