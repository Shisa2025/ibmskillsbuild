import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from '@/pages/_layout';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/system/error-boundary';

import HomePage from '@/pages/index';
import NotFoundPage from '@/pages/not-found';

function App() {
  return (
    <ErrorBoundary>
      <Toaster richColors />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
