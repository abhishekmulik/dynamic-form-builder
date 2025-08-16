import { Box, Container, Flex, Heading, Text, HStack, Badge } from "@chakra-ui/react";

export function AppHeader() {
  return (
    <Box
      as="header"
      bg="white.100"
      borderBottomWidth="1px"
      backdropFilter="blur(5px)"
    >
        <Flex align="center" px={4} py={6} justify="space-between">
          <Box>
            <Heading as="h1" size="lg" color="gray.900">
            Dynamic Form Renderer
            </Heading>
          </Box>
        </Flex>
    </Box>
  );
}
