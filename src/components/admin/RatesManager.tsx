import React, { useState } from 'react';
import { Info, Check, Coins } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { TransportMode } from '../../types';
import { ModeIcon, MODE_LABELS, MODE_UNITS } from '../common';

export const RatesManager: React.FC = () => {
  const { rates, updateRate } = useStore();

  const getPrice = (mode: TransportMode) => {
    return rates.find((r) => r.mode === mode)?.price ?? 0;
  };

  const [prices, setPrices] = useState<Record<TransportMode, string>>({
    sea: getPrice('sea').toString(),
    air: getPrice('air').toString(),
    land: getPrice('land').toString(),
  });

  const [savedMode, setSavedMode] = useState<TransportMode | null>(null);

  const handleSave = (mode: TransportMode) => {
    const val = parseFloat(prices[mode]);
    if (!isNaN(val) && val >= 0) {
      updateRate(mode, val);
      setSavedMode(mode);
      setTimeout(() => setSavedMode(null), 2500);
    }
  };

  const modes: TransportMode[] = ['sea', 'air', 'land'];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102b3b]">أسعار الحاسبة</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          أسعار أولية عامة بالدولار، وليست عروض أسعار نهائية. تؤثر مباشرة على حاسبة الموقع.
        </p>
      </div>

      <div className="admin-tip bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <Info size={19} className="text-amber-700 shrink-0 mt-0.5" />
        <p>
          الأسعار هنا بالدولار الأمريكي. الشحن البحري لكل متر مكعب (م³)، والشحن الجوي والبري لكل كيلوجرام (كجم).
          هذه الأسعار مخصصة للتقدير الأولي للعملاء، ولا تشمل الرسوم الجمركية والضرائب وتفريغ الموانئ التي يحددها الفريق لاحقاً.
        </p>
      </div>

      <div className="rates-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => (
          <div
            key={mode}
            className="rate-card bg-white rounded-xl border border-[#e6eaeb] p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <ModeIcon mode={mode} size={28} />
              </div>

              <h2 className="text-lg font-bold text-[#102b3b] mb-4">
                الشحن {MODE_LABELS[mode]}
              </h2>

              <label className="block text-xs font-semibold text-slate-700 mb-2">
                دولار أمريكي لكل {MODE_UNITS[mode]}
              </label>

              <div className="relative flex items-center mb-4">
                <span className="absolute left-3.5 text-slate-400 font-bold font-manrope text-sm">$</span>
                <input
                  type="number"
                  dir="ltr"
                  value={prices[mode]}
                  onChange={(e) =>
                    setPrices((prev) => ({ ...prev, [mode]: e.target.value }))
                  }
                  min="0.01"
                  max="100000"
                  step="0.01"
                  required
                  className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-4 pl-8 py-2.5 text-sm font-manrope font-bold outline-none"
                />
              </div>
            </div>

            <div>
              {savedMode === mode && (
                <div className="text-xs text-emerald-600 font-semibold mb-3 flex items-center gap-1.5">
                  <Check size={14} />
                  <span>تم حفظ وتحديث السعر!</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSave(mode)}
                className="w-full bg-[#102b3b] hover:bg-[#183343] text-white font-bold py-2.5 rounded text-xs transition-colors cursor-pointer"
              >
                حفظ السعر
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
