import CityItemPlaceholder from "./CityItemPlaceholder";
import {render} from "@testing-library/react";

describe('CityItemPlaceholder unit test', () => {
   it('it should render a cityitem placeholder', () => {
       const result= render(<CityItemPlaceholder></CityItemPlaceholder>)
       
       expect(result).toBeDefined();
   })
});
