import React from 'react'
import LivePreview from './LivePreview'
import { Grid, Box } from '@chakra-ui/react'
import FormConfigEditor from './FormConfigEditor'

function FormBuilder() {
  return (
    <Box
      h={{ base: "auto", md: "100vh" }}
      minH={{ base: "100vh", md: "100vh" }}
      overflow="hidden"
    >
      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
          lg: "1fr 1fr",
        }}
        gap={{ base: 4, md: 6 }}
        h={{ base: "auto", md: "100vh" }}
        p={{ base: 3, md: 4 }}
      >
        <Box
          overflow="hidden"
          h={{ base: "auto", md: "100%" }}
        >
          <FormConfigEditor />
        </Box>
        <Box
          overflow={{ base: "visible", md: "auto" }}
          h={{ base: "auto", md: "100%" }}
          mt={{ base: 4, md: 0 }}
        >
          <LivePreview />
        </Box>
      </Grid>
    </Box>
  )
}

export default FormBuilder