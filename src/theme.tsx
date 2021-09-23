import { createTheme } from '@mui/material';
import { blue, pink } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: blue,
    secondary: pink,
    background: {
      default: '#fff',
    },
  },
});

export default theme;
