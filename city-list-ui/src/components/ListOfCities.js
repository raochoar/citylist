import './ListOfCities.css';
import {ListGroup} from "react-bootstrap";

import CityItem from "./CityItem";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useInView} from 'react-intersection-observer';
import CityItemPlaceholder from "./CityItemPlaceholder";

function ListOfCities({data = [], onGetMoreRows = f => f, filter = '', noMoreDataFlag = false}) {
    const [maxHeight, setMaxHeight] = useState(0);
    const [lastRowRef, lastRowInView] = useInView();
    const listGroup = useRef();
    const [checkedItems, setCheckedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function fetchListOfCities(page, itemAcum = []) {
        const url = new URL('http://localhost:3030/preferences/cities');
        const pageSize = 25;
        const params = {offset: pageSize * page, limit: pageSize};
        url.search = new URLSearchParams(params).toString();
        setIsLoading(true);
        fetch(url.toString())
            .then(result => {
                    if (result.status === 200) {
                        result.json().then(r => {
                            const newItemAcum = itemAcum.concat(r.data);
                            if (r.total > (params.offset + pageSize)) {
                                fetchListOfCities(page + 1, newItemAcum);
                            } else {
                                setIsLoading(false);
                                setCheckedItems(newItemAcum);
                                console.log('total items:' + newItemAcum.length);
                            }
                        })
                    } else {
                        console.log('Server error found');
                        fetchListOfCities(page); //re-try
                    }
                },
                e => {
                    console.log('Connection issue: ' + JSON.stringify(e));
                });
    }

    useEffect(() => {
        fetchListOfCities(0);
        // eslint-disable-next-line
    }, [filter]);

    useEffect(() => {
        if (lastRowInView && !noMoreDataFlag) {
            onGetMoreRows(filter);
        }
        // eslint-disable-next-line
    }, [lastRowInView, filter, noMoreDataFlag]);

    useLayoutEffect(() => {
        const offSet = listGroup.current.offsetTop;

        function setHeight() {
            setMaxHeight(window.innerHeight - offSet)
        }

        window.addEventListener('resize', setHeight)
        setHeight();
        return () => window.removeEventListener('resize', setHeight); //clean event handling
    }, []);


    return (
        <ListGroup style={{maxHeight: maxHeight}} ref={listGroup}>
            {data.map((c, i) => <CityItem city={c}
                                          key={c.geonameid}
                                          checkedItems={checkedItems}
                                          isCheckedItemLoading={isLoading}
            />)}
            <div ref={lastRowRef}>
                {!noMoreDataFlag &&
                <>
                    <CityItemPlaceholder key={'nextPagePlaceholder1'}></CityItemPlaceholder>
                    <CityItemPlaceholder key={'nextPagePlaceholder2'}></CityItemPlaceholder>
                    <CityItemPlaceholder key={'nextPagePlaceholder3'}></CityItemPlaceholder>
                </>
                }
            </div>
        </ListGroup>
    );
}

export default ListOfCities;
