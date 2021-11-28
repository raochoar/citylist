import './App.css';
import { Container} from 'react-bootstrap';
import { Stack } from 'react-bootstrap';
import ListOfCities from "./components/ListOfCities";
import CitySearchInput from "./components/CitySearchInput";
import * as citiesService from "./services/CitiesService";
function App() {
  const allCities = citiesService.getCities();
  return (
    <Container >
    <Stack gap={3}>
      <h1>Welcome to the City travel wish list!</h1>

      <CitySearchInput></CitySearchInput>
      <ListOfCities data={allCities.data}></ListOfCities>

    </Stack>
    </Container>
  );
}

export default App;
