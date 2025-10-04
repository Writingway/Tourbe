import { FC } from 'react';
import { useQuizStore } from '../../store/useQuizStore';
import { Progress } from './Progress';
import { Question } from './Question';
import { Badge } from '../UI/Badge';
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Progress currentStep={currentStep + 1} totalSteps={TOTAL_STEPS} />

        {currentStep === 0 && (
          <Question
            title="What flavors appeal to you?"
            subtitle="Select all that sound interesting"
            onNext={handleNext}
            canProceed={answers.styleTags.length > 0}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STYLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleMultiSelect('styleTags', tag)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    answers.styleTags.includes(tag)
                      ? 'border-whisky-600 bg-whisky-50'
                      : 'border-gray-300 bg-white hover:border-whisky-400'
                  }`}
                >
                  <Badge
                    variant={
                      answers.styleTags.includes(tag) ? 'success' : 'default'
                    }
                    className="text-sm"
                  >
                    {formatLabel(tag)}
                  </Badge>
                </button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 1 && (
          <Question
            title="What intensity do you prefer?"
            subtitle="Choose one"
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
            title="What mouthfeel do you enjoy?"
            subtitle="Select all that apply"
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
            title="How long should the finish be?"
            subtitle="Choose one"
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
            title="What finish notes do you prefer?"
            subtitle="Select all that apply"
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
            title="Any regional preferences?"
            subtitle="Select all that interest you, or skip"
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
            title="What's your budget?"
            subtitle="Select all that work for you"
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
                      ? 'Under $40'
                      : band === '40_70'
                        ? '$40-70'
                        : band === '70_120'
                          ? '$70-120'
                          : 'Over $120'}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        )}

        {currentStep === 7 && (
          <Question
            title="Two final questions"
            subtitle="Help us fine-tune your matches"
            onNext={handleNext}
            onBack={handleBack}
            isLastStep
            canProceed={answers.openness !== null && answers.abvComfort !== null}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  How open are you to trying new things?
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
                        {formatLabel(openness)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  What ABV range are you comfortable with?
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
  );
};
