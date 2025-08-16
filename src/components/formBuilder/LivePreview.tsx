import { Card, CardDescription, CardHeader, CardTitle } from '../ui/molecules'
import { HStack, Icon, Box, Text, useToast } from '@chakra-ui/react';
import { Eye } from 'lucide-react';
import { clearForm, useAppSelector } from '../../store';
import { DynamicForm, FormConfig } from '../ui/organisms';
import { useDispatch } from 'react-redux';

function LivePreview() {
  const { parsedFormData, error } = useAppSelector((state) => state.formBuilder);
  const dispatch = useDispatch();
  const toast = useToast()

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Form submitted with data:', data);
    toast({
      title: 'Form submitted.',
      description: "Thanks for the information.",
      status: 'success',
      variant:"subtle",
      duration: 2000,
      isClosable: true,
      position:"top"
    })
    dispatch(clearForm())
  };

  const isFormConfig = (data: any): data is FormConfig => {
    return data &&
      typeof data === 'object' &&
      Array.isArray(data.fields) &&
      data.fields.length > 0;
  };

  

  return (
    <Box h={{ base: "auto", md: "100%" }}>
      <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader>
          <CardTitle>
            <HStack spacing={2}>
              <Icon as={Eye} boxSize={5} color="secondary.800" />
              <Text>Live Preview</Text>
            </HStack>
          </CardTitle>
          <CardDescription>See your form JSON configuration rendered as a form</CardDescription>
        </CardHeader>
        <Box
          flex="1"
          overflow="auto"
          px={{ base: 4, md: 6 }}
          pb={{ base: 4, md: 6 }}
          minH="0"
        >
          {!parsedFormData && !error && (
            <Box p={4} bg="gray.50" border="1px" borderColor="gray.200" borderRadius="md">
              <Text color="gray.600" fontSize="sm">
                No form configuration loaded. Use the Form Configuration panel to load a JSON configuration.
              </Text>
            </Box>
          )}

          {parsedFormData &&
            isFormConfig(parsedFormData) ? (
            <Box>
              <DynamicForm
                config={parsedFormData}
                onSubmit={handleFormSubmit}
              />
            </Box>
          ) : null}
        </Box>
      </Card>
    </Box>
  )
}

export default LivePreview