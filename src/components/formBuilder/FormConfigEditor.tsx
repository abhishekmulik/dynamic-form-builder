import { useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/molecules'
import { Box, Button, Flex } from '@chakra-ui/react'
import JsonInput from '../jsonInput/JsonInput'
import { validateJSON } from '../../utils/common.utils';
import { useAppDispatch, useAppSelector, setJsonInput, setError, setParsedFormData, clearForm } from '../../store';
import sampleFormConfig from '../../data/sampleFormConfig.json';
import data2 from '../../data/data2.json';
import jobApplication from '../../data/job-application.json';
import nestedConditionalForm from '../../data/nested-conditional-form.json';

const data = jobApplication;

function FormConfigEditor() {
  const dispatch = useAppDispatch();
  const { jsonInput, error } = useAppSelector((state) => state.formBuilder);

  const handleJsonChange = useCallback((value: string) => {
    dispatch(setJsonInput(value));
    // handleLoadConfiguration(value)
  }, [dispatch]);

  const handleLoadConfiguration = (value: string) => {
    const parsedJson = validateJSON(value);
    if (parsedJson.error) {
      dispatch(setError(parsedJson.error));
      return;
    }
    dispatch(setParsedFormData(parsedJson.parsedData));
  };

  const handleClear = () => {
    dispatch(clearForm());
  };

  const handleLoadSample = () => {
    const sampleJson = JSON.stringify(data, null, 2);
    dispatch(setJsonInput(sampleJson));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Configuration</CardTitle>
        <CardDescription>Load a form configuration from JSON</CardDescription>
      </CardHeader>
      <CardContent>
        <Box>
          <JsonInput jsonInput={jsonInput} onChangeHandler={handleJsonChange} error={error} />
        </Box>
        <Flex 
          justifyContent={{ base: "stretch", md: "end" }} 
          gap={3} 
          direction={{ base: "column", md: "row" }}
          mt={4}
        >
          <Button 
            onClick={handleLoadSample} 
            variant="ghost" 
            size="sm"
            w={{ base: "100%", md: "auto" }}
          >
            Load Sample
          </Button>
          <Button 
            onClick={handleClear} 
            variant="outline"
            w={{ base: "100%", md: "auto" }}
          >
            Clear
          </Button>
          <Button 
            onClick={() => handleLoadConfiguration(jsonInput)} 
            disabled={!jsonInput.trim()}
            w={{ base: "100%", md: "auto" }}
            colorScheme="blue"
          >
            Load Configuration
          </Button>
        </Flex>
      </CardContent>
    </Card>
  )
}

export default FormConfigEditor