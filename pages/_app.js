import '../styles/globals.css';
import { AuthProvider } from '../lib/auth';
import { ThemeProvider } from '@chakra-ui/system';
import theme from '../styles/theme';

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
