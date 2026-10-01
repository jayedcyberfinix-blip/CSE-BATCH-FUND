import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { QuickEntry } from './components/QuickEntry';
import { AddExpense } from './components/AddExpense';
import { Contributions } from './components/Contributions';
import { Expenses } from './components/Expenses';
import { Students } from './components/Students';
import { Export } from './components/Export';
import { ResetModal } from './components/ResetModal';
import { ReceiptModal } from './components/Receipt';
import { EditModal } from './components/EditModal';
import { 
  INITIAL_BATCH_INFO, 
  INITIAL_STUDENTS, 
  INITIAL_CONTRIBUTIONS, 
  INITIAL_EXPENSES,
  calculateSummary 
} from './lib/constants';
import { BatchInfo, Student, Contribution, Expense } from './types';
import { getDefaultEmblemDataUrl } from './lib/imageUtils';
import { 
  Layers, 
  LayoutDashboard, 
  CirclePlus, 
  Receipt, 
  Users, 
  FileSpreadsheet, 
  CheckCircle,
  X
} from 'lucide-react';

const STORAGE_KEYS = {
  BATCH_INFO: 'cse_batch_fund_info_v3',
  STUDENTS: 'cse_batch_fund_students_v3',
  CONTRIBUTIONS: 'cse_batch_fund_contributions_v3',
  EXPENSES: 'cse_batch_fund_expenses_v3'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('all');

  const [batchInfo, setBatchInfo] = useState<BatchInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BATCH_INFO);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.customLogo) {
          parsed.customLogo = getDefaultEmblemDataUrl();
        }
        return parsed;
      } catch {
        // fallback
      }
    }
    return {
      ...INITIAL_BATCH_INFO,
      customLogo: getDefaultEmblemDataUrl()
    };
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [contributions, setContributions] = useState<Contribution[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONTRIBUTIONS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [prefillStudent, setPrefillStudent] = useState<Student | null>(null);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [receiptContribution, setReceiptContribution] = useState<Contribution | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const quickEntryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BATCH_INFO, JSON.stringify(batchInfo));
  }, [batchInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(contributions));
  }, [contributions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddContribution = (entry: Omit<Contribution, 'id' | 'createdAt'>) => {
    const newEntry: Contribution = {
      ...entry,
      id: `cnt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };

    setContributions((prev) => [newEntry, ...prev]);

    // If student doesn't exist, automatically add them to roster
    if (
      entry.studentName &&
      !students.some(
        (s) =>
          s.name.toLowerCase() === entry.studentName.toLowerCase() ||
          s.roll === entry.roll
      )
    ) {
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        name: entry.studentName,
        roll: entry.roll || 'N/A'
      };
      setStudents((prev) => [...prev, newStudent]);
    }
  };

  const handleAddExpense = (exp: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleDeleteContribution = (id: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== id));
    showToast('রেকর্ডটি মুছে ফেলা হয়েছে');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('খরচের রেকর্ড মুছে ফেলা হয়েছে');
  };

  const handleUpdateContribution = (updated: Contribution) => {
    setContributions((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast('চাঁদার তথ্য সফলভাবে আপডেট হয়েছে!');
  };

  const handleAddStudent = (s: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...s,
      id: `std-${Date.now()}`
    };
    setStudents((prev) => [...prev, newStudent]);
    showToast(`সহপাঠী "${s.name}" সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleRemoveDemoData = () => {
    const cleanedContributions = contributions.filter(c => !c.isDemo && !c.id.startsWith('demo-'));
    const cleanedExpenses = expenses.filter(e => !e.isDemo && !e.id.startsWith('demo-'));
    setContributions(cleanedContributions);
    setExpenses(cleanedExpenses);
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(cleanedContributions));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(cleanedExpenses));
    showToast('সবগুলো ডেমো রেকর্ড সফলভাবে মুছে ফেলা হয়েছে! এখন আপনি নতুন হিসাব যোগ করতে পারেন।');
  };

  const handleResetAllData = () => {
    setContributions([]);
    setExpenses([]);
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
    showToast('সবগুলো চাঁদা ও খরচের হিসাব সফলভাবে সম্পূর্ণ মুছে শূন্য (০) করা হয়েছে!');
  };

  const handleSelectStudentForPayment = (student: Student) => {
    setPrefillStudent(student);
    setActiveTab('contributions');
    showToast(`✓ সহপাঠী ${student.name} (রোল: ${student.roll})-এর চাঁদা গ্রহণের জন্য ফরম প্রস্তুত!`);
    setTimeout(() => {
      quickEntryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleQuickNewEntryClick = () => {
    setPrefillStudent(null);
    setActiveTab('contributions');
    setTimeout(() => {
      quickEntryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const tabs = [
    { id: 'all', label: 'সব মডিউল (All-in-One)', icon: Layers },
    { id: 'overview', label: 'ড্যাশবোর্ড ও চার্ট', icon: LayoutDashboard },
    { id: 'contributions', label: 'চাঁদা আদায় ও খতিয়ান', icon: CirclePlus },
    { id: 'expenses', label: 'খরচের হিসাব', icon: Receipt },
    { id: 'students', label: 'শিক্ষার্থী ডিরেক্টরি', icon: Users },
    { id: 'export', label: 'অডিট ও এক্সপোর্ট', icon: FileSpreadsheet },
  ];

  const summary = calculateSummary(contributions, expenses);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        
        {/* Top Header Banner */}
        <Header 
          batchInfo={batchInfo} 
          onUpdateBatchInfo={setBatchInfo}
          totalStudents={students.length}
          onQuickNewEntry={handleQuickNewEntryClick}
        />

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 no-scrollbar border-b border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content based on tab */}
        <main className="space-y-6">
          {/* Dashboard Module */}
          {(activeTab === 'all' || activeTab === 'overview') && (
            <div className="animate-in fade-in duration-300">
              <Dashboard 
                contributions={contributions} 
                expenses={expenses}
                onRemoveDemoData={handleRemoveDemoData}
                onOpenResetAllModal={() => setIsResetModalOpen(true)}
              />
            </div>
          )}

          {/* Contributions Module */}
          {(activeTab === 'all' || activeTab === 'contributions') && (
            <div ref={quickEntryRef} className="space-y-6 animate-in fade-in duration-300">
              <QuickEntry 
                students={students}
                onAddContribution={handleAddContribution}
                prefillStudent={prefillStudent}
                onClearPrefill={() => setPrefillStudent(null)}
              />
              <Contributions 
                contributions={contributions}
                onDeleteContribution={handleDeleteContribution}
                onEditContribution={(c) => setEditingContribution(c)}
                onOpenReceipt={(c) => setReceiptContribution(c)}
              />
            </div>
          )}

          {/* Expenses Module */}
          {(activeTab === 'all' || activeTab === 'expenses') && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <AddExpense onAddExpense={handleAddExpense} />
              <Expenses 
                expenses={expenses} 
                onDeleteExpense={handleDeleteExpense} 
              />
            </div>
          )}

          {/* Students Directory Module */}
          {(activeTab === 'all' || activeTab === 'students') && (
            <div className="animate-in fade-in duration-300">
              <Students 
                students={students} 
                contributions={contributions}
                onSelectStudentForPayment={handleSelectStudentForPayment}
                onAddContribution={handleAddContribution}
                onAddStudent={handleAddStudent}
              />
            </div>
          )}

          {/* Export & Audit Module */}
          {(activeTab === 'all' || activeTab === 'export') && (
            <div className="animate-in fade-in duration-300">
              <Export 
                contributions={contributions} 
                expenses={expenses} 
                batchInfo={batchInfo}
                onUpdateBatchInfo={setBatchInfo}
                onOpenResetAllModal={() => setIsResetModalOpen(true)}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-8 pb-12 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {batchInfo.institution} • {batchInfo.batchName} ফান্ড পোর্টাল
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>লোকাল স্টোরেজে স্বয়ংক্রিয়ভাবে সংরক্ষিত ও অফলাইন সমর্থিত</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right space-y-1">
              <div className="text-sm font-black text-emerald-800 dark:text-emerald-400 tracking-wider flex items-center justify-center md:justify-end gap-1.5">
                <span>CREATED BY JAYED</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {batchInfo.department} • {batchInfo.institution}
              </div>
            </div>
          </div>
        </footer>

      </div>

      {/* Modals */}
      {receiptContribution && (
        <ReceiptModal
          contribution={receiptContribution}
          batchInfo={batchInfo}
          onClose={() => setReceiptContribution(null)}
        />
      )}

      {editingContribution && (
        <EditModal 
          contribution={editingContribution}
          onClose={() => setEditingContribution(null)}
          onSave={handleUpdateContribution}
        />
      )}

      <ResetModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetAllData}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-300 hover:text-white text-xs font-bold ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
