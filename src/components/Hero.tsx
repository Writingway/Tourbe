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
            No more guessing — discover the whisky made for you
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Answer a few simple questions and find your perfect whisky match from our curated selection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" size="lg" onClick={handleStartQuiz}>
              Find my whisky
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = '/browse')}
            >
              Browse All Whiskies
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsModalOpen(true)}
            >
              Learn how it works
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
                How it works
              </Dialog.Title>
              <ul className="space-y-4 text-left text-gray-700">
                <li className="flex gap-3">
                  <span className="text-whisky-600 font-bold">1.</span>
                  <span>
                    Answer questions about your taste preferences, from flavor
                    profiles to intensity and finish
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-whisky-600 font-bold">2.</span>
                  <span>
                    Our algorithm analyzes your answers against 101 carefully
                    curated whiskies
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-whisky-600 font-bold">3.</span>
                  <span>
                    Get personalized recommendations with detailed match scores
                    and tasting notes
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  Got it
                </Button>
              </div>
            </Card>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
