import React, { useState } from 'react';
import { Expense } from '../types';
import { EXPENSE_CATEGORIES } from '../lib/constants';
import { CheckCircle2, CircleMinus } from 'lucide-react';

interface AddExpenseProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

export function AddExpense({ onAddExpense }: AddExpenseProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('photocopy');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiptNumber, setReceiptNumber] = useState('');
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim()) {
      alert('অনুগ্রহ করে খরচের খাত/বিবরণ লিখুন');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('অনুগ্রহ করে খরচের সঠিক টাকার পরিমাণ লিখুন');
      return;
    }

    onAddExpense({
      title: title.trim(),
      category,
      amount: parsedAmount,
      date: date || new Date().toISOString().slice(0, 10),
      receiptNumber: receiptNumber.trim(),
      note: note.trim(),
      isDemo: false
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    setTitle('');
    setAmount('');
    setReceiptNumber('');
    setNote('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
          নতুন খরচ এন্ট্রি (Record Batch Expense)
        </h3>
        <span className="text-[10px] text-rose-500 font-medium">স্বয়ংক্রিয় ব্যালেন্স কর্তন</span>
      </div>

      {showSuccess && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
          <span>খরচের হিসাব সফলভাবে ফান্ড থেকে সমন্বয় করা হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-semibold">
              খরচের বিবরণ / উদ্দেশ্য <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: ৩য় সেমিস্টার ল্যাব শিট ফটোকপি"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-semibold">
              খরচের ক্যাটাগরি <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 transition-colors cursor-pointer"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.en})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-semibold">
              খরচের পরিমাণ (৳) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="৬৫০"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-bold outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-semibold">তারিখ</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-semibold">ভাউচার / মেমো নম্বর</label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="MEMO-102"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-semibold">
            অতিরিক্ত নোট / কে খরচ করলো
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="যেমন: শপ নেম / পারভেজ ও জায়েদ কর্তৃক খরচ"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-lg text-xs mt-2 transition-all shadow-md shadow-rose-600/20 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-1.5"
        >
          <CircleMinus className="w-4 h-4" />
          <span>খরচের হিসাব যুক্ত করুন (Record Expense)</span>
        </button>
      </form>
    </div>
  );
}
