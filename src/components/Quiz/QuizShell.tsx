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
  Region,
  PriceBand,
  Openness,
  ABVComfort,
  Whisky,
  UserLevel,
  CaskType,
  PeatLevel,
  WhiskyAge,
  WhiskyType,
  ProductType,
  FinishType,
  FlavorProfile,
  Usage,
  OriginPreference,
} from '../../lib/scoring.types';

const getTotalSteps = (userLevel: UserLevel | null): number => {
  if (userLevel === 'BEGINNER') return 6;
  if (userLevel === 'INTERMEDIATE') return 8;
  if (userLevel === 'CONNOISSEUR') return 9;
  return 1;
};


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

const USER_LEVELS: UserLevel[] = ['BEGINNER', 'INTERMEDIATE', 'CONNOISSEUR'];

const USER_LEVEL_LABELS: Record<UserLevel, { title: string; description: string }> = {
  BEGINNER: {
    title: 'Débutant',
    description: 'Peu ou pas d\'expérience avec le whisky',
  },
  INTERMEDIATE: {
    title: 'Intermédiaire',
    description: 'Connais les grandes familles et cherche à approfondir',
  },
  CONNOISSEUR: {
    title: 'Connaisseur',
    description: 'Intéressé par des références pointues ou éditions limitées',
  },
};

const CASK_TYPES: CaskType[] = ['EX_BOURBON', 'SHERRY', 'ATYPICAL_FINISH', 'INDIFFERENT'];
const PEAT_LEVELS: PeatLevel[] = ['NON_PEATED', 'LIGHTLY_PEATED', 'HEAVILY_PEATED', 'NO_PREFERENCE'];
const WHISKY_AGES: WhiskyAge[] = ['NO_PREFERENCE', '8_12', '12_18', 'OVER_18'];
const WHISKY_TYPES: WhiskyType[] = ['SINGLE_MALT', 'BLEND', 'BOURBON', 'INDIFFERENT'];
const PRODUCT_TYPES: ProductType[] = ['SINGLE_CASK', 'CASK_STRENGTH', 'SINGLE_MALT', 'BLEND', 'GRAIN_WHISKY', 'INDIFFERENT'];
const FINISH_TYPES: FinishType[] = ['SHERRY', 'PORT', 'RUM', 'RED_WINE', 'NEW_OAK', 'INDIFFERENT'];
const FLAVOR_PROFILES: FlavorProfile[] = ['SWEET', 'FRUITY', 'SMOKY', 'INDIFFERENT'];
const USAGE_OPTIONS: Usage[] = ['NEAT', 'COCKTAIL', 'BOTH'];
const ORIGIN_PREFERENCES: OriginPreference[] = ['AMERICAN', 'IRISH', 'SCOTTISH', 'INDIFFERENT'];

