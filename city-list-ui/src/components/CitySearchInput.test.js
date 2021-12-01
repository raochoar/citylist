import React, {useCallback, useState} from 'react'
import {fireEvent, render} from "@testing-library/react";
import CitySearchInput from "./CitySearchInput";
import userEvent from "@testing-library/user-event";
jest.mock('react', () => {
   const ActualReact = jest.requireActual('react');
   return {
      ...ActualReact,
      useState: f => [f, jest.fn()],
      useCallback: (callback, deps) => {
         return callback;
      }
   };
});

jest.mock('lodash.debounce', () => { return f => f});
describe('Test suite of the debounced input search box', () => {
   test('It has to throw the onchange event for parent caller, using loadash debounce method', () => {
      //Arrange

      const filterHandler = jest.fn();
      const inputText = 'a new text';
      //Act
      const result = render(<CitySearchInput onFilterChange={filterHandler}></CitySearchInput>)
      const inputBox = result.getByPlaceholderText(/Start/);
      userEvent.type(inputBox, inputText);

      //Assert
      expect(filterHandler).toHaveBeenCalledTimes(inputText.length);
   });
});
