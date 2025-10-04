import { FC } from 'react';
import { Disclosure } from '@headlessui/react';
import type { ScoreBreakdown as ScoreBreakdownType } from '../../lib/scoring.types';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
}

const breakdownLabels: Record<keyof ScoreBreakdownType, string> = {
  styleMatch: 'Style Match',
  intensityMatch: 'Intensity Match',
  mouthfeelMatch: 'Mouthfeel Match',
  finishMatch: 'Finish Match',
  regionMatch: 'Region Match',
  budgetMatch: 'Budget Match',
  abvMatch: 'ABV Match',
  experimentalBonus: 'Experimental Bonus',
  styleSimilarity: 'Style Similarity',
};

const breakdownDescriptions: Record<keyof ScoreBreakdownType, string> = {
  styleMatch: 'How well the whisky matches your selected flavor tags',
  intensityMatch: 'Alignment with your preferred intensity level',
  mouthfeelMatch: 'Match with your desired mouthfeel characteristics',
  finishMatch: 'How the finish length and notes align with your preferences',
  regionMatch: 'Compatibility with your regional preferences',
  budgetMatch: 'Fit within your budget range',
  abvMatch: 'Alignment with your ABV comfort range',
  experimentalBonus: 'Bonus for experimental whiskies if you are adventurous',
  styleSimilarity: 'Overall similarity to your taste profile',
};

export const ScoreBreakdown: FC<ScoreBreakdownProps> = ({ breakdown }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-whisky-900 bg-whisky-100 rounded-lg hover:bg-whisky-200 focus:outline-none focus-visible:ring focus-visible:ring-whisky-500 focus-visible:ring-opacity-75">
            <span>View score breakdown</span>
            <svg
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-whisky-500 transition-transform`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-700">
            <div className="space-y-3">
              {(Object.keys(breakdown) as Array<keyof ScoreBreakdownType>).map(
                (key) => (
                  <div key={key} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {breakdownLabels[key]}
                      </p>
                      <p className="text-xs text-gray-600">
                        {breakdownDescriptions[key]}
                      </p>
                    </div>
                    <span
                      className={`ml-4 font-bold ${
                        breakdown[key] > 0
                          ? 'text-green-600'
                          : breakdown[key] < 0
                            ? 'text-red-600'
                            : 'text-gray-500'
                      }`}
                    >
                      {breakdown[key] > 0 ? '+' : ''}
                      {breakdown[key].toFixed(1)}
                    </span>
                  </div>
                )
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
