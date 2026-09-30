import React, { useState } from 'react';
import { Expense } from '../types';
import { 
  EXPENSE_CATEGORIES, 
  toBengaliDigits, 
  formatCurrency, 
  formatBengaliDate 
} from '../lib/constants';
import { 
  Trash2, 
  Search, 
  Tag, 
  Receipt, 
  FileSpreadsheet 
} from 'lucide-react';

interface ExpensesProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function Expenses({ expenses, onDeleteExpense }: ExpensesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.receiptNumber && e.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.note && e.note.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalExpenseFiltered = filteredExpenses.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );

  const getCategoryDetails = (id: string) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              খরচের বিবরণী ও রেকর্ড (Batch Expenses)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              মোট রেকর্ড: {toBengaliDigits(filteredExpenses.length)} টি | সর্বমোট ব্যয়:{' '}
              <strong className="text-rose-600 dark:text-rose-400">
                {formatCurrency(totalExpenseFiltered)}
              </strong>
            </p>
          </div>

          <button
            onClick={() => {
              setCategoryFilter('all');
              setSearchTerm('');
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
          >
            রিসেট ফিল্টার
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="খরচের নাম, মেমো বা বিবরণ খুঁজুন..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
            >
              <option value="all">সকল খরচের খাত (All Categories)</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3.5">#</th>
              <th className="py-2.5 px-3.5">খরচের উদ্দেশ্য ও বিবরণ</th>
              <th className="py-2.5 px-3.5">ক্যাটাগরি</th>
              <th className="py-2.5 px-3.5 text-right">পরিমাণ (৳)</th>
              <th className="py-2.5 px-3.5">মেমো / ভাউচার</th>
              <th className="py-2.5 px-3.5">তারিখ</th>
              <th className="py-2.5 px-3.5">নোট</th>
              <th className="py-2.5 px-3.5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp, idx) => {
                const cat = getCategoryDetails(exp.category);
                return (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-400">
                      {toBengaliDigits(idx + 1)}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{exp.title}</span>
                        {exp.isDemo && (
                          <span className="px-1.5 py-0.2 text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                            ডেমো
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${cat.color}`}>
                        {cat.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="py-2.5 px-3.5">
                      {exp.receiptNumber ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <Receipt className="w-3 h-3 text-slate-400" />
                          {exp.receiptNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400 text-[11px]">
                      {formatBengaliDate(exp.date)}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-500 dark:text-slate-400 text-[11px] max-w-[120px] truncate" title={exp.note}>
                      {exp.note || '—'}
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি নিশ্চিতভাবে "${exp.title}"-এর এই খরচের রেকর্ডটি মুছে ফেলতে চান?`)) {
                            onDeleteExpense(exp.id);
                          }
                        }}
                        title="মুছে ফেলুন"
                        className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <FileSpreadsheet className="w-6 h-6 text-slate-300 stroke-1" />
                    <p className="text-xs font-medium">কোনো খরচের রেকর্ড খুঁজে পাওয়া যায়নি</p>
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
