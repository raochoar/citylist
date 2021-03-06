import './App.css';
import {Container, Navbar} from 'react-bootstrap';
import {Stack} from 'react-bootstrap';
import ListOfCities from "./components/ListOfCities";
import CitySearchInput from "./components/CitySearchInput";
import {useListOfCities} from "./apiHooks/useListOfCities";
import NotificationAlert from "./uiCore/NotificationAlert";


/**
 * This is the main app, contains the header, filter input and a list of cities.
 * Also manage the status of the cities collection to be rendered.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
    const {citiesCollection, getMoreCities, filter, noMoreDataFlag, onFilterChangeHandler} = useListOfCities();

    return (
        <Container>
            <Stack gap={3}>
                <Navbar bg="light">
                    <Navbar.Brand variant="dark">Select your favorite cities.</Navbar.Brand>
                </Navbar>
                    <NotificationAlert/>
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
