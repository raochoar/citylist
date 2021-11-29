import './App.css';
import {Container, Navbar} from 'react-bootstrap';
import {Stack} from 'react-bootstrap';
import ListOfCities from "./components/ListOfCities";
import CitySearchInput from "./components/CitySearchInput";
import {useListOfCities} from "./hooks/useListOfCities";

/**
 * This is the main app, contains the header, filter input and a list of cities.
 * Also manage the status of the cities collection to be rendered.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
    const { citiesCollection, getMoreCities, filter, noMoreDataFlag, onFilterChangeHandler } = useListOfCities();

    return (
        <Container>
            <Navbar bg="light">
                <Navbar.Brand   variant="dark">Welcome to the City travel wish list!</Navbar.Brand>
            </Navbar>
            <Stack gap={3}>
                <CitySearchInput onFilterChange={onFilterChangeHandler}></CitySearchInput>
                <ListOfCities data={citiesCollection}
                              onGetMoreRows={getMoreCities}
                              filter={filter}
                              noMoreDataFlag={noMoreDataFlag}
                />
            </Stack>
        </Container>
    );
}

export default App;
