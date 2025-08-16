import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { colors, components } from './color';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
});

export default theme;
