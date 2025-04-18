import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './layout/Layout';
import Loader from './components/Loader/Loader';

// Lazy load components
const Home = lazy(() => import('./pages/Home/Home'));
const Alerts = lazy(() => import('./pages/Alerts'));
const CurrentState = lazy(() => import('./pages/CurrentState'));
// const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <div className="app">
      <Suspense fallback={<Loader text="Loading page..." />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/current-state" element={<CurrentState />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Layout>
      </Suspense>
    </div>
  );
}

export default App; 