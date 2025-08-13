import { Card, CardDescription, CardHeader, CardTitle } from './ui/molecules'
import { HStack, Icon } from '@chakra-ui/react';
import { Eye } from 'lucide-react';

function LivePreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <HStack spacing={2}>
            <Icon as={Eye} boxSize={5} color="secondary.800" />
            <span>Live Preview</span>
          </HStack>
        </CardTitle>
        <CardDescription>See your form configuration rendered in real-time</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default LivePreview