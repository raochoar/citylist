import {Form, Stack} from "react-bootstrap";
import {useCallback, useState} from "react";
import debounce from 'lodash.debounce';

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
