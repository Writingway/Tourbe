import { FC } from 'react';

interface NavigationProps {
  currentPath?: string;
}

export const Navigation: FC<NavigationProps> = ({ currentPath = window.location.pathname }) => {
  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/browse', label: 'Explorer' },
    { path: '/map', label: 'Carte' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center font-bold text-dark-950 text-xl">
              T
            </div>
            <span className="text-xl font-serif font-bold text-gradient">
              Tourbe
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-900 text-amber-100'
                      : 'text-cream-300 hover:bg-dark-800 hover:text-amber-200'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-900 text-amber-100'
                      : 'text-cream-300 hover:bg-dark-800'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
