import { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '../UI/Card';

export const QrCard: FC = () => {
  const url = window.location.origin;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-12">
      <Card variant="elevated" className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Scannez pour découvrir votre whisky
        </h2>
        <p className="text-gray-600 mb-6">
          Partagez ce code QR pour aider les autres à découvrir leur whisky parfait
        </p>
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <QRCodeSVG value={url} size={256} level="H" />
          </div>
        </div>
        <p className="text-sm text-gray-500">{url}</p>
      </Card>
    </div>
  );
};
