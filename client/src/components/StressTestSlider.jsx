import { useState } from 'react';
import { formatDollars } from '../utils/format';
import { stressTest } from '../utils/riskCalculations';

export default function StressTestSlider({ portfolioValue = 0 }) {
  const [shockPercent, setShockPercent] = useState(-20);

  const stressedValue = stressTest(portfolioValue, shockPercent / 100);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Market shock</span>
        <span>{shockPercent}%</span>
      </div>
      <input
        type="range"
        min={-80}
        max={20}
        step={1}
        value={shockPercent}
        onChange={(e) => setShockPercent(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Current value</span>
        <span>{formatDollars(portfolioValue)}</span>
      </div>
      <div className="flex justify-between text-sm font-semibold">
        <span>Stressed value</span>
        <span className={stressedValue < portfolioValue ? 'text-red-600' : 'text-green-600'}>
          {formatDollars(stressedValue)}
        </span>
      </div>
    </div>
  );
}
