import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/molecules/Card'
import { TextArea } from './ui/atoms'
import { Box, Text } from '@chakra-ui/react'

function FormConfigEditor() {
  const [jsonInput, setJsonInput] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [selectedSample, setSelectedSample] = useState<string>("")
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Configuration</CardTitle>
        <CardDescription>Load a form configuration from JSON</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="secondary.800">JSON Configuration</Text>
          <TextArea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your form configuration JSON here..."
            minH="300px"
            fontFamily="mono"
            fontSize="sm"
            bg="secondary.50"
            borderColor="secondary.300"
            _hover={{ bg: "secondary.100" }}
            _focus={{ bg: "white" }}
          />
        </Box>

        {/* Error Display */}
        {/* {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">Configuration Errors:</div>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )} */}

        {/* Action Buttons */}
        {/* <div className="flex gap-2">
          <Button onClick={handleParseConfig} disabled={!jsonInput.trim()}>
            Load Configuration
          </Button>
          <Button onClick={handleClearConfig} variant="outline">
            Clear
          </Button>
        </div> */}
      </CardContent>
    </Card>
  )
}

export default FormConfigEditor