import React, { useState, useEffect } from 'react';
import { Student, Contribution, PaymentMethod, PaymentStatus } from '../types';
import { MONTHS, toBengaliDigits } from '../lib/constants';
import { PlusCircle, CheckCircle2, Sparkles, X, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickEntryProps {
  students: Student[];
  onAddContribution: (contribution: Omit<Contribution, 'id' | 'createdAt'>) => void;
  prefillStudent: Student | null;
  onClearPrefill: () => void;
}

const QUICK_AMOUNTS = [30, 60, 90, 150, 300, 500];

export function QuickEntry({
  students,
  onAddContribution,
  prefillStudent,
  onClearPrefill
}: QuickEntryProps) {
  const currentYear = new Date().getFullYear();
  const currentMonthKey = new Date().getMonth() + 1;

  const [studentName, setStudentName] = useState('JAYED');
  const [roll, setRoll] = useState('2514002');
  const [monthKey, setMonthKey] = useState(currentMonthKey);
  const [year, setYear] = useState(currentYear);
  const [amountPaid, setAmountPaid] = useState('30');
  const [dueAmount, setDueAmount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('নিয়মিত মাসিক চাঁদা (৩০৳)');
  
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (prefillStudent) {
      setStudentName(prefillStudent.name);
      setRoll(prefillStudent.roll);
      setSelectedStudent(prefillStudent);
      setShowSuggestions(false);
      setAmountPaid('30');
      setNote('নিয়মিত মাসিক চাঁদা (৩০৳)');
    }
  }, [prefillStudent]);

  const handleNameChange = (val: string) => {
    setStudentName(val);
    if (val.trim().length > 0) {
      const filtered = students.filter(
        s => s.name.toLowerCase().includes(val.toLowerCase()) || s.roll.includes(val)
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectStudent = (s: Student) => {
    setStudentName(s.name);
    setRoll(s.roll);
    setSelectedStudent(s);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paid = parseFloat(amountPaid) || 0;
    const due = parseFloat(dueAmount) || 0;

    if (!studentName.trim()) {
      alert('অনুগ্রহ করে শিক্ষার্থীর নাম লিখুন');
      return;
    }

    const monthObj = MONTHS.find(m => m.key === monthKey);
    const monthName = `${monthObj?.name || 'মাস'} ${year}`;

    let status = paymentStatus;
    if (paid > 0 && due === 0) status = 'paid';
    else if (paid > 0 && due > 0) status = 'partial';
    else if (paid === 0 && due > 0) status = 'due';

    onAddContribution({
      studentName: studentName.trim(),
      roll: roll.trim() || 'N/A',
      month: monthName,
      monthKey,
      year,
      amountPaid: paid,
      dueAmount: due,
      paymentDate: paymentDate || new Date().toISOString().slice(0, 10),
      paymentStatus: status,
      paymentMethod,
      note: note.trim(),
      isDemo: false
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    setAmountPaid('');
    setDueAmount('0');
    setNote('');
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold flex items-center gap-2 text-white">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          কুইক পেমেন্ট এন্ট্রি (সরাসরি ফান্ডে যোগ)
        </h3>
        <span className="text-[10px] text-blue-400 font-mono font-medium">CSE-25 FUND ENGINE</span>
      </div>

      {showSuccess && (
        <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>চাঁদা সফলভাবে ফান্ডে যুক্ত হয়েছে এবং ব্যালেন্স স্বয়ংক্রিয়ভাবে আপডেট হয়েছে!</span>
        </div>
      )}

      {selectedStudent && (
        <div className="mb-4 p-3 bg-blue-950/80 border border-blue-600/50 text-blue-200 rounded-lg text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              সহপাঠী <strong>{selectedStudent.name}</strong> (রোল: <strong>{selectedStudent.roll}</strong>)-এর চাঁদা এন্ট্রি ফরম লোড করা হয়েছে।
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedStudent(null);
              onClearPrefill();
            }}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">
              শিক্ষার্থীর নাম <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => studentName && handleNameChange(studentName)}
              placeholder="যেমন: JAYED"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-800 rounded-lg shadow-xl border border-slate-700 max-h-48 overflow-y-auto">
                <div className="p-1.5 text-[10px] font-semibold text-slate-400 border-b border-slate-700">
                  সহপাঠী তালিকা থেকে নির্বাচন করুন:
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectStudent(s)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 flex items-center justify-between transition-colors cursor-pointer border-b border-slate-700/50 last:border-0"
                  >
                    <span className="font-semibold text-white">{s.name}</span>
                    <span className="px-1.5 py-0.5 bg-slate-900 text-blue-400 rounded text-[10px] font-mono">
                      {s.roll}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">রোল নম্বর</label>
            <input
              type="text"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              placeholder="2514002"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">
              মাস <span className="text-blue-400">*</span>
            </label>
            <select
              value={monthKey}
              onChange={(e) => setMonthKey(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {MONTHS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">বছর</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {[2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>
                  {toBengaliDigits(y)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">
              জমা পরিমাণ (৳) <span className="text-blue-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="৩০"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">বকেয়া (৳)</label>
            <input
              type="number"
              step="any"
              min="0"
              value={dueAmount}
              onChange={(e) => setDueAmount(e.target.value)}
              placeholder="০"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
          <span className="text-[10px] text-slate-400">কুইক সিলেক্ট:</span>
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmountPaid(amt.toString())}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 text-[10px] font-bold rounded transition-colors cursor-pointer"
            >
              ৳{toBengaliDigits(amt)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">পরিশোধ মাধ্যম</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="bkash">বিকাশ (bKash)</option>
              <option value="nagad">নগদ (Nagad)</option>
              <option value="rocket">রকেট (Rocket)</option>
              <option value="cash">ক্যাশ (Cash)</option>
              <option value="bank">ব্যাংক (Bank)</option>
              <option value="other">অন্যান্য (Other)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">স্ট্যাটাস</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="paid">পরিশোধিত</option>
              <option value="partial">আংশিক জমা</option>
              <option value="due">বকেয়া</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">তারিখ</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">মন্তব্য / ট্রানজেকশন আইডি</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="যেমন: নিয়মিত চাঁদা / বিকাশ TrxID"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs mt-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>এন্ট্রি নিশ্চিত করুন (Add to Fund)</span>
        </button>
      </form>
    </div>
  );
}
