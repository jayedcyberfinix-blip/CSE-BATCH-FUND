import React from 'react';
import { Contribution, BatchInfo } from '../types';
import { ShieldCheck, Printer, X, CircleCheck, Award } from 'lucide-react';
import { formatCurrency, formatBengaliDate } from '../lib/constants';
import { Logo } from './Header';

interface ReceiptProps {
  contribution: Contribution;
  batchInfo: BatchInfo;
  onClose: () => void;
}

export function ReceiptModal({ contribution, batchInfo, onClose }: ReceiptProps) {
  const receiptNo = `IU-CSE-${contribution.roll || '00'}-${contribution.monthKey || '01'}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header toolbar */}
        <div className="p-3.5 bg-emerald-950 text-white flex items-center justify-between no-print border-b border-emerald-800/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs">ইসলামী বিশ্ববিদ্যালয় অফিসিয়াল মানি রিসিট</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint} 
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              প্রিন্ট / সেভ করুন
            </button>
            <button 
              onClick={onClose} 
              className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 bg-white relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none text-8xl font-black text-emerald-900">
            IU CSE
          </div>

          <div className="text-center pb-4 border-b-2 border-emerald-900/80 relative z-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Logo size="md" customLogo={batchInfo.customLogo} />
              <div className="text-left">
                <h3 className="text-xs sm:text-sm font-extrabold text-emerald-900 tracking-tight leading-tight">
                  {batchInfo.institution || "ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া"}
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  ISLAMIC UNIVERSITY, BANGLADESH
                </p>
                <p className="text-[11px] font-bold text-slate-700">
                  {batchInfo.department}
                </p>
              </div>
            </div>

            <div className="inline-block px-3 py-0.5 bg-emerald-900 text-white text-[10px] font-black tracking-widest rounded-full my-1">
              OFFICIAL MONEY RECEIPT • {batchInfo.batchName}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-600 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
              <span>রিসিট নং: <strong className="text-emerald-800">{receiptNo}</strong></span>
              <span>তারিখ: <strong>{formatBengaliDate(contribution.paymentDate)}</strong></span>
            </div>
          </div>

          <div className="py-4 space-y-3 border-b border-dashed border-slate-300 text-xs sm:text-sm relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">শিক্ষার্থীর নাম:</span>
              <span className="font-bold text-slate-900">{contribution.studentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">ক্লাস রোল:</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {contribution.roll}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">চাঁদার মাস ও সেশন:</span>
              <span className="font-semibold text-slate-800">
                {contribution.month} (সেশন: {batchInfo.session})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">পরিশোধ মাধ্যম:</span>
              <span className="uppercase font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">
                {contribution.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">পেমেন্ট স্ট্যাটাস:</span>
              <span className="inline-flex items-center gap-1 font-bold text-xs text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                <CircleCheck className="w-3.5 h-3.5 text-emerald-600" />
                {contribution.paymentStatus === 'paid' 
                  ? 'পরিশোধিত (PAID)' 
                  : contribution.paymentStatus === 'partial' 
                  ? 'আংশিক জমা (PARTIAL)' 
                  : 'বকেয়া (DUE)'}
              </span>
            </div>
            {contribution.note && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">মন্তব্য/নোট:</span>
                <span className="text-slate-700 italic">{contribution.note}</span>
              </div>
            )}
          </div>

          <div className="my-4 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between relative z-10">
            <div>
              <div className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">আদায়কৃত জমার পরিমাণ</div>
              <div className="text-2xl font-black text-emerald-700">{formatCurrency(contribution.amountPaid)}</div>
            </div>
            {contribution.dueAmount > 0 && (
              <div className="text-right">
                <div className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider">অবশিষ্ট বকেয়া</div>
                <div className="text-base font-bold text-amber-600">{formatCurrency(contribution.dueAmount)}</div>
              </div>
            )}
          </div>

          <div className="pt-6 flex items-end justify-between text-xs text-slate-600 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Award className="w-3 h-3" /> IU CSE ভেরিফায়েড
              </div>
              <div className="font-semibold text-slate-800 mt-1">অনুমোদিত তহবিল তত্ত্বাবধায়ক</div>
            </div>
            <div className="text-right">
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800 min-w-[120px]">
                স্বাক্ষর ও সিল
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] font-bold text-slate-500 tracking-wider relative z-10">
            CREATED BY JAYED • ISLAMIC UNIVERSITY, KUSHTIA
          </div>
        </div>
      </div>
    </div>
  );
}
