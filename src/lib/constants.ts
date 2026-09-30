import { Student, Expense, Contribution, BatchInfo, MonthInfo, ExpenseCategory } from '../types';

export const MONTHS: MonthInfo[] = [
  { key: 1, name: 'জানুয়ারি', en: 'January' },
  { key: 2, name: 'ফেব্রুয়ারি', en: 'February' },
  { key: 3, name: 'মার্চ', en: 'March' },
  { key: 4, name: 'এপ্রিল', en: 'April' },
  { key: 5, name: 'মে', en: 'May' },
  { key: 6, name: 'জুন', en: 'June' },
  { key: 7, name: 'জুলাই', en: 'July' },
  { key: 8, name: 'আগস্ট', en: 'August' },
  { key: 9, name: 'সেপ্টেম্বর', en: 'September' },
  { key: 10, name: 'অক্টোবর', en: 'October' },
  { key: 11, name: 'নভেম্বর', en: 'November' },
  { key: 12, name: 'ডিসেম্বর', en: 'December' }
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'picnic', name: 'পিকনিক ও ট্যুর', en: 'Picnic & Tour', icon: 'TreePine', color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300' },
  { id: 'party', name: 'গেট-টুগেদার ও পার্টি', en: 'Get-Together & Party', icon: 'PartyPopper', color: 'text-purple-700 bg-purple-100 dark:bg-purple-950/50 dark:text-purple-300' },
  { id: 'photocopy', name: 'ফটোকপি, প্রিন্ট ও শিট', en: 'Photocopy & Printing', icon: 'Printer', color: 'text-blue-700 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300' },
  { id: 'project', name: 'প্রজেক্ট ও সেমিনার ফি', en: 'Project & Seminar Fee', icon: 'FolderGit2', color: 'text-amber-700 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300' },
  { id: 'lab_event', name: 'ল্যাব ও ডিপার্টমেন্টাল ইভেন্ট', en: 'Lab & Department Event', icon: 'Cpu', color: 'text-indigo-700 bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300' },
  { id: 'gift_farewell', name: 'উপহার ও বিদায়ী সংবর্ধনা', en: 'Gift & Farewell Reception', icon: 'Gift', color: 'text-rose-700 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300' },
  { id: 'emergency', name: 'জরুরি শিক্ষার্থী সহায়তা', en: 'Emergency Student Aid', icon: 'HeartHandshake', color: 'text-red-700 bg-red-100 dark:bg-red-950/50 dark:text-red-300' },
  { id: 'other', name: 'বিবিধ খরচ', en: 'Miscellaneous Expense', icon: 'MoreHorizontal', color: 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300' }
];

export const INITIAL_BATCH_INFO: BatchInfo = {
  batchName: 'CSE BATCH 25-26',
  department: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)',
  institution: 'ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া (Islamic University, Kushtia)',
  session: '2025-2026',
  contactNumber: '+৮৮০১XXXXXXXXX'
};

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-001', name: 'MD. AHSANUL HAQUE PARVEZ', roll: '2514001' },
  { id: 'std-002', name: 'JAYED', roll: '2514002' },
  { id: 'std-003', name: 'MD. NUR UDDIN', roll: '2514003' },
  { id: 'std-004', name: 'NAZMUS SAKIB', roll: '2514004' },
  { id: 'std-005', name: 'DIBYAJIT DAS TUSHAR', roll: '2514005' },
  { id: 'std-006', name: 'MD. REZWANUL ISLAM', roll: '2514006' },
  { id: 'std-007', name: 'MD. NAIM HASAN LIKHUN', roll: '2514007' },
  { id: 'std-008', name: 'MD. SAZZAD HOSEN', roll: '2514008' },
  { id: 'std-009', name: 'M NAJMUS SAKIB', roll: '2514009' },
  { id: 'std-010', name: 'OSMAN GONI', roll: '2514010' },
  { id: 'std-011', name: 'MD. AMINOUR ISLAM SAYAD', roll: '2514011' },
  { id: 'std-012', name: 'SHOPNIL KUMAR', roll: '2514012' },
  { id: 'std-013', name: 'ANIRBAN PAUL', roll: '2514013' },
  { id: 'std-014', name: 'ARUIT BISWAS', roll: '2514014' },
  { id: 'std-015', name: 'KAZI ZINEDIN ZIDAN', roll: '2514015' },
  { id: 'std-016', name: 'NIBEL HASAN RAKIB', roll: '2514016' },
  { id: 'std-017', name: 'MD. RIYAD HOWLADER', roll: '2514017' },
  { id: 'std-018', name: 'TANVIR MEHEDI', roll: '2514018' },
  { id: 'std-019', name: 'RASEL BISWASH', roll: '2514019' },
  { id: 'std-020', name: 'TARIF AHAMMAD MAHMUDUL HASAN', roll: '2514020' },
  { id: 'std-021', name: 'MD. ZESHAN MAHMUD', roll: '2514021' },
  { id: 'std-022', name: 'RAFID AL FAHIM', roll: '2514022' },
  { id: 'std-023', name: 'MD. BAYZED ISLAM', roll: '2514023' },
  { id: 'std-024', name: 'MD. SOWROV', roll: '2514024' },
  { id: 'std-025', name: 'SAIM AHAMMED SHUVO', roll: '2514025' },
  { id: 'std-026', name: 'AL MOYAJ KHONDOKAR', roll: '2514026' },
  { id: 'std-027', name: 'MD. FUAD AHAMED ETHON', roll: '2514027' },
  { id: 'std-028', name: 'MOYAZZEM HUSSEN', roll: '2514028' },
  { id: 'std-029', name: 'AVEYJEET DUTTA', roll: '2514029' },
  { id: 'std-030', name: 'MD. TASNIM FUYAD', roll: '2514030' },
  { id: 'std-031', name: 'MO. TOWHIDUL ISLAM TANVIR', roll: '2514031' },
  { id: 'std-032', name: 'MD. WACIUL ALAM OHI', roll: '2514032' },
  { id: 'std-033', name: 'MD. SOJIBUR RAHMAN', roll: '2514033' },
  { id: 'std-034', name: 'KHONDAKER AL MAHAMUD ANIK', roll: '2514034' },
  { id: 'std-035', name: 'HUJAIFA', roll: '2514035' },
  { id: 'std-036', name: 'NAFISA NOSHIN ALI DIPTY', roll: '2514036' },
  { id: 'std-037', name: 'MST. TASNIYA FERDOUSI', roll: '2514037' },
  { id: 'std-038', name: 'PRIUNTY SARKER', roll: '2514038' },
  { id: 'std-039', name: 'TAHMINA AKTER', roll: '2514039' },
  { id: 'std-040', name: 'MEHERUNNESA NUPUR', roll: '2514040' },
  { id: 'std-041', name: 'PRIYONTI CHAKMA', roll: '2514041' },
  { id: 'std-042', name: 'SHEFA RAHMAN', roll: '2514042' },
  { id: 'std-043', name: 'KANIZ FATEMA', roll: '2514043' },
  { id: 'std-044', name: 'SHANTONA KHATUN', roll: '2514044' },
  { id: 'std-045', name: 'NUSRAT JAHAN KARIMA', roll: '2514045' },
  { id: 'std-046', name: 'JOSIMA AKTHER', roll: '2514046' },
  { id: 'std-047', name: 'MOST TASNUVA TABASSUM', roll: '2514047' },
  { id: 'std-048', name: 'NAZIFA TASNIM', roll: '2514048' },
  { id: 'std-049', name: 'MST ROJONI KHATUN', roll: '2514049' },
  { id: 'std-050', name: 'TAHERI ZIM', roll: '2514050' },
  { id: 'std-051', name: 'ISRAT FAIRUJ DIPTY', roll: '2514051' },
  { id: 'std-052', name: 'NAFISA LUBABA', roll: '2514052' }
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'demo-cnt-01',
    studentName: 'JAYED',
    roll: '2514002',
    month: 'আগস্ট ২০২৬',
    monthKey: 8,
    year: 2026,
    amountPaid: 30,
    dueAmount: 0,
    paymentDate: '2026-08-05',
    paymentStatus: 'paid',
    paymentMethod: 'bkash',
    note: 'আগস্ট মাসের নিয়মিত মাসিক চাঁদা (৩০৳)',
    isDemo: true,
    createdAt: '2026-08-05T10:00:00.000Z'
  },
  {
    id: 'demo-cnt-02',
    studentName: 'MD. AHSANUL HAQUE PARVEZ',
    roll: '2514001',
    month: 'আগস্ট ২০২৬',
    monthKey: 8,
    year: 2026,
    amountPaid: 30,
    dueAmount: 0,
    paymentDate: '2026-08-06',
    paymentStatus: 'paid',
    paymentMethod: 'nagad',
    note: 'মাসিক চাঁদা পরিশোধ (৩০৳)',
    isDemo: true,
    createdAt: '2026-08-06T11:15:00.000Z'
  },
  {
    id: 'demo-cnt-03',
    studentName: 'NAZMUS SAKIB',
    roll: '2514004',
    month: 'আগস্ট ২০২৬',
    monthKey: 8,
    year: 2026,
    amountPaid: 20,
    dueAmount: 10,
    paymentDate: '2026-08-08',
    paymentStatus: 'partial',
    paymentMethod: 'cash',
    note: 'আংশিক জমা (বাকি ১০৳ পরের সপ্তাহে দেবে)',
    isDemo: true,
    createdAt: '2026-08-08T14:30:00.000Z'
  },
  {
    id: 'demo-cnt-04',
    studentName: 'DIBYAJIT DAS TUSHAR',
    roll: '2514005',
    month: 'জুলাই ২০২৬',
    monthKey: 7,
    year: 2026,
    amountPaid: 30,
    dueAmount: 0,
    paymentDate: '2026-07-15',
    paymentStatus: 'paid',
    paymentMethod: 'bkash',
    note: 'জুলাই মাসের চাঁদা পরিশোধ (৩০৳)',
    isDemo: true,
    createdAt: '2026-07-15T09:20:00.000Z'
  },
  {
    id: 'demo-cnt-05',
    studentName: 'MD. NUR UDDIN',
    roll: '2514003',
    month: 'জুলাই ২০২৬',
    monthKey: 7,
    year: 2026,
    amountPaid: 30,
    dueAmount: 0,
    paymentDate: '2026-07-12',
    paymentStatus: 'paid',
    paymentMethod: 'rocket',
    note: 'জুলাই ক্লিয়ার (৩০৳)',
    isDemo: true,
    createdAt: '2026-07-12T16:00:00.000Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'demo-exp-01',
    title: 'সেমিস্টার ফাইনাল ল্যাব ম্যানুয়াল ও ফটোকপি শিট বিতরণ',
    category: 'photocopy',
    amount: 650,
    date: '2026-08-10',
    receiptNumber: 'VOUCHER-0810',
    note: 'সব শিক্ষার্থীর জন্য ফটোকপি ও স্পাইরাল বাইন্ডিং খরচ',
    isDemo: true,
    createdAt: '2026-08-10T12:00:00.000Z'
  },
  {
    id: 'demo-exp-02',
    title: 'ব্যাচ ডে ও ফ্রেশার্স ওয়েলকাম চা-বিস্কুট স্ন্যাক্স',
    category: 'party',
    amount: 800,
    date: '2026-08-02',
    receiptNumber: 'VOUCHER-0802',
    note: 'ক্লাসরুম মিটিং স্ন্যাক্স ও চা',
    isDemo: true,
    createdAt: '2026-08-02T16:30:00.000Z'
  },
  {
    id: 'demo-exp-03',
    title: 'ডিপার্টমেন্টাল প্রোগ্রাম ফেস্ট ব্যানার ও স্টিকার',
    category: 'lab_event',
    amount: 450,
    date: '2026-07-28',
    receiptNumber: 'VOUCHER-0728',
    note: 'ব্যানার প্রিন্টিং',
    isDemo: true,
    createdAt: '2026-07-28T10:00:00.000Z'
  }
];

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