const formatLabel = (value: string): string => {
  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export const QuizShell: FC = () => {
  const { currentStep, answers, updateAnswers, nextStep, prevStep, setResults } =
    useQuizStore();

  const totalSteps = getTotalSteps(answers.userLevel);
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
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
            <LiquidProgress currentStep={currentStep + 1} totalSteps={totalSteps} />
          </div>

        {currentStep === 0 && (
          <Question
            title="Quel est votre niveau de connaissance du whisky ?"
            subtitle="Choisissez le niveau qui vous correspond le mieux"
            onNext={handleNext}
            canProceed={answers.userLevel !== null}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {USER_LEVELS.map((level, idx) => (
                <motion.button
                  key={level}
                  onClick={() => setSingleSelect('userLevel', level)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-8 rounded-xl transition-all ${
                    answers.userLevel === level
                      ? 'glass-effect border-2 border-copper-500 bg-copper-500/20'
                      : 'glass-effect border-2 border-dark-700 hover:border-copper-500/50'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="text-center">
                    <h3 className={`text-xl font-bold mb-2 ${
                      answers.userLevel === level ? 'text-copper-300' : 'text-copper-100'
                    }`}>
                      {USER_LEVEL_LABELS[level].title}
                    </h3>
                    <p className={`text-sm ${
                      answers.userLevel === level ? 'text-copper-200' : 'text-copper-200/70'
                    }`}>
                      {USER_LEVEL_LABELS[level].description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'BEGINNER' && currentStep === 1 && (
          <Question
            title="Quel profil de saveur préférez-vous ?"
            subtitle="Choisissez une ou plusieurs options"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.flavorProfile !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FLAVOR_PROFILES.map((profile) => (
                <button
                  key={profile}
                  onClick={() => setSingleSelect('flavorProfile', profile)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.flavorProfile === profile
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {profile === 'SWEET' ? 'Doux/Sucré' :
                     profile === 'FRUITY' ? 'Fruité' :
                     profile === 'SMOKY' ? 'Fumé' :
                     'Peu importe'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'BEGINNER' && currentStep === 2 && (
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

        {answers.userLevel === 'BEGINNER' && currentStep === 3 && (
          <Question
            title="Comment comptez-vous le déguster ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.usage !== null}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {USAGE_OPTIONS.map((usage) => (
                <button
                  key={usage}
                  onClick={() => setSingleSelect('usage', usage)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.usage === usage
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {usage === 'NEAT' ? 'Pur' :
                     usage === 'COCKTAIL' ? 'En cocktail' :
                     'Les deux'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'BEGINNER' && currentStep === 4 && (
          <Question
            title="Avez-vous une préférence d'origine ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.originPreference !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ORIGIN_PREFERENCES.map((origin) => (
                <button
                  key={origin}
                  onClick={() => setSingleSelect('originPreference', origin)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.originPreference === origin
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {origin === 'AMERICAN' ? 'Américain' :
                     origin === 'IRISH' ? 'Irlandais' :
                     origin === 'SCOTTISH' ? 'Écossais' :
                     'Peu importe'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'BEGINNER' && currentStep === 5 && (
          <Question
            title="Dernière question"
            subtitle="Êtes-vous ouvert à essayer de nouvelles choses ?"
            onNext={handleNext}
            onBack={handleBack}
            isLastStep
            canProceed={answers.openness !== null}
          >
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
          </Question>
        )}

        {answers.userLevel === 'INTERMEDIATE' && currentStep === 1 && (
          <Question
            title="Quelle région de prédilection ?"
            subtitle="Sélectionnez celles qui vous intéressent"
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

        {answers.userLevel === 'INTERMEDIATE' && currentStep === 2 && (
          <Question
            title="Niveau de tourbe recherché ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.peatLevel !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PEAT_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSingleSelect('peatLevel', level)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.peatLevel === level
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {level === 'NON_PEATED' ? 'Non tourbé' :
                     level === 'LIGHTLY_PEATED' ? 'Légèrement tourbé' :
                     level === 'HEAVILY_PEATED' ? 'Fortement tourbé' :
                     'Pas d\'avis'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'INTERMEDIATE' && currentStep === 3 && (
          <Question
            title="Type de fût recherché ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.caskType !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CASK_TYPES.map((cask) => (
                <button
                  key={cask}
                  onClick={() => setSingleSelect('caskType', cask)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.caskType === cask
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {cask === 'EX_BOURBON' ? 'Ex-Bourbon' :
                     cask === 'SHERRY' ? 'Sherry' :
                     cask === 'ATYPICAL_FINISH' ? 'Finish atypique' :
                     'Indifférent'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'INTERMEDIATE' && currentStep === 4 && (
          <Question
            title="Âge préféré ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.whiskyAge !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {WHISKY_AGES.map((age) => (
                <button
                  key={age}
                  onClick={() => setSingleSelect('whiskyAge', age)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.whiskyAge === age
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {age === 'NO_PREFERENCE' ? 'Sans préférence' :
                     age === '8_12' ? '8-12 ans' :
                     age === '12_18' ? '12-18 ans' :
                     'Plus de 18 ans'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'INTERMEDIATE' && currentStep === 5 && (
          <Question
            title="Type de whisky préféré ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.whiskyType !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {WHISKY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSingleSelect('whiskyType', type)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.whiskyType === type
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {formatLabel(type)}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'INTERMEDIATE' && currentStep === 6 && (
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

        {answers.userLevel === 'INTERMEDIATE' && currentStep === 7 && (
          <Question
            title="Dernière question"
            subtitle="Êtes-vous ouvert à essayer de nouvelles choses ?"
            onNext={handleNext}
            onBack={handleBack}
            isLastStep
            canProceed={answers.openness !== null}
          >
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
          </Question>
        )}

        {answers.userLevel === 'CONNOISSEUR' && currentStep === 1 && (
          <Question
            title="Type de produit recherché ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.productType !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PRODUCT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSingleSelect('productType', type)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.productType === type
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {formatLabel(type)}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'CONNOISSEUR' && currentStep === 2 && (
          <Question
            title="Type de finish recherché ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.finishType !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {FINISH_TYPES.map((finish) => (
                <button
                  key={finish}
                  onClick={() => setSingleSelect('finishType', finish)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.finishType === finish
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {finish === 'SHERRY' ? 'Sherry' :
                     finish === 'PORT' ? 'Porto' :
                     finish === 'RUM' ? 'Rhum' :
                     finish === 'RED_WINE' ? 'Vin rouge' :
                     finish === 'NEW_OAK' ? 'Fûts neufs' :
                     'Indifférent'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'CONNOISSEUR' && currentStep === 3 && (
          <Question
            title="Région ou distillerie de prédilection ?"
            subtitle="Sélectionnez celles qui vous intéressent"
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

        {answers.userLevel === 'CONNOISSEUR' && currentStep === 4 && (
          <Question
            title="Niveau de tourbe souhaité ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.peatLevel !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PEAT_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSingleSelect('peatLevel', level)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.peatLevel === level
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {level === 'NON_PEATED' ? 'Non' :
                     level === 'LIGHTLY_PEATED' ? 'Léger' :
                     level === 'HEAVILY_PEATED' ? 'Très tourbé' :
                     'Indifférent'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'CONNOISSEUR' && currentStep === 5 && (
          <Question
            title="Âge ou millésime recherché ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.whiskyAge !== null}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {WHISKY_AGES.map((age) => (
                <button
                  key={age}
                  onClick={() => setSingleSelect('whiskyAge', age)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    answers.whiskyAge === age
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <span className="text-lg font-medium">
                    {age === 'NO_PREFERENCE' ? 'Indifférent' :
                     age === '8_12' ? '10-15 ans' :
                     age === '12_18' ? '15-25 ans' :
                     'Plus de 25 ans'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {answers.userLevel === 'CONNOISSEUR' && currentStep === 6 && (
          <Question
            title="Intérêt pour les éditions limitées ?"
            subtitle="Choisissez-en une"
            onNext={handleNext}
            onBack={handleBack}
            canProceed={answers.limitedEditions !== null}
          >
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateAnswers({ limitedEditions: true })}
                className={`p-8 rounded-lg border-2 transition-all ${
                  answers.limitedEditions === true
                    ? 'border-whisky-600 bg-whisky-50'
                    : 'border-gray-300 bg-white hover:border-whisky-400'
                }`}
              >
                <span className="text-lg font-medium">Oui</span>
              </button>
              <button
                onClick={() => updateAnswers({ limitedEditions: false })}
                className={`p-8 rounded-lg border-2 transition-all ${
                  answers.limitedEditions === false
                    ? 'border-whisky-600 bg-whisky-50'
                    : 'border-gray-300 bg-white hover:border-whisky-400'
                }`}
              >
                <span className="text-lg font-medium">Non</span>
              </button>
            </div>
          </Question>
        )}

        {answers.userLevel === 'CONNOISSEUR' && currentStep === 7 && (
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

        {answers.userLevel === 'CONNOISSEUR' && currentStep === 8 && (
          <Question
            title="Dernière question"
            subtitle="Quel degré d'alcool préférez-vous ?"
            onNext={handleNext}
            onBack={handleBack}
            isLastStep
            canProceed={answers.abvComfort !== null}
          >
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
                      ? 'Moins de 43%'
                      : abv === '43_46'
                        ? '43-46%'
                        : abv === '46_50'
                          ? '46-50%'
                          : 'Plus de 50%'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}
        </div>
      </div>
    </PageTransition>
  );
};
