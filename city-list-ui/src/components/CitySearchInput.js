import {Form, Stack} from "react-bootstrap";
import {useCallback, useState} from "react";
import debounce from 'lodash.debounce';

/**
 * This is a simple search input component, that debounce the onchange event for 1 second
 * in order to trigger list refresh events.
 * @param onFilterChange
 * @returns {JSX.Element}
 * @constructor
 */
function CitySearchInput( {onFilterChange = f => f}) {
    const [value, setValue] = useState('');
    // eslint-disable-next-line
    const debouncedFilterChange = useCallback(
        debounce(newValue => onFilterChange(newValue), 1000),
        []
    );

    function filterChange(newValue) {
       setValue(newValue);
       debouncedFilterChange(newValue);
    }
   return ( <Stack direction={'horizontal'} gap={2}>
       <Form.Label column={true} >Search:</Form.Label>
       <Form.Control value={value} type={'text'} placeholder={'Start searching here'} size={'sm'}
                     onChange={event => filterChange(event.target.value)}/>
   </Stack> );
}

export default CitySearchInput;
