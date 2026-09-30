import React, { useState } from 'react';
import { Contribution } from '../types';
import { 
  MONTHS, 
  toBengaliDigits, 
  formatCurrency, 
  formatBengaliDate, 
  getRunningTwoMonths 
} from '../lib/constants';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Receipt, 
  SquarePen, 
  Trash2, 
  CircleCheck, 
  Clock, 
  CircleAlert, 
  Users 
} from 'lucide-react';

interface ContributionsProps {
  contributions: Contribution[];
  onDeleteContribution: (id: string) => void;
  onEditContribution: (contribution: Contribution) => void;
  onOpenReceipt: (contribution: Contribution) => void;
}

export function Contributions({
  contributions,
  onDeleteContribution,
  onEditContribution,
  onOpenReceipt
}: ContributionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const runningMonths = getRunningTwoMonths();

  const filteredContributions = contributions.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.note && c.note.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesMonth = true;
    if (monthFilter === 'running_two') {
      matchesMonth =
        (c.monthKey === runningMonths.currentMonth.key && c.year === runningMonths.currentMonth.year) ||
        (c.monthKey === runningMonths.previousMonth.key && c.year === runningMonths.previousMonth.year);
    } else if (monthFilter !== 'all') {
      matchesMonth = c.monthKey === Number(monthFilter);
    }

    const matchesStatus = statusFilter === 'all' || c.paymentStatus === statusFilter;

    return matchesSearch && matchesMonth && matchesStatus;
  });

  const totalCollectedFiltered = filteredContributions.reduce(
    (acc, curr) => acc + (Number(curr.amountPaid) || 0),
    0
  );
  const totalDueFiltered = filteredContributions.reduce(
    (acc, curr) => acc + (Number(curr.dueAmount) || 0),
    0
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              ছাত্র পেমেন্ট লিস্ট ও রেকর্ড (Contributions)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              মোট রেকর্ড: {toBengaliDigits(filteredContributions.length)} টি | সংগৃহীত:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalCollectedFiltered)}
              </strong>{' '}
              {totalDueFiltered > 0 && `| বকেয়া: ${formatCurrency(totalDueFiltered)}`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setMonthFilter('running_two')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                monthFilter === 'running_two'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              রানিং ২ মাসের রেকর্ড
            </button>
            <button
              onClick={() => {
                setMonthFilter('all');
                setStatusFilter('all');
                setSearchTerm('');
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
            >
              রিসেট ফিল্টার
            </button>
          </div>
        </div>

        {/* Filter inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="শিক্ষার্থীর নাম বা রোল খুঁজুন..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">সব মাস (All Months)</option>
              <option value="running_two">রানিং ২ মাস ({runningMonths.label})</option>
              {MONTHS.map((m) => (
                <option key={m.key} value={m.key.toString()}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="paid">পরিশোধিত</option>
              <option value="partial">আংশিক জমা</option>
              <option value="due">বকেয়া</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3.5">#</th>
              <th className="py-2.5 px-3.5">শিক্ষার্থীর নাম ও রোল</th>
              <th className="py-2.5 px-3.5">চাঁদার মাস</th>
              <th className="py-2.5 px-3.5 text-right">জমা (৳)</th>
              <th className="py-2.5 px-3.5 text-right">বকেয়া (৳)</th>
              <th className="py-2.5 px-3.5">মাধ্যম</th>
              <th className="py-2.5 px-3.5 text-center">স্ট্যাটাস</th>
              <th className="py-2.5 px-3.5">তারিখ</th>
              <th className="py-2.5 px-3.5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredContributions.length > 0 ? (
              filteredContributions.map((c, idx) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-400">
                    {toBengaliDigits(idx + 1)}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{c.studentName}</span>
                      {c.isDemo && (
                        <span className="px-1.5 py-0.2 text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                          ডেমো
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">{c.roll}</div>
                  </td>
                  <td className="py-2.5 px-3.5 font-medium text-slate-700 dark:text-slate-300">
                    {c.month}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(c.amountPaid)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-semibold text-orange-500 dark:text-orange-400">
                    {c.dueAmount > 0 ? formatCurrency(c.dueAmount) : '—'}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                      {c.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    {c.paymentStatus === 'paid' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        <CircleCheck className="w-2.5 h-2.5" /> পরিশোধিত
                      </span>
                    )}
                    {c.paymentStatus === 'partial' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                        <Clock className="w-2.5 h-2.5" /> আংশিক জমা
                      </span>
                    )}
                    {c.paymentStatus === 'due' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                        <CircleAlert className="w-2.5 h-2.5" /> বকেয়া
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {formatBengaliDate(c.paymentDate)}
                    </div>
                    {c.note && (
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]" title={c.note}>
                        {c.note}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenReceipt(c)}
                        title="রিসিট স্লিপ"
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditContribution(c)}
                        title="সম্পাদনা"
                        className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                      >
                        <SquarePen className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি নিশ্চিতভাবে "${c.studentName}"-এর এই রেকর্ডটি মুছে ফেলতে চান?`)) {
                            onDeleteContribution(c.id);
                          }
                        }}
                        title="মুছে ফেলুন"
                        className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Users className="w-6 h-6 text-slate-300 stroke-1" />
                    <p className="text-xs font-medium">কোনো চাঁদার রেকর্ড খুঁজে পাওয়া যায়নি</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
