import React from 'react'
import FormConfigEditor from './FormConfigEditor'
import LivePreview from './LivePreview'
import { Grid } from '@chakra-ui/react'

function FormBuilder() {
  return (
    <Grid templateColumns={{
      base: "1fr",           // Mobile: single column
      md: "1fr 1fr",         // Medium screens: 2 equal columns
      lg: "1fr 1fr",       // Large screens: fixed left + flexible right
    }}
      gap={6}                  // Spacing between columns
      minH="100vh"             // Full viewport height
      p={4}>
      <FormConfigEditor />
      <LivePreview />
    </Grid>

  )
}

export default FormBuilder