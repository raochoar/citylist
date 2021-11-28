import './ListOfCities.css';
import {ListGroup} from "react-bootstrap";

import CityItem from "./CityItem";
import {useLayoutEffect, useRef, useState} from "react";


function ListOfCities(props)  {
    const [maxHeight, setMaxHeight] = useState(0);
    const listGroup = useRef();
    useLayoutEffect(() => {
        const offSet = listGroup.current.offsetTop;

        function setHeight() {
            setMaxHeight(window.innerHeight - offSet)
        }
        window.addEventListener('resize', setMaxHeight)
        setHeight();
        return () => window.removeEventListener('resize', setMaxHeight); //clean event handling
    }, [])
    return (
        <ListGroup style={{maxHeight: maxHeight}} ref={listGroup}>
            { props.data.map(c => <CityItem city={c} key={c.geonameid}/>)}
          </ListGroup>
    );
}

export default ListOfCities;
