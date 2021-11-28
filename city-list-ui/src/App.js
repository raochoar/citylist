import './App.css';
import {Container} from 'react-bootstrap';
import {Stack} from 'react-bootstrap';
import ListOfCities from "./components/ListOfCities";
import CitySearchInput from "./components/CitySearchInput";
import {useEffect, useState} from "react";


function App() {
    const [citiesCollection, setCitiesCollection] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('');

    function fetchCityData(pageValue, filterValue) {
        const offset=50*pageValue;
        setLoading(true);
        fetch('http://localhost:3030/cities?offset=' + offset + '&limit=50' + '&filter=' + filterValue)
            .then(result => {
                    if (result.status == 200) {
                        result.json().then(r => {
                            setLoading(false);
                            setCitiesCollection(citiesCollection.concat(r.data));
                            setPage(page + 1);
                        })
                    } else {
                        console.log(' error found');
                        setLoading(true);
                        getMoreCities();

                    }
                },
                e => {
                    console.log('running error promise');
                    setError(e);
                    setLoading(false);
                });
    }

    const getMoreCities = (filterValue) => {
        if (!loading) {
            fetchCityData(page, filterValue);
        }
    };
    const onFilterChange = (newFilter) => {
            setFilter(newFilter);
            setPage(0);
            setCitiesCollection([]);
            setLoading(false);
    }
    return (
        <Container>
            <Stack gap={3}>
                <h1>Welcome to the City travel wish list! we have {citiesCollection.length}!</h1>
                <CitySearchInput onFilterChange={onFilterChange}></CitySearchInput>
                <ListOfCities data={citiesCollection} onGetMoreRows={getMoreCities} filter={filter}></ListOfCities>
            </Stack>
        </Container>
    );
}

export default App;
