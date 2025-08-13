import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Badge,
  Button,
  Input,
  Textarea,
  Select,
} from '@chakra-ui/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './ui/molecules/Card';

const ColorSwatch = ({ color, name }: { color: string; name: string }) => (
  <Box>
    <Box
      w="60px"
      h="60px"
      bg={color}
      borderRadius="md"
      border="1px solid"
      borderColor="secondary.200"
      mb={2}
    />
    <Text fontSize="xs" textAlign="center" color="secondary.600">
      {name}
    </Text>
  </Box>
);

const ThemeShowcase = () => {
  return (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" color="primary.700" mb={4}>
            Chakra UI Theme Showcase
          </Heading>
          <Text fontSize="lg" color="secondary.600">
            Custom color tokens and component styling
          </Text>
        </Box>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Available semantic color tokens for consistent design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={6}>
              {/* Primary Colors */}
              <Box>
                <Text fontWeight="semibold" mb={3} color="primary.700">
                  Primary Colors
                </Text>
                <HStack spacing={2}>
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <ColorSwatch
                      key={shade}
                      color={`primary.${shade}`}
                      name={`${shade}`}
                    />
                  ))}
                </HStack>
              </Box>

              {/* Secondary Colors */}
              <Box>
                <Text fontWeight="semibold" mb={3} color="secondary.700">
                  Secondary Colors
                </Text>
                <HStack spacing={2}>
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <ColorSwatch
                      key={shade}
                      color={`secondary.${shade}`}
                      name={`${shade}`}
                    />
                  ))}
                </HStack>
              </Box>

              {/* Semantic Colors */}
              <SimpleGrid columns={3} spacing={6} w="full">
                <Box>
                  <Text fontWeight="semibold" mb={3} color="success.700">
                    Success Colors
                  </Text>
                  <HStack spacing={2}>
                    {[400, 500, 600].map((shade) => (
                      <ColorSwatch
                        key={shade}
                        color={`success.${shade}`}
                        name={`${shade}`}
                      />
                    ))}
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb={3} color="warning.700">
                    Warning Colors
                  </Text>
                  <HStack spacing={2}>
                    {[400, 500, 600].map((shade) => (
                      <ColorSwatch
                        key={shade}
                        color={`warning.${shade}`}
                        name={`${shade}`}
                      />
                    ))}
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb={3} color="error.700">
                    Error Colors
                  </Text>
                  <HStack spacing={2}>
                    {[400, 500, 600].map((shade) => (
                      <ColorSwatch
                        key={shade}
                        color={`error.${shade}`}
                        name={`${shade}`}
                      />
                    ))}
                  </HStack>
                </Box>
              </SimpleGrid>
            </VStack>
          </CardContent>
        </Card>

        {/* Component Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Component Styling</CardTitle>
            <CardDescription>
              Components automatically use theme colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={6}>
              {/* Buttons */}
              <Box>
                <Text fontWeight="semibold" mb={3} color="secondary.700">
                  Buttons
                </Text>
                <HStack spacing={3}>
                  <Button>Primary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button colorScheme="secondary">Secondary Button</Button>
                  <Button colorScheme="accent">Accent Button</Button>
                  <Button colorScheme="success">Success Button</Button>
                  <Button colorScheme="warning">Warning Button</Button>
                  <Button colorScheme="error">Error Button</Button>
                </HStack>
              </Box>

              {/* Form Elements */}
              <Box>
                <Text fontWeight="semibold" mb={3} color="secondary.700">
                  Form Elements
                </Text>
                <VStack spacing={4} align="stretch">
                  <Input placeholder="Primary input with focus border" />
                  <Textarea placeholder="Textarea with theme colors" />
                  <Select placeholder="Select option">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                  </Select>
                </VStack>
              </Box>

              {/* Badges */}
              <Box>
                <Text fontWeight="semibold" mb={3} color="secondary.700">
                  Badges
                </Text>
                <HStack spacing={3}>
                  <Badge colorScheme="primary">Primary</Badge>
                  <Badge colorScheme="secondary">Secondary</Badge>
                  <Badge colorScheme="accent">Accent</Badge>
                  <Badge colorScheme="success">Success</Badge>
                  <Badge colorScheme="warning">Warning</Badge>
                  <Badge colorScheme="error">Error</Badge>
                </HStack>
              </Box>
            </VStack>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              How to use these color tokens in your components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={4} align="stretch">
              <Box p={4} bg="primary.50" borderLeft="4px solid" borderLeftColor="primary.500" borderRadius="md">
                <Text color="primary.800">
                  <strong>Primary.50</strong> background with <strong>primary.500</strong> left border
                </Text>
              </Box>
              
              <Box p={4} bg="secondary.100" border="1px solid" borderColor="secondary.300" borderRadius="md">
                <Text color="secondary.800">
                  <strong>Secondary.100</strong> background with <strong>secondary.300</strong> border
                </Text>
              </Box>

              <Box p={4} bg="success.50" border="1px solid" borderColor="success.200" borderRadius="md">
                <Text color="success.800">
                  <strong>Success.50</strong> background for success messages
                </Text>
              </Box>

              <Box p={4} bg="warning.50" border="1px solid" borderColor="warning.200" borderRadius="md">
                <Text color="warning.800">
                  <strong>Warning.50</strong> background for warning messages
                </Text>
              </Box>

              <Box p={4} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="md">
                <Text color="error.800">
                  <strong>Error.50</strong> background for error messages
                </Text>
              </Box>
            </VStack>
          </CardContent>
        </Card>
      </VStack>
    </Box>
  );
};

export default ThemeShowcase;
