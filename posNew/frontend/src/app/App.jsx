import './App.css'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/index";
import { ToastContainer } from "../shared/components/ui";
import { ErrorBoundary } from "../shared/components/common";
import { ThemeProvider } from '../providers/ThemeProvider';

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
