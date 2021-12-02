import './ListOfCities.css';
import {ListGroup} from "react-bootstrap";

import CityItem from "./CityItem";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useInView} from 'react-intersection-observer';
import CityItemPlaceholder from "./CityItemPlaceholder";
import {useListOfCitiesPref} from "../apiHooks/useListOfCitiesPref";

/**
 * This component render a list of cities and manage the infinite scroll logic.
 * Also provider the cities information logic to the city items.
 * @param data
 * @param onGetMoreRows
 * @param filter
 * @param noMoreDataFlag
 * @returns {JSX.Element}
 * @constructor
 */
function ListOfCities({data = [], onGetMoreRows = f => f, filter = '', noMoreDataFlag = false}) {
    const [maxHeight, setMaxHeight] = useState(0);
    const [lastRowRef, lastRowInView] = useInView();
    const listGroup = useRef();
    const {fetchListOfCitiesPref, checkedItems, isLoading} = useListOfCitiesPref();

    useEffect(() => {
        fetchListOfCitiesPref(0);
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
