import React from 'react';
import { BookOpen, Info, CheckCircle, AlertCircle } from 'lucide-react';

interface FeatureDocsProps {
  howToUse: string[];
  whatToKnow: string[];
}

export const FeatureDocs: React.FC<FeatureDocsProps> = ({ howToUse, whatToKnow }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex-1">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
          <BookOpen className="size-4 text-[#0F4C81]" />
          <h3 className="text-[11px] font-black text-[#0F4C81] uppercase tracking-[0.2em]">How to Use</h3>
        </div>
        <ul className="space-y-4">
          {howToUse.map((step, i) => (
            <li key={i} className="flex gap-3">
              <div className="size-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[#0F4C81]">{i + 1}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                {step}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#0F4C81] rounded-2xl p-6 shadow-xl shadow-blue-900/20">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <Info className="size-4 text-amber-300" />
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">What You Should Know</h3>
        </div>
        <ul className="space-y-4">
          {whatToKnow.map((item, i) => (
            <li key={i} className="flex gap-3">
              <div className="size-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
              <p className="text-[11px] text-white/80 leading-relaxed font-medium italic">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
