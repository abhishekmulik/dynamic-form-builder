import { useCallback } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/molecules'
import { Box, Button, Flex } from '@chakra-ui/react'
import JsonInput from '../jsonInput/JsonInput'
import { validateJSON } from '../../utils/common.utils';
import { useAppDispatch, useAppSelector, setJsonInput, setError, setParsedFormData, clearConfiguration } from '../../store';
import jobApplication from '../../data/job-application.json';

function FormConfigEditor() {
  const dispatch = useAppDispatch();
  const { jsonInput, error } = useAppSelector((state) => state.formBuilder);

  const handleJsonChange = useCallback((value: string) => {
    dispatch(setJsonInput(value));
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
    dispatch(clearConfiguration());
  };

  const handleLoadSample = () => {
    const sampleJson = JSON.stringify(jobApplication, null, 2);
    dispatch(setJsonInput(sampleJson));
  };

  return (
    <Box h={{ base: "auto", md: "100%" }}>
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader>
        <CardTitle>Form Configuration</CardTitle>
        <CardDescription>Load a form configuration from JSON</CardDescription>
      </CardHeader>
      <Box
          flex="1"
          overflow="auto"
          px={{ base: 4, md: 6 }}
          pb={{ base: 4, md: 6 }}
          minH="0"
        >
        <Box>
          <JsonInput jsonInput={jsonInput} onChangeHandler={handleJsonChange} error={error} />
        </Box>
        <Flex 
          justifyContent={{ base: "stretch", md: "end" }} 
          gap={3} 
          direction={{ base: "column", md: "row" }}
        >
          <Button 
            onClick={handleLoadSample} 
            variant="ghost" 
            size="sm"
            w={{ base: "100%", md: "auto" }}
            alignSelf={"center"}
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
            colorScheme='secondary'
          >
            Load Configuration
          </Button>
        </Flex>
      </Box>
    </Card>
    </Box>
  )
}

export default FormConfigEditor