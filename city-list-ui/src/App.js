import './App.css';
import {Container} from 'react-bootstrap';
import {Stack} from 'react-bootstrap';
import ListOfCities from "./components/ListOfCities";
import CitySearchInput from "./components/CitySearchInput";
import { useState} from "react";

function App() {
    const [citiesCollection, setCitiesCollection] = useState([]);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('');
    const [noMoreDataFlag, setNoMoreDataFlag] = useState(false);
    const [controllerRef, setControllerRef] = useState();

    function fetchCityData(pageValue, filterValue) {
        if (controllerRef) {
            controllerRef.abort();
        }
        const controller = new AbortController();
        setControllerRef(controller);

        const pageSize = 25;
        const offset= pageSize * pageValue;
        const url = new URL('http://localhost:3030/cities');
        const params = {offset, limit:pageSize, filter: filterValue || ''};
        url.search = new URLSearchParams(params).toString();
        fetch(url.toString(), {signal: controller.signal})
            .then(result => {
                    if (result.status === 200) {
                        result.json().then(r => {
                            if(r.data.length > 0) {
                                setCitiesCollection(citiesCollection.concat(r.data));
                                if(r.total > (offset + pageSize)) {
                                    setPage(page + 1);
                                } else {
                                    setNoMoreDataFlag(true);
                                }
                            } else {
                                setNoMoreDataFlag(true);
                            }
                        })
                    } else {
                        console.log(' error found');
                        getMoreCities();
                    }
                },
                e => {
                    console.log('running error promise');
                });
    }

    const getMoreCities = (filterValue) => {
            fetchCityData(page, filterValue);
    };
    const onFilterChange = (newFilter) => {

            setFilter(newFilter);
            setPage(0);
            setCitiesCollection([]);
            setNoMoreDataFlag(false);

    }
    return (
        <Container>
            <Stack gap={3}>
                <h1>Welcome to the City travel wish list!</h1>
                <CitySearchInput onFilterChange={onFilterChange}></CitySearchInput>
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
