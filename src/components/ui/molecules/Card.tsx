import { forwardRef } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="secondary.200"
      bg="white"
      color="secondary.800"
      boxShadow="sm"
      overflow="hidden"
      height="100%"
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Flex
      ref={ref}
      direction="column"
      gap={1.5}
      p={6}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Heading
      ref={ref}
      as="h3"
      fontSize="2xl"
      fontWeight="semibold"
      lineHeight="none"
      letterSpacing="tight"
      color="secondary.800"
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      fontSize="sm"
      color="secondary.600"
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} p={6} pt={0} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Flex
      ref={ref}
      align="center"
      p={6}
      pt={0}
      borderTopWidth="1px"
      borderTopColor="secondary.100"
      bg="secondary.50"
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };