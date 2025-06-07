import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      //main: '#6a1b9a',
      main: '#6B705C'
    },
    secondary: {
      //main: '#f50057',
      main: '#CB997E'
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
});

export default theme;