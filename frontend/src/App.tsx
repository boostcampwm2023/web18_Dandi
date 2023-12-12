import Router from './Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@util/ToastProvider';
import ModalProvider from './util/ModalProvider';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ModalProvider>
          <Router />
        </ModalProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
