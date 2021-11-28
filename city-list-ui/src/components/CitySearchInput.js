import {Form, Stack} from "react-bootstrap";

function CitySearchInput() {
   return ( <Stack direction={'horizontal'} gap={2}>
       <Form.Label column={true} >Search:</Form.Label>
       <Form.Control type={'text'} placeholder={'Start searching here'} size={'sm'}/>
   </Stack> );
}

export default CitySearchInput;
