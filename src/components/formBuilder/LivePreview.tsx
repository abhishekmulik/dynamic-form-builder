import { Card, CardDescription, CardHeader, CardTitle } from '../ui/molecules'
import { HStack, Icon, Box, Text } from '@chakra-ui/react';
import { Eye } from 'lucide-react';
import { useAppSelector } from '../../store';
import { DynamicForm, FormConfig } from '../ui/organisms';

function LivePreview() {
  const { parsedFormData, error } = useAppSelector((state) => state.formBuilder);

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Form submitted with data:', data);
  };

  const isFormConfig = (data: any): data is FormConfig => {
    return data &&
      typeof data === 'object' &&
      Array.isArray(data.fields) &&
      data.fields.length > 0;
  };

  return (
    <Box h={{ base: "auto", md: "100%" }}>
      <Card style={{ height: '100%' }}>
        <CardHeader>
          <CardTitle>
            <HStack spacing={2}>
              <Icon as={Eye} boxSize={5} color="secondary.800" />
              <span>Live Preview</span>
            </HStack>
          </CardTitle>
          <CardDescription>See your form configuration rendered in real-time</CardDescription>
        </CardHeader>
        <Box
          h={{ base: "auto", md: "calc(100% - 80px)" }}
          overflow={{ base: "visible", md: "auto" }}
          px={{ base: 4, md: 6 }}
          pb={{ base: 4, md: 6 }}
        >
          {error && (
            <Box p={4} bg="red.50" border="1px" borderColor="red.200" borderRadius="md">
              <Text color="red.600" fontSize="sm">
                Error: {error}
              </Text>
            </Box>
          )}

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