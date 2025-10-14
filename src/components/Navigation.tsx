import { FC, useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './Auth/AuthModal';

interface NavigationProps {
  currentPath?: string;
}

export const Navigation: FC<NavigationProps> = ({ currentPath = window.location.pathname }) => {
  const { isAuthenticated, isAdmin, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/browse', label: 'Explorer' },
    { path: '/map', label: 'Carte' },
  ];

  const handleOpenAuth = (view: 'login' | 'signup') => {
    setAuthView(view);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center font-bold text-dark-950 text-xl">
                T
              </div>
              <span className="text-xl font-serif font-bold text-gradient">Tourbe</span>
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

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && profile ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-sm font-bold text-dark-950">
                      {profile.full_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-cream-300 text-sm font-medium">
                      {profile.full_name || 'Mon compte'}
                    </span>
                    <svg
                      className="w-4 h-4 text-cream-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right card p-2">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/profile"
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                              active ? 'bg-dark-700 text-cream-100' : 'text-cream-300'
                            }`}
                          >
                            <span>👤</span>
                            Mon profil
                          </a>
                        )}
                      </Menu.Item>

                      {isAdmin && (
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/admin"
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                                active ? 'bg-dark-700 text-cream-100' : 'text-cream-300'
                              }`}
                            >
                              <span>📊</span>
                              Dashboard Admin
                            </a>
                          )}
                        </Menu.Item>
                      )}

                      <div className="my-1 border-t border-gold-400/20" />

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                              active ? 'bg-dark-700 text-red-400' : 'text-cream-300'
                            }`}
                          >
                            <span>🚪</span>
                            Déconnexion
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="hidden md:block px-4 py-2 text-cream-300 hover:text-cream-100 text-sm font-medium transition-colors"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="px-4 py-2 bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 rounded-full text-gold-400 text-sm font-medium transition-all"
                  >
                    S'inscrire
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Navigation - Bottom */}
            <div className="flex md:hidden items-center space-x-2">
              {navItems.slice(0, 3).map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive ? 'bg-amber-900 text-amber-100' : 'text-cream-300 hover:bg-dark-800'
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authView}
      />
    </>
  );
};
