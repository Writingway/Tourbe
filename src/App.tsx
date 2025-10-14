import { FC, Component, ReactNode, useEffect } from 'react';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Results } from './pages/Results';
import { Map } from './pages/Map';
import { QR } from './pages/QR';
import { Insights } from './pages/Insights';
import { Browse } from './pages/Browse';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuthStore } from './store/useAuthStore';
import { WhiskiesProvider } from './contexts/WhiskiesContext';
import './styles/tailwind.css';
import 'leaflet/dist/leaflet.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 mb-4">{this.state.error.message}</p>
            <button
              onClick={() => (window.location.href = '/')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Router: FC = () => {

  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading while initializing auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen textured-bg flex items-center justify-center">
        <div className="card p-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cream-300">Initialisation...</p>
          </div>
        </div>
      </div>
    );
  }

  const path = window.location.pathname;

  switch (path) {
    case '/':
      return <Home />;
    case '/browse':
      return <Browse />;
    case '/quiz':
      return <Quiz />;
    case '/results':
      return <Results />;
    case '/map':
      return <Map />;
    case '/qr':
      return <QR />;
    case '/insights':
      return <Insights />;
    case '/profile':
      return <Profile />;
    case '/admin':
      return <AdminDashboard />;
    default:
      return <Home />;
  }
};

const App: FC = () => {
  return (
    <ErrorBoundary>
      <WhiskiesProvider>
        <Router />
      </WhiskiesProvider>
    </ErrorBoundary>
  );
};

export default App;
