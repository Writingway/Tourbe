import { FC, Component, ReactNode } from 'react';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Results } from './pages/Results';
import { Map } from './pages/Map';
import { QR } from './pages/QR';
import { Insights } from './pages/Insights';
import { Browse } from './pages/Browse';
import whiskiesData from './data/whiskies.json';
import { WhiskyDataSchema } from './lib/scoring.types';
import { ZodError } from 'zod';
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
      if (this.state.error instanceof ZodError) {
        const zodError = this.state.error as ZodError;
        const errors = zodError.issues.slice(0, 5);
        return (
          <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                Whisky Data Validation Error
              </h1>
              <p className="text-gray-700 mb-4">
                The whiskies.json file contains invalid data. Please check the
                following errors:
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2 text-sm font-mono">
                  {errors.map((err, idx: number) => (
                    <li key={idx} className="text-red-800">
                      <strong>Path:</strong> {err.path.join('.')} -{' '}
                      <strong>Error:</strong> {err.message}
                    </li>
                  ))}
                </ul>
                {zodError.issues.length > 5 && (
                  <p className="mt-2 text-sm text-gray-600">
                    ...and {zodError.issues.length - 5} more errors
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }

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

const validateWhiskiesData = () => {
  try {
    WhiskyDataSchema.parse(whiskiesData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    throw new Error('Failed to validate whiskies data');
  }
};

const Router: FC = () => {
  validateWhiskiesData();

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
    default:
      return <Home />;
  }
};

const App: FC = () => {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
};

export default App;
