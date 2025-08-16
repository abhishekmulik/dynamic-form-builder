import React from 'react';
import FormBuilder from './components/formBuilder/FormBuilder';
import { Box } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Box bg="white.200">
        <FormBuilder />
      </Box>
    </Provider>
  );
}

export default App;