const ENGLISH_DIGITS: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

export const toEnglishDigits = (str: string | number): string => {
  if (str == null) return '';
  return String(str).replace(/[০-৯]/g, (d) => ENGLISH_DIGITS[d] || d);
};

export const toBengaliDigits = (num: number | string): string => {
  if (num == null || isNaN(Number(num))) return '০';
  return Number(num).toLocaleString('en-US').replace(/[0-9]/g, (d) => BENGALI_DIGITS[d] || d);
};

export const formatCurrency = (amount: number, useBengali = true): string => {
  const num = amount || 0;
  if (!useBengali) return `৳ ${num.toLocaleString('en-US')}`;
  return `৳ ${toBengaliDigits(num)}`;
};

export const formatBengaliDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = toBengaliDigits(d.getDate());
    const monthIndex = d.getMonth();
    const monthName = MONTHS[monthIndex]?.name || '';
    const year = toBengaliDigits(d.getFullYear());
    return `${day} ${monthName}, ${year}`;
  } catch {
    return dateStr;
  }
};

export const getRunningTwoMonths = (date = new Date()) => {
  const currentMonthIdx = date.getMonth();
  const currentYear = date.getFullYear();
  const currMonthKey = currentMonthIdx + 1;
  
  let prevMonthKey = currMonthKey - 1;
  let prevYear = currentYear;
  if (prevMonthKey === 0) {
    prevMonthKey = 12;
    prevYear = currentYear - 1;
  }
  
  const currMonthName = MONTHS[currMonthKey - 1].name;
  const prevMonthName = MONTHS[prevMonthKey - 1].name;

  return {
    currentMonth: { key: currMonthKey, name: `${currMonthName} ${currentYear}`, year: currentYear },
    previousMonth: { key: prevMonthKey, name: `${prevMonthName} ${prevYear}`, year: prevYear },
    label: `${prevMonthName} ও ${currMonthName} (${toBengaliDigits(currentYear)})`
  };
};

export const calculateSummary = (contributions: Contribution[], expenses: Expense[]) => {
  const totalCollected = contributions.reduce((acc, c) => acc + (Number(c.amountPaid) || 0), 0);
  const totalDue = contributions.reduce((acc, c) => acc + (Number(c.dueAmount) || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const remainingBalance = totalCollected - totalExpenses;
  const paidCount = contributions.filter(c => c.paymentStatus === 'paid').length;
  const partialCount = contributions.filter(c => c.paymentStatus === 'partial').length;
  const dueCount = contributions.filter(c => c.paymentStatus === 'due').length;
  const hasDemoData = contributions.some(c => c.isDemo) || expenses.some(e => e.isDemo);

  return {
    totalCollected,
    totalExpenses,
    remainingBalance,
    totalDue,
    totalContributors: contributions.length,
    paidCount,
    partialCount,
    dueCount,
    hasDemoData
  };
};
