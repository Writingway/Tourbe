/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, FC, ReactNode } from 'react';
import { useWhiskies } from '../hooks/useWhiskies';
import type { Whisky } from '../lib/scoring.types';

interface WhiskiesContextValue {
  whiskies: Whisky[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  count: number;
}

const WhiskiesContext = createContext<WhiskiesContextValue | undefined>(undefined);

interface WhiskiesProviderProps {
  children: ReactNode;
}

export const WhiskiesProvider: FC<WhiskiesProviderProps> = ({ children }) => {
  const { whiskies, isLoading, error, refresh, count } = useWhiskies({
    limit: 1000, // Load all whiskies at once for now
  });

  return (
    <WhiskiesContext.Provider value={{ whiskies, isLoading, error, refresh, count }}>
      {children}
    </WhiskiesContext.Provider>
  );
};

/**
 * Hook to access whiskies from anywhere in the app
 */
export function useWhiskiesContext(): WhiskiesContextValue {
  const context = useContext(WhiskiesContext);
  if (!context) {
    throw new Error('useWhiskiesContext must be used within WhiskiesProvider');
  }
  return context;
}
