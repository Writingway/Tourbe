import { FC } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/useQuizStore';
import { LiquidProgress } from './LiquidProgress';
import { Question } from './Question';
import { ParticleBackground } from '../3D/ParticleBackground';
import { PageTransition } from '../Animations/PageTransition';
import { matchWhiskies } from '../../lib/matching';
import whiskiesData from '../../data/whiskies.json';
import type {
  StyleTag,
  Intensity,
  Mouthfeel,
  FinishLength,
  FinishNote,
  Region,
  PriceBand,
  Openness,
  ABVComfort,
  Whisky,
} from '../../lib/scoring.types';

const TOTAL_STEPS = 8;

const STYLE_TAGS: StyleTag[] = [
  'PEATY',
  'SMOKY',
  'FRUITY',
  'FLORAL',
  'SPICY',
  'SWEET',
  'NUTTY',
  'MALTY',
  'VANILLA',
];

const INTENSITIES: Intensity[] = ['LIGHT', 'MEDIUM', 'BOLD'];

const MOUTHFEELS: Mouthfeel[] = ['SOFT', 'OILY', 'DRY', 'HOT'];

const FINISH_LENGTHS: FinishLength[] = ['SHORT', 'MEDIUM', 'LONG'];

const FINISH_NOTES: FinishNote[] = ['SWEET', 'SPICE', 'SMOKE', 'DRIED_FRUIT'];

const REGIONS: Region[] = [
  'SCOTLAND_ISLAY',
  'SCOTLAND_SPEYSIDE',
  'SCOTLAND_HIGHLANDS',
  'SCOTLAND_ISLANDS',
  'SCOTLAND_LOWLANDS',
  'IRELAND',
  'JAPAN',
  'USA_BOURBON',
  'USA_RYE',
  'INDIA',
  'TAIWAN',
  'OTHER',
];

const PRICE_BANDS: PriceBand[] = ['UNDER_40', '40_70', '70_120', 'OVER_120'];

const OPENNESS_OPTIONS: Openness[] = ['CONSERVATIVE', 'CURIOUS', 'ADVENTUROUS'];

const OPENNESS_LABELS: Record<Openness, string> = {
  CONSERVATIVE: 'Conservateur',
  CURIOUS: 'Curieux',
  ADVENTUROUS: 'Aventureux',
};

const ABV_COMFORT_OPTIONS: ABVComfort[] = [
  'UNDER_43',
  '43_46',
  '46_50',
  'OVER_50',
];

