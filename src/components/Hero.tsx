import { FC, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Navigation } from './Navigation';
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
      <div className="relative min-h-screen textured-bg">
        {/* Navigation */}
        <Navigation currentPath="/" />

        {/* Hero Content */}
        <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-5xl w-full text-center">
            {/* Title */}
            <h1 className="text-3xl md:text-3xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
              <span className="text-gradient">Fini les hésitations</span>
              <br />
              <span className="text-cream-100">découvrez le whisky</span>
              <br />
              <span className="text-gradient">fait pour vous</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-cream-300 mb-12 max-w-3xl mx-auto font-sans">
              Répondez à quelques questions simples et trouvez votre whisky idéal parmi notre sélection premium
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartQuiz}
                className="btn-primary text-lg px-8"
              >
                Trouver mon whisky
              </button>

              <button
                onClick={() => (window.location.href = '/browse')}
                className="btn-secondary"
              >
                Parcourir la collection
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-secondary"
              >
                Comment ça marche
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              {[
                { title: '500 Whiskies', desc: 'Sélection premium' },
                { title: 'Algorithme intelligent', desc: 'Recommandations précises' },
                { title: 'Rapide', desc: 'Résultats en 2 minutes' },
              ].map((feature, idx) => (
                <div key={idx} className="card p-6 text-center">
                  <h3 className="text-gold-400 font-semibold mb-2">{feature.title}</h3>
                  <p className="text-cream-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card max-w-lg w-full p-8">
            <Dialog.Title className="text-3xl font-serif font-bold text-gradient mb-6">
              Comment ça marche
            </Dialog.Title>
            <ul className="space-y-6 text-left">
              {[
                {
                  num: '1',
                  text: "Répondez aux questions sur vos préférences gustatives, des profils aromatiques à l'intensité et à la finale",
                },
                {
                  num: '2',
                  text: 'Notre algorithme analyse vos réponses parmi 101 whiskies soigneusement sélectionnés',
                },
                {
                  num: '3',
                  text: 'Obtenez des recommandations personnalisées avec scores de correspondance et notes de dégustation détaillés',
                },
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center font-bold text-dark-950">
                    {item.num}
                  </span>
                  <span className="pt-1 text-cream-200">{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full btn-primary"
              >
                Compris
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
