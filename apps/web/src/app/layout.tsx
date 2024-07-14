import type { Metadata } from 'next';

// Providers
import TanstackQueryProvider from '@/providers/TanstackQueryProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import ProgressBarProvider from '@/providers/ProgressBarProvider';
import NextAuthProvider from '@/providers/NextAuthProvider';
import favicon from './favicon.ico';
// Theme
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';

// Toast
import { Toaster } from 'react-hot-toast';
import 'simplebar-react/dist/simplebar.min.css';

// Slider
import 'simplebar-react/dist/simplebar.min.css';

//Mte-data
import { defaultMetadata } from './meta-tag';

type Props = {
  children: React.ReactNode;
};
export const metadata = defaultMetadata;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <NextAuthProvider>
          <TanstackQueryProvider>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <ProgressBarProvider>
                  <CssBaseline />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: 'black',
                        color: 'white',
                        fontStyle: 'italic',
                        borderRadius: 0,
                      },
                      success: {
                        style: {
                          background: '#28a745',
                        },
                      },
                      error: {
                        style: {
                          background: '#dc3545',
                        },
                      },
                    }}
                  />
                  {children}
                </ProgressBarProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </TanstackQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
