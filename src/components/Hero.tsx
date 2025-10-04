import { FC, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { useQuizStore } from '../store/useQuizStore';

export const Hero: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const handleStartQuiz = () => {
    resetQuiz();
    window.location.href = '/quiz';
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-12">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Fini les hésitations — découvrez le whisky fait pour vous
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Répondez à quelques questions simples et trouvez votre whisky idéal parmi notre sélection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" size="lg" onClick={handleStartQuiz}>
              Trouver mon whisky
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = '/browse')}
            >
              Parcourir tous les whiskies
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsModalOpen(true)}
            >
              Comment ça marche
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md">
            <Card variant="elevated">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                Comment ça marche
              </Dialog.Title>
              <ul className="space-y-4 text-left text-gray-700">
                <li className="flex gap-3">
                  <span className="text-whisky-600 font-bold">1.</span>
                  <span>
                    Répondez aux questions sur vos préférences gustatives, des profils aromatiques à l'intensité et à la finale
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-whisky-600 font-bold">2.</span>
                  <span>
                    Notre algorithme analyse vos réponses parmi 101 whiskies soigneusement sélectionnés
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-whisky-600 font-bold">3.</span>
                  <span>
                    Obtenez des recommandations personnalisées avec scores de correspondance et notes de dégustation détaillés
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  Compris
                </Button>
              </div>
            </Card>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
