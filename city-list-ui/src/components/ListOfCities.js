import './ListOfCities.css';
import {ListGroup} from "react-bootstrap";

import CityItem from "./CityItem";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useInView} from 'react-intersection-observer';

function ListOfCities({data = [], onGetMoreRows = f => f, filter = '', noMoreDataFlag = false}) {
    const [maxHeight, setMaxHeight] = useState(0);
    const [lastRowRef, lastRowInView] = useInView();
    const listGroup = useRef();

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

        window.addEventListener('resize', setMaxHeight)
        setHeight();
        return () => window.removeEventListener('resize', setMaxHeight); //clean event handling
    }, []);

    return (
        <ListGroup style={{maxHeight: maxHeight}} ref={listGroup}>
            {data.map((c, i) => <CityItem city={c} key={c.geonameid}/>)}
            <div ref={lastRowRef}>
                {!noMoreDataFlag &&
                    <>
                    <CityItem isPlaceHolder={true} key={'nextPagePlaceholder1'}></CityItem>
                    <CityItem isPlaceHolder={true} key={'nextPagePlaceholder2'}></CityItem>
                    <CityItem isPlaceHolder={true} key={'nextPagePlaceholder3'}></CityItem>
                    </>
                }
            </div>
        </ListGroup>
    );
}

export default ListOfCities;
