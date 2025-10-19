import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ToastContainer } from './shared/components/ui';
import { ErrorBoundary } from './shared/components/common';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
