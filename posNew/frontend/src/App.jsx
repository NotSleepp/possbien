import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
