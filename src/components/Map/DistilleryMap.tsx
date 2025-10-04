import { FC, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuizStore } from '../../store/useQuizStore';

// Fix Leaflet default icon issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DistilleryMapProps {
  selectedWhiskyId?: string;
}

export const DistilleryMap: FC<DistilleryMapProps> = ({ selectedWhiskyId }) => {
  const results = useQuizStore((state) => state.results);
  const [center, setCenter] = useState<[number, number]>([55.0, -3.0]);

  useEffect(() => {
    if (selectedWhiskyId) {
      const selectedWhisky = results.find(
        (r) => r.whisky.id === selectedWhiskyId
      );
      if (selectedWhisky) {
        setCenter([
          selectedWhisky.whisky.distilleryLocation.lat,
          selectedWhisky.whisky.distilleryLocation.lng,
        ]);
      }
    } else if (results.length > 0) {
      setCenter([
        results[0].whisky.distilleryLocation.lat,
        results[0].whisky.distilleryLocation.lng,
      ]);
    }
  }, [selectedWhiskyId, results]);

  const whiskiesToShow = results.slice(0, 3);

  if (whiskiesToShow.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">No results to display on map</p>
      </div>
    );
  }

  return (
    <div className="h-96 md:h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={6}
        className="h-full w-full"
        key={`${center[0]}-${center[1]}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {whiskiesToShow.map((match, index) => (
          <Marker
            key={match.whisky.id}
            position={[
              match.whisky.distilleryLocation.lat,
              match.whisky.distilleryLocation.lng,
            ]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">
                  #{index + 1} - {match.whisky.name}
                </h3>
                <p className="text-xs text-gray-600 mb-1">
                  {match.whisky.distillery}
                </p>
                <p className="text-xs text-gray-600">
                  {match.whisky.region.split('_').join(' ')}
                </p>
                <p className="text-xs font-semibold text-whisky-600 mt-2">
                  {match.score.toFixed(1)}% match
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
