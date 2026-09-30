import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TriangleAlert, 
  Lock, 
  Trash2, 
  ArrowRight, 
  X 
} from 'lucide-react';
import { toBengaliDigits, formatCurrency } from '../lib/constants';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetModal({ isOpen, onClose, onConfirm }: ResetModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agreement, setAgreement] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setAgreement(false);
    setConfirmInput('');
    onClose();
  };

  const handleNextStep1 = () => {
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (agreement) {
      setStep(3);
    }
  };

  const isConfirmed =
    confirmInput.trim().toUpperCase() === 'DELETE' ||
    confirmInput.trim().toUpperCase() === 'CONFIRM' ||
    confirmInput.trim() === 'মুছুন' ||
    confirmInput.trim() === 'রিসেট';

  const handleFinalConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-rose-500/40 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-700/70 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                সকল হিসাব মুছে ফেলার নিরাপত্তা প্রক্রিয়া
              </h3>
              <p className="text-[11px] text-rose-100 font-medium">
                অনুমতি ধাপ: {toBengaliDigits(step)} / ৩ (Three-Step Verification)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-rose-100 hover:text-white hover:bg-rose-700/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-center text-[10px] font-bold">
          <div
            className={`py-1 rounded ${
              step === 1
                ? 'bg-rose-600 text-white shadow-xs'
                : step > 1
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400'
            }`}
          >
            ১. প্রাথমিক অনুমতি {step > 1 && '✓'}
          </div>
          <div
            className={`py-1 rounded ${
              step === 2
                ? 'bg-rose-600 text-white shadow-xs'
                : step > 2
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400'
            }`}
          >
            ২. ঝুঁকি সচেতনতা {step > 2 && '✓'}
          </div>
          <div
            className={`py-1 rounded ${
              step === 3 ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400'
            }`}
          >
            ৩. চূড়ান্ত নিশ্চিতকরণ
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <TriangleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">প্রথম অনুমতি (১ম ধাপ):</strong>
                  আপনি কি সত্যিই এই পোর্টালের সমস্ত চাঁদা সংগ্রহ এবং খরচের হিসাব মুছে সম্পূর্ণ শূন্য (০ টাকা) করতে চান?
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>পরবর্তী ধাপে যান (১ম অনুমতি)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">
                    দ্বিতীয় অনুমতি (২য় ধাপ - স্থায়ী মুছে যাওয়ার সতর্কতা):
                  </strong>
                  এই হিসাবগুলো মুছে ফেললে তা <strong>আর কখনো পুনরুদ্ধার করা সম্ভব হবে না</strong>। আপনার কোনো পূর্ববর্তী হিসাব প্রয়োজন হলে এখনই এক্সেল বা পিডিএফ ডাউনলোড করে সংরক্ষণ করে নিন।
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  আমি বুঝেছি যে সমস্ত হিসাব চিরতরে মুছে যাবে এবং আমি হিসাব মুছে ফেলার দ্বিতীয় অনুমতি দিচ্ছি।
                </span>
              </label>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3.5 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ← পিছনে যান
                </button>
                <button
                  type="button"
                  disabled={!agreement}
                  onClick={handleNextStep2}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 ${
                    agreement
                      ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-95'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>শেষ ধাপে যান (২য় অনুমতি)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-red-100 dark:bg-red-950/60 border-2 border-red-500 rounded-xl text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5">
                <Lock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">
                    চূড়ান্ত অনুমতি (৩য় ধাপ - নিরাপত্তা কোড যাচাই):
                  </strong>
                  সব হিসাব চূড়ান্তভাবে মুছে ফেলতে নিচে বাক্সে <strong>DELETE</strong> অথবা <strong>মুছুন</strong> টাইপ করুন:
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="এখানে DELETE অথবা মুছুন লিখুন"
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-rose-400 rounded-xl text-sm font-bold text-center tracking-wider text-rose-600 dark:text-rose-400 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-500 text-center mt-1">
                  (টাইপ করার পর নিচের লাল চূড়ান্ত মুছুন বাটন সক্রিয় হবে)
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3.5 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ← পিছনে যান
                </button>
                <button
                  type="button"
                  disabled={!isConfirmed}
                  onClick={handleFinalConfirm}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center gap-2 ${
                    isConfirmed
                      ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer active:scale-95 animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>চূড়ান্তভাবে সব হিসাব মুছুন</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
