import React from 'react'
import LivePreview from './LivePreview'
import { Grid, Box } from '@chakra-ui/react'
import FormConfigEditor from './FormConfigEditor'
import { AppHeader } from '../appHeader/AppHeader'

function FormBuilder() {
  return (
    <Box
      h={{ base: "auto", md: "100vh" }}
      minH={{ base: "100vh", md: "100vh" }}
      overflow="hidden"
    >
      <Box
        position="fixed"
        width={"100%"}
        top={0}
        zIndex={10}
        borderBottom="1px"
        borderColor="gray.200"
      >
        <AppHeader/>
      </Box>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
          lg: "1fr 1fr",
        }}
        gap={{ base: 4, md: 4 }}
        h={{ base: "auto", md: "100%" }}
        p={{ base: 3, md: 4 }}
        pt={{ base: "100px", md: "100px" }}
      >
        <Box
          overflow={{ base: "visible", md: "auto" }}
          h={{ base: "auto", md: "100%" }}
          mt={{ base: 4, md: 0 }}
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