import React, { useState } from 'react';
import { Contribution, Expense } from '../types';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  AlertTriangle, 
  Trash2, 
  X, 
  Check, 
  ChartPie, 
  Zap, 
  PiggyBank 
} from 'lucide-react';
import { 
  formatCurrency, 
  toBengaliDigits, 
  EXPENSE_CATEGORIES, 
  MONTHS,
  calculateSummary 
} from '../lib/constants';

interface DashboardProps {
  contributions: Contribution[];
  expenses: Expense[];
  onRemoveDemoData: () => void;
  onOpenResetAllModal: () => void;
}

export function Dashboard({
  contributions,
  expenses,
  onRemoveDemoData,
  onOpenResetAllModal
}: DashboardProps) {
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);
  const summary = calculateSummary(contributions, expenses);
  const isBalanceSafe = summary.remainingBalance >= 0;
  const expenseRatio = summary.totalCollected > 0 
    ? Math.round((summary.totalExpenses / summary.totalCollected) * 100) 
    : 0;
  const dueRatio = summary.totalCollected > 0 
    ? Math.round((summary.totalDue / (summary.totalCollected + summary.totalDue)) * 100) 
    : 0;

  // Monthly comparison
  const monthlyStats = MONTHS.map(m => {
    const col = contributions
      .filter(c => c.monthKey === m.key)
      .reduce((sum, c) => sum + (Number(c.amountPaid) || 0), 0);
    const exp = expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() + 1 === m.key;
      })
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return {
      monthKey: m.key,
      name: m.name,
      collection: col,
      expense: exp
    };
  }).filter(m => m.collection > 0 || m.expense > 0 || m.monthKey <= (new Date().getMonth() + 1));

  const maxVal = Math.max(
    ...monthlyStats.map(m => Math.max(m.collection, m.expense)),
    1000
  );

  // Category breakdown
  const categoryStats = EXPENSE_CATEGORIES.map(cat => {
    const amount = expenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return {
      ...cat,
      amount
    };
  }).filter(c => c.amount > 0);

  const totalCatAmount = categoryStats.reduce((sum, c) => sum + c.amount, 0) || 1;

  let insightBadge = {
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    text: 'ফান্ড অত্যন্ত সুরক্ষিত ও স্থিতিশীল রয়েছে'
  };

  if (summary.remainingBalance < 0 || expenseRatio > 90) {
    insightBadge = {
      color: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
      text: 'সতর্কতা: খরচ আয়ের মাত্রা ছাড়িয়েছে বা ফান্ডের রিজার্ভ দ্রুত ফুরিয়ে যাচ্ছে'
    };
  } else if (expenseRatio > 70 || summary.totalDue > summary.remainingBalance) {
    insightBadge = {
      color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
      text: 'মনোযোগ প্রয়োজন: ব্যয় বৃদ্ধির গতি বেশি, বকেয়া আদায়ে জোর দিন'
    };
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Demo data alert */}
      {summary.hasDemoData ? (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-200/70 dark:bg-amber-900/80 rounded-lg text-amber-800 dark:text-amber-200 shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              <strong>ডেমো ডেটা সক্রিয়:</strong> বর্তমানে কিছু নমুনা চাঁদা ও খরচের হিসাব যুক্ত রয়েছে। আসল হিসাব শুরু করতে চাইলে ডেমো রেকর্ডগুলো সরিয়ে নিতে পারেন।
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {showDemoConfirm ? (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-amber-300 shadow-sm animate-in fade-in">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 pl-1.5">নিশ্চিত?</span>
                <button
                  onClick={() => {
                    onRemoveDemoData();
                    setShowDemoConfirm(false);
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> হ্যাঁ, মুছুন
                </button>
                <button
                  onClick={() => setShowDemoConfirm(false)}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md transition-all flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> বাতিল
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDemoConfirm(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0 cursor-pointer active:scale-95"
                title="শুধু ডেমো রেকর্ডগুলো মুছে ফেলুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ডেমো রেকর্ড মুছুন</span>
              </button>
            )}

            <button
              onClick={onOpenResetAllModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-700/90 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0 cursor-pointer active:scale-95"
              title="সব হিসাব সম্পূর্ণ মুছুন (৩-ধাপ নিরাপত্তা)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>সব হিসাব মুছুন</span>
            </button>
          </div>
        </div>
      ) : (summary.totalCollected > 0 || summary.totalExpenses > 0) && (
        <div className="flex justify-end">
          <button
            onClick={onOpenResetAllModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200/80 hover:bg-rose-100 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 text-slate-600 dark:text-slate-400 text-[11px] font-semibold rounded-lg border border-slate-300/80 dark:border-slate-700 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>সকল হিসাব সম্পূর্ণ মুছুন (৩-ধাপ নিরাপত্তা)</span>
          </button>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">মোট সংগৃহীত ফান্ড</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(summary.totalCollected)}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>আদায় চলমান</span>
            <span className="bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
              {toBengaliDigits(summary.paidCount + summary.partialCount)} টি এন্ট্রি
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">মোট ব্যয় / খরচ</span>
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(summary.totalExpenses)}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-rose-600 dark:text-rose-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>ব্যয়ের অনুপাত</span>
            <span className="bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-800">
              {toBengaliDigits(expenseRatio)}% মোট ফান্ডের
            </span>
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">বর্তমান অবশিষ্ট ব্যালেন্স</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <p className={`text-2xl sm:text-3xl font-black tracking-tight ${isBalanceSafe ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600'}`}>
            {formatCurrency(summary.remainingBalance)}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {isBalanceSafe ? 'ক্যাশ রিজার্ভ সুরক্ষিত' : 'ফান্ড ঘাটতি'}
            </span>
            <span className="bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800">
              হাতে ক্যাশ
            </span>
          </div>
        </div>

        {/* Total Dues */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">বকেয়া চাঁদা</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {formatCurrency(summary.totalDue)}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>বকেয়া শিক্ষার্থী</span>
            <span className="bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800">
              {toBengaliDigits(summary.dueCount + summary.partialCount)} জন বাকি
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              ফান্ড অ্যানালিটিক্স ও পরিসংখ্যান (Fund Analytics)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">মাসিক চাঁদা আদায় বনাম খরচ ও খাতভিত্তিক ব্যয় বিশ্লেষণ</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold rounded-full border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3 h-3" />
            রিয়েল-টাইম চার্ট
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Monthly Comparison Bar Chart */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                মাসভিত্তিক চাঁদা আদায় বনাম খরচ তুলনা
              </h4>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> চাঁদা আদায়
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500"></span> খরচ
                </span>
              </div>
            </div>

            <div className="h-60 flex flex-col justify-end pt-4">
              <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-4 h-48 items-end px-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                {monthlyStats.map((item) => {
                  const colHeight = Math.max(Math.round((item.collection / maxVal) * 100), 2);
                  const expHeight = Math.max(Math.round((item.expense / maxVal) * 100), item.expense > 0 ? 2 : 0);

                  return (
                    <div key={item.monthKey} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="flex items-end gap-1 sm:gap-1.5 h-full">
                        {/* Collection Bar */}
                        <div 
                          className="w-3 sm:w-4 bg-emerald-500 rounded-t transition-all hover:bg-emerald-400 relative"
                          style={{ height: `${colHeight}%` }}
                          title={`${item.name} চাঁদা: ৳${item.collection}`}
                        >
                          {item.collection > 0 && (
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-white dark:bg-slate-800 px-1 py-0.5 rounded shadow border border-slate-200 dark:border-slate-700 pointer-events-none transition-opacity">
                              ৳{item.collection}
                            </span>
                          )}
                        </div>

                        {/* Expense Bar */}
                        <div 
                          className="w-3 sm:w-4 bg-rose-500 rounded-t transition-all hover:bg-rose-400 relative"
                          style={{ height: `${expHeight}%` }}
                          title={`${item.name} খরচ: ৳${item.expense}`}
                        >
                          {item.expense > 0 && (
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-white dark:bg-slate-800 px-1 py-0.5 rounded shadow border border-slate-200 dark:border-slate-700 pointer-events-none transition-opacity">
                              ৳{item.expense}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[50px] text-center">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span>* রিয়েল-টাইম ডাটা অনুযায়ী চার্ট স্বয়ংক্রিয়ভাবে আপডেট হয়</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                মোট আদায়: {formatCurrency(summary.totalCollected)}
              </span>
            </div>
          </div>

          {/* Expense Category Breakdown */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ChartPie className="w-3.5 h-3.5 text-purple-500" />
                কোথায় কেমন খরচ হলো (খাতভিত্তিক ব্যয়)
              </h4>
              <span className="text-[10px] text-slate-400">মোট {toBengaliDigits(categoryStats.length)}টি খাত</span>
            </div>

            {categoryStats.length > 0 ? (
              <div className="space-y-3 my-auto py-2">
                {categoryStats.map((item) => {
                  const percentage = Math.round((item.amount / totalCatAmount) * 100);
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[10px] font-mono">{percentage}%</span>
                          <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                এখনো কোনো খরচের এন্ট্রি যুক্ত করা হয়নি।
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span>সর্বমোট ব্যয়:</span>
              <strong className="text-rose-600 dark:text-rose-400 font-bold">{formatCurrency(summary.totalExpenses)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Insights & Strategy Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              স্মার্ট ব্যয় নিয়ন্ত্রণ ও ফান্ড সুরক্ষা (Smart Insights)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">বর্তমান ফান্ড ট্রেন্ড ও ব্যয়ের ভিত্তিতে রিয়েল-টাইম কার্যকরী পরামর্শ</p>
          </div>
          <div className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${insightBadge.color}`}>
            {insightBadge.icon}
            <span>{insightBadge.text}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1 */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1.5">
                <PiggyBank className="w-3.5 h-3.5" />
                <span>ইমার্জেন্সি রিজার্ভ অনুপাত</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                মোট ফান্ডের অন্তত <strong>২০% ({formatCurrency(summary.totalCollected * 0.2)})</strong> আকস্মিক একাডেমিক ফি বা চিকিৎসার জন্য সংরক্ষিত রাখুন।
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
              <span>বর্তমান অবশিষ্ট:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{formatCurrency(summary.remainingBalance)}</strong>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>বকেয়া চাঁদা রিকভারি</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                বর্তমানে <strong>{toBengaliDigits(summary.dueCount + summary.partialCount)} জন</strong> শিক্ষার্থীর <strong>{formatCurrency(summary.totalDue)}</strong> বকেয়া রয়েছে।
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
              <span>বকেয়ার হার:</span>
              <strong className="text-amber-600 dark:text-amber-400 font-semibold">{toBengaliDigits(dueRatio)}%</strong>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>ফটোকপি ও শিট সাশ্রয়</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                ডিপার্টমেন্টাল প্রিন্ট বা ফটোকপির ক্ষেত্রে এককালীন ৫০ কপি একসাথে অর্ডার করলে ১৫-২০% খরচ সাশ্রয় করা সম্ভব।
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
              <span>কৌশল:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">বাল্ক ভেন্ডর রেট</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold text-xs mb-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>স্বচ্ছতা ও ভাউচার সংরক্ষণ</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                প্রতিটি ব্যয়ের মেমো নম্বর ও তারিখ সঠিকভাবে নথিভুক্ত রাখলে ব্যাচ অডিট সহজ ও শতভাগ জবাবদিহিমূলক থাকে।
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
              <span>পিডিএফ রিপোর্ট:</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">মাসিক ডাউনলোড</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