const formatLabel = (value: string): string => {
  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export const QuizShell: FC = () => {
  const { currentStep, answers, updateAnswers, nextStep, prevStep, setResults } =
    useQuizStore();

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS - 1) {
      const matches = matchWhiskies(answers, whiskiesData as Whisky[]);
      setResults(matches);
      window.location.href = '/results';
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      prevStep();
    }
  };

  const toggleMultiSelect = <T extends string>(
    key: keyof typeof answers,
    value: T
  ) => {
    const current = answers[key] as T[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateAnswers({ [key]: updated });
  };

  const setSingleSelect = <T extends string>(
    key: keyof typeof answers,
    value: T
  ) => {
    updateAnswers({ [key]: value });
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen px-4 py-12">
        <ParticleBackground />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-12">
            <LiquidProgress currentStep={currentStep + 1} totalSteps={TOTAL_STEPS} />
          </div>

        {currentStep === 0 && (
          <Question
            title="Quels arômes appréciez-vous ?"
            subtitle="Sélectionnez toutes les réponses applicables"
            onNext={handleNext}
            canProceed={answers.styleTags.length > 0}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {STYLE_TAGS.map((tag, idx) => (
                <motion.button
                  key={tag}
                  onClick={() => toggleMultiSelect('styleTags', tag)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: -5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 rounded-xl transition-all ${
                    answers.styleTags.includes(tag)
                      ? 'glass-effect border-2 border-copper-500 bg-copper-500/20'
                      : 'glass-effect border-2 border-dark-700 hover:border-copper-500/50'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <span className={`text-sm font-medium ${
                    answers.styleTags.includes(tag) ? 'text-copper-300' : 'text-copper-100'
                  }`}>
                    {formatLabel(tag)}
                  </span>
                </motion.button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 1 && (
          <Question
            title="Quelle intensité préférez-vous ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.intensity !== null}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INTENSITIES.map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setSingleSelect('intensity', intensity)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.intensity === intensity
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {formatLabel(intensity)}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 2 && (
          <Question
            title="Quelle texture en bouche préférez-vous ?"
            subtitle="Sélectionnez toutes les réponses applicables"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.mouthfeel.length > 0}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOUTHFEELS.map((mouthfeel) => (
                <button
                  key={mouthfeel}
                  onClick={() => toggleMultiSelect('mouthfeel', mouthfeel)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.mouthfeel.includes(mouthfeel)
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {formatLabel(mouthfeel)}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 3 && (
          <Question
            title="Combien de temps la finale doit-elle durer ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.finishLength !== null}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FINISH_LENGTHS.map((length) => (
                <button
                  key={length}
                  onClick={() => setSingleSelect('finishLength', length)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.finishLength === length
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {formatLabel(length)}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 4 && (
          <Question
            title="Quelles notes de finale appréciez-vous ?"
            subtitle="Sélectionnez toutes les réponses applicables"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.finishNotes.length > 0}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FINISH_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => toggleMultiSelect('finishNotes', note)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.finishNotes.includes(note)
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {formatLabel(note)}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 5 && (
          <Question
            title="Quelles régions vous intéressent ?"
            subtitle="Sélectionnez toutes celles qui vous intéressent, ou passez"
            onNext={handleNext}
            onBack={handleBack}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => toggleMultiSelect('regions', region)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    answers.regions.includes(region)
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-sm font-medium">
                    {formatLabel(region)}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 6 && (
          <Question
            title="Quel est votre budget ?"
            subtitle="Sélectionnez tout ce qui vous convient"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.budget.length > 0}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRICE_BANDS.map((band) => (
                <button
                  key={band}
                  onClick={() => toggleMultiSelect('budget', band)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.budget.includes(band)
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {band === 'UNDER_40'
                      ? 'Moins de 40€'
                      : band === '40_70'
                        ? '40€-70€'
                        : band === '70_120'
                          ? '70€-120€'
                          : 'Plus de 120€'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 7 && (
          <Question
            title="Deux dernières questions"
            subtitle="Aidez-nous à affiner vos recommandations"
            onNext={handleNext}
            onBack={handleBack}
            isLastStep
            canProceed={answers.openness !== null && answers.abvComfort !== null}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Êtes-vous ouvert à essayer de nouvelles choses ?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {OPENNESS_OPTIONS.map((openness) => (
                    <button
                      key={openness}
                      onClick={() => setSingleSelect('openness', openness)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        answers.openness === openness
                          ? 'border-whisky-600 bg-whisky-50'
                          : 'border-gray-300 bg-white hover:border-whisky-400'
                      }`}
                    >
                      <span className="text-lg font-medium">
                        {OPENNESS_LABELS[openness]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Quel degré d'alcool préférez-vous ?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ABV_COMFORT_OPTIONS.map((abv) => (
                    <button
                      key={abv}
                      onClick={() => setSingleSelect('abvComfort', abv)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        answers.abvComfort === abv
                          ? 'border-whisky-600 bg-whisky-50'
                          : 'border-gray-300 bg-white hover:border-whisky-400'
                      }`}
                    >
                      <span className="text-lg font-medium">
                        {abv === 'UNDER_43'
                          ? 'Under 43%'
                          : abv === '43_46'
                            ? '43-46%'
                            : abv === '46_50'
                              ? '46-50%'
                              : 'Over 50%'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Question>
        )}
        </div>
      </div>
    </PageTransition>
  );
};
