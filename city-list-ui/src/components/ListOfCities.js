import './ListOfCities.css';
import {ListGroup} from "react-bootstrap";

import CityItem from "./CityItem";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useInView} from 'react-intersection-observer';

function ListOfCities({data = [], onGetMoreRows = f => f, filter = ''}) {
    const [maxHeight, setMaxHeight] = useState(0);
    const [lastRowRef, lastRowInView] = useInView();
    const listGroup = useRef();

    useEffect(() => {
        if (lastRowInView) {
            onGetMoreRows(filter);
        }
    }, [lastRowInView, filter]);

    useLayoutEffect(() => {
        const offSet = listGroup.current.offsetTop;

        function setHeight() {
            setMaxHeight(window.innerHeight - offSet)
        }

        window.addEventListener('resize', setMaxHeight)
        setHeight();
        return () => window.removeEventListener('resize', setMaxHeight); //clean event handling
    }, []);

    return (
        <ListGroup style={{maxHeight: maxHeight}} ref={listGroup}>
            {data.map((c, i) => <CityItem city={c} key={c.geonameid}/>)}
            <div ref={lastRowRef}>
                <CityItem isPlaceHolder={true} key={'nextPagePlaceholder'}></CityItem>
            </div>
        </ListGroup>
    );
}

export default ListOfCities;
