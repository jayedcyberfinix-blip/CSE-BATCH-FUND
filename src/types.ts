export interface Student {
  id: string;
  name: string;
  roll: string;
  phone?: string;
  bloodGroup?: string;
}

export type PaymentStatus = 'paid' | 'partial' | 'due';
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cash' | 'bank' | 'other';

export interface Contribution {
  id: string;
  studentName: string;
  roll: string;
  month: string;
  monthKey: number;
  year: number;
  amountPaid: number;
  dueAmount: number;
  paymentDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  note?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  receiptNumber?: string;
  note?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface BatchInfo {
  batchName: string;
  department: string;
  institution: string;
  session: string;
  contactNumber?: string;
  customLogo?: string;
}

export interface MonthInfo {
  key: number;
  name: string;
  en: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  en: string;
  icon: string;
  color: string;
}
