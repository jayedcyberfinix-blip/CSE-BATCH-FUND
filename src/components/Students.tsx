import React, { useState } from 'react';
import { Student, Contribution, PaymentMethod, PaymentStatus } from '../types';
import { 
  MONTHS, 
  toBengaliDigits, 
  formatCurrency 
} from '../lib/constants';
import { 
  Search, 
  Plus, 
  CircleCheck, 
  Clock, 
  X, 
  ExternalLink, 
  Check, 
  UserCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentsProps {
  students: Student[];
  contributions: Contribution[];
  onSelectStudentForPayment: (student: Student) => void;
  onAddContribution: (contribution: Omit<Contribution, 'id' | 'createdAt'>) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

const QUICK_AMOUNTS = [30, 60, 90, 150, 300, 500];

export function Students({
  students,
  contributions,
  onSelectStudentForPayment,
  onAddContribution,
  onAddStudent
}: StudentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalStudent, setModalStudent] = useState<Student | null>(null);
  
  // Quick payment modal states
  const currentYear = new Date().getFullYear();
  const currentMonthKey = new Date().getMonth() + 1;
  const [monthKey, setMonthKey] = useState(currentMonthKey);
  const [year, setYear] = useState(currentYear);
  const [amountPaid, setAmountPaid] = useState('30');
  const [dueAmount, setDueAmount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('নিয়মিত মাসিক চাঁদা (৩০৳)');
  const [modalSuccess, setModalSuccess] = useState(false);

  // New student form
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');

  const enrichedStudents = students.map((s) => {
    const studentContributions = contributions.filter(
      (c) =>
        c.studentName.toLowerCase().trim() === s.name.toLowerCase().trim() ||
        c.roll === s.roll
    );
    const totalPaid = studentContributions.reduce(
      (acc, curr) => acc + (Number(curr.amountPaid) || 0),
      0
    );
    const totalDue = studentContributions.reduce(
      (acc, curr) => acc + (Number(curr.dueAmount) || 0),
      0
    );
    return {
      ...s,
      totalPaid,
      totalDue,
      entryCount: studentContributions.length
    };
  }).filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll.includes(searchTerm)
  );

  const openPaymentModal = (student: Student) => {
    setModalStudent(student);
    setAmountPaid('30');
    setDueAmount('0');
    setPaymentMethod('bkash');
    setPaymentStatus('paid');
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setNote('নিয়মিত মাসিক চাঁদা (৩০৳)');
    setModalSuccess(false);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalStudent) return;

    const paid = parseFloat(amountPaid) || 0;
    const due = parseFloat(dueAmount) || 0;

    const monthObj = MONTHS.find((m) => m.key === monthKey);
    const monthName = `${monthObj?.name || 'মাস'} ${year}`;

    let status = paymentStatus;
    if (paid > 0 && due === 0) status = 'paid';
    else if (paid > 0 && due > 0) status = 'partial';
    else if (paid === 0 && due > 0) status = 'due';

    onAddContribution({
      studentName: modalStudent.name.trim(),
      roll: modalStudent.roll.trim() || 'N/A',
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
        origin: { y: 0.6 }
      });
    } catch {}

    setModalSuccess(true);
    setTimeout(() => {
      setModalSuccess(false);
      setModalStudent(null);
    }, 1200);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    onAddStudent({
      name: newStudentName.trim().toUpperCase(),
      roll: newStudentRoll.trim() || 'N/A'
    });
    setNewStudentName('');
    setNewStudentRoll('');
    setShowAddStudent(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            ব্যাচ শিক্ষার্থী ডিরেক্টরি ও বকেয়া খতিয়ান (Student Roster)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            মোট সহপাঠী: {toBengaliDigits(students.length)} জন | যেকোনো সহপাঠীর নামের পাশের "চাঁদা নিন" বাটনে চাপ দিন
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম বা রোল দিয়ে খুঁজুন..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowAddStudent(!showAddStudent)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন ছাত্র</span>
          </button>
        </div>
      </div>

      {showAddStudent && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 animate-in fade-in">
          <form onSubmit={handleCreateStudent} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-semibold">
                শিক্ষার্থীর নাম *
              </label>
              <input
                type="text"
                required
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="যেমন: MD. RAHIM"
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-full sm:w-44">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-semibold">
                রোল নম্বর
              </label>
              <input
                type="text"
                value={newStudentRoll}
                onChange={(e) => setNewStudentRoll(e.target.value)}
                placeholder="2514053"
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                সংরক্ষণ
              </button>
              <button
                type="button"
                onClick={() => setShowAddStudent(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
              >
                বাতিল
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of students */}
      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto">
        {enrichedStudents.map((s) => (
          <div
            key={s.id}
            className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                  {s.name}
                </h4>
                <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  রোল: {s.roll}
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {toBengaliDigits(s.entryCount)} এন্ট্রি
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400">মোট জমা:</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(s.totalPaid)}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400">বকেয়া:</div>
                <div className={`text-xs font-bold ${s.totalDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                  {s.totalDue > 0 ? formatCurrency(s.totalDue) : '০৳'}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openPaymentModal(s)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  title={`${s.name}-এর জন্য কুইক চাঁদা এন্ট্রি করুন`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>চাঁদা নিন</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Modal Dialog for Student Payment */}
      {modalStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <h3 className="text-sm font-bold text-white">চাঁদা গ্রহণ: {modalStudent.name}</h3>
                </div>
                <div className="text-xs font-mono text-emerald-400 mt-0.5">রোল: {modalStudent.roll}</div>
              </div>
              <button
                onClick={() => setModalStudent(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CircleCheck className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-emerald-300">চাঁদা সফলভাবে গ্রহণ করা হয়েছে!</h4>
                <p className="text-xs text-slate-400">ফান্ড ব্যালেন্স ও শিক্ষার্থীর খতিয়ান আপডেট হয়েছে।</p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">মাস</label>
                    <select
                      value={monthKey}
                      onChange={(e) => setMonthKey(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
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
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {[2025, 2026, 2027].map((y) => (
                        <option key={y} value={y}>
                          {toBengaliDigits(y)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">জমার পরিমাণ (৳)</label>
                    <div className="flex gap-1">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmountPaid(amt.toString())}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] text-slate-300 transition-colors cursor-pointer"
                        >
                          ৳{toBengaliDigits(amt)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-emerald-400 outline-none focus:border-emerald-500"
                    placeholder="30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">বকেয়া (৳)</label>
                    <input
                      type="number"
                      min="0"
                      value={dueAmount}
                      onChange={(e) => setDueAmount(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">পেমেন্ট মাধ্যম</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="bkash">বিকাশ (bKash)</option>
                      <option value="nagad">নগদ (Nagad)</option>
                      <option value="rocket">রকেট (Rocket)</option>
                      <option value="cash">নগদ ক্যাশ (Cash)</option>
                      <option value="bank">ব্যাংক ট্রান্সফার</option>
                      <option value="other">অন্যান্য</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 mb-1 block uppercase font-semibold">মন্তব্য</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                    placeholder="যেমন: নিয়মিত মাসিক চাঁদা"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const student = modalStudent;
                      setModalStudent(null);
                      onSelectStudentForPayment(student);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>প্রধান ফর্মে খুলুন</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalStudent(null)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>জমা করুন</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
