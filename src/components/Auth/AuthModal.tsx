import { FC, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup';
}

export const AuthModal: FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultView = 'login',
}) => {
  const [view, setView] = useState<'login' | 'signup'>(defaultView);

  const handleSuccess = () => {
    onClose();
    // Rediriger vers le profil après connexion/inscription
    window.location.href = '/profile';
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl card p-8 transition-all">
                {view === 'login' ? (
                  <LoginForm
                    onSuccess={handleSuccess}
                    onSwitchToSignup={() => setView('signup')}
                  />
                ) : (
                  <SignupForm
                    onSuccess={handleSuccess}
                    onSwitchToLogin={() => setView('login')}
                  />
                )}

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-cream-400 hover:text-cream-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
