import React from 'react';
import * as usePatchCityPrefModule from "../apiHooks/usePatchCityPref";
import * as useListOfCitiesPrefModule from "../apiHooks/useListOfCitiesPref";
import ListOfCities from "./ListOfCities";
import {render} from "@testing-library/react";

jest.mock('react-intersection-observer', () => {
    return {useInView: () => [{current: {offsetTop: 1983}}, true]};
});


describe('Suite of test the list of cities component', () => {
    it('Should render a list of cities', () => {
        //Arrange
        const usePatchCityPrefModuleProps = {
            patchItemData: jest.fn(),
            checkedValue: false,
            isLoading: false,
            setIsLoading: jest.fn(),
            setCheckedValue: jest.fn()
        };
        jest.spyOn(usePatchCityPrefModule, 'usePatchCityPref').mockImplementation(() => usePatchCityPrefModuleProps);
        let maxHeight = 100;
        const setMaxHeight = f => maxHeight = f;
        jest.spyOn(React, 'useState').mockImplementation(f => [maxHeight, setMaxHeight]);
        jest.spyOn(React, 'useRef').mockImplementation(f => {
            return {
                current: {offsetTop: 1983}
            }
        });
        jest.spyOn(React, 'useLayoutEffect').mockImplementation(f => f());
        jest.spyOn(React, 'useEffect').mockImplementation(f => f());
        const useListOfCitiesPrefProps = {fetchListOfCitiesPref: jest.fn(), checkedItems: [], isLoading: false};
        jest.spyOn(useListOfCitiesPrefModule, 'useListOfCitiesPref').mockImplementation(() => useListOfCitiesPrefProps);

        jest.spyOn(window, 'addEventListener').mockImplementation();
        jest.spyOn(window, 'removeEventListener').mockImplementation();
        const onMoreGetRowsHandler = jest.fn();

        //Act
        const result = render(<ListOfCities noMoreDataFlag={false}
                                            data={[{
                                                name: 'name1',
                                                subcountry: 'subcountry',
                                                country: 'country',
                                                geonameid: 1
                                            },
                                                {
                                                    name: 'name2',
                                                    subcountry: 'subcountry',
                                                    country: 'country',
                                                    geonameid: 2
                                                }]}
                                            onGetMoreRows={onMoreGetRowsHandler}>

        </ListOfCities>)

        //Assert
        expect(result).toBeDefined();
        expect(result.getByText('name1')).toHaveTextContent('name1');
        expect(result.getByText('name2')).toHaveTextContent('name2');
        expect(onMoreGetRowsHandler).toHaveBeenCalledTimes(1);
        expect(useListOfCitiesPrefProps.fetchListOfCitiesPref).toHaveBeenCalledTimes(1);

    });
});
