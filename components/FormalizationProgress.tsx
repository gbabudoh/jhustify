'use client';

import { motion } from 'framer-motion';
import { Target, Flag, CheckCircle2 } from 'lucide-react';

interface FormalizationProgressProps {
  progress: number;
}

export default function FormalizationProgress({ progress }: FormalizationProgressProps) {
  const steps = [
    { label: 'Unregistered', min: 0 },
    { label: 'Community Verified', min: 30 },
    { label: 'In Progress', min: 60 },
    { label: 'Fully Formalized', min: 100 }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#465362] flex items-center gap-2">
          <Target className="text-[#5BB318]" size={20} /> Road to Formalization
        </h3>
        <span className="text-2xl font-black text-[#465362]">{progress}%</span>
      </div>

      <div className="relative h-4 bg-gray-100 rounded-full mb-10 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#C2EABD] via-[#5BB318] to-blue-500 rounded-full relative"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, idx) => {
          const isActive = progress >= step.min;
          return (
            <div key={idx} className="flex flex-col items-center gap-2 group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-[#5BB318] text-white shadow-lg' : 'bg-gray-100 text-gray-400'
              }`}>
                {isActive ? <CheckCircle2 size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
              </div>
              <span className={`text-[10px] font-bold text-center uppercase tracking-tighter ${
                isActive ? 'text-[#465362]' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <Flag className="text-white" size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">Next Milestone: Industry Licenses</p>
            <p className="text-[11px] text-blue-700 leading-tight">
              Submit your NAFDAC or local industry license to reach 60% and unlock B2B contract opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
