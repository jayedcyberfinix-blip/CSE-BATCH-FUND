import React, { useState } from 'react';
import { Contribution, Expense, BatchInfo } from '../types';
import { 
  Download, 
  FileText, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import { 
  getRunningTwoMonths, 
  MONTHS, 
  EXPENSE_CATEGORIES, 
  calculateSummary,
  toEnglishDigits,
  formatCurrency
} from '../lib/constants';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportProps {
  contributions: Contribution[];
  expenses: Expense[];
  batchInfo: BatchInfo;
  onOpenResetAllModal: () => void;
}

export function Export({
  contributions,
  expenses,
  batchInfo,
  onOpenResetAllModal
}: ExportProps) {
  const [onlyRunningTwoMonths, setOnlyRunningTwoMonths] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const runningMonths = getRunningTwoMonths();

  const handleExportExcel = () => {
    let filteredContributions = [...contributions];
    let filteredExpenses = [...expenses];

    if (onlyRunningTwoMonths) {
      filteredContributions = filteredContributions.filter(
        (c) =>
          (c.monthKey === runningMonths.currentMonth.key && c.year === runningMonths.currentMonth.year) ||
          (c.monthKey === runningMonths.previousMonth.key && c.year === runningMonths.previousMonth.year)
      );
      filteredExpenses = filteredExpenses.filter((e) => {
        const d = new Date(e.date);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        return (
          (m === runningMonths.currentMonth.key && y === runningMonths.currentMonth.year) ||
          (m === runningMonths.previousMonth.key && y === runningMonths.previousMonth.year)
        );
      });
    }

    const totalCollected = filteredContributions.reduce((acc, c) => acc + (Number(c.amountPaid) || 0), 0);
    const totalDue = filteredContributions.reduce((acc, c) => acc + (Number(c.dueAmount) || 0), 0);
    const totalExpenses = filteredExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const remaining = totalCollected - totalExpenses;

    const summaryData = [
      { 'বিষয় / বিবরণ': 'প্রতিষ্ঠান ও বিশ্ববিদ্যালয়', 'তথ্য / মান': 'Islamic University, Kushtia (ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া)' },
      { 'বিষয় / বিবরণ': 'ব্যাচ নাম', 'তথ্য / মান': batchInfo.batchName },
      { 'বিষয় / বিবরণ': 'সেশন ও বিভাগ', 'তথ্য / মান': `${batchInfo.department} (Session: ${batchInfo.session})` },
      { 'বিষয় / বিবরণ': 'মোট সংগৃহীত চাঁদা (Total Paid)', 'তথ্য / মান': `৳ ${totalCollected.toLocaleString()}` },
      { 'বিষয় / বিবরণ': 'মোট খরচ (Total Expenses)', 'তথ্য / মান': `৳ ${totalExpenses.toLocaleString()}` },
      { 'বিষয় / বিবরণ': 'বর্তমান অবশিষ্ট ব্যালেন্স (Remaining Balance)', 'তথ্য / মান': `৳ ${remaining.toLocaleString()}` },
      { 'বিষয় / বিবরণ': 'মোট বকেয়া (Total Due)', 'তথ্য / মান': `৳ ${totalDue.toLocaleString()}` },
      { 'বিষয় / বিবরণ': 'রিপোর্ট পরিসীমা', 'তথ্য / মান': onlyRunningTwoMonths ? 'রানিং ২ মাস' : 'সর্বমোট রেকর্ড' },
      { 'বিষয় / বিবরণ': 'সিস্টেম ক্রেডিট', 'তথ্য / মান': 'CREATED BY JAYED, PARVEZ • ISLAMIC UNIVERSITY, KUSHTIA' }
    ];

    const contributionRows = filteredContributions.map((c, i) => {
      const m = MONTHS.find((item) => item.key === c.monthKey);
      const monthStr = m ? `${m.en} ${c.year || 2026} (${m.name})` : c.month;
      return {
        'ক্রমিক (SL)': i + 1,
        'শিক্ষার্থীর নাম (Student Name)': c.studentName,
        'রোল নম্বর (Roll)': c.roll,
        'মাস (Month)': monthStr,
        'জমা টাকা (Paid Amount ৳)': c.amountPaid,
        'বকেয়া টাকা (Due Amount ৳)': c.dueAmount,
        'পরিশোধের মাধ্যম (Method)': c.paymentMethod.toUpperCase(),
        'স্ট্যাটাস (Status)': c.paymentStatus === 'paid' ? 'Paid (পরিশোধিত)' : c.paymentStatus === 'partial' ? 'Partial (আংশিক)' : 'Due (বকেয়া)',
        'তারিখ (Date)': c.paymentDate,
        'মন্তব্য (Note)': c.note || ''
      };
    });

    const expenseRows = filteredExpenses.map((e, i) => {
      const cat = EXPENSE_CATEGORIES.find((item) => item.id === e.category);
      return {
        'ক্রমিক (SL)': i + 1,
        'খরচের বিবরণ (Expense Title)': e.title,
        'ক্যাটাগরি (Category)': cat ? `${cat.name} (${cat.en})` : e.category,
        'পরিমাণ (Amount ৳)': e.amount,
        'তারিখ (Date)': e.date,
        'ভাউচার নম্বর (Voucher No)': e.receiptNumber || 'N/A',
        'মন্তব্য (Note)': e.note || ''
      };
    });

    const wb = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    const wsContributions = XLSX.utils.json_to_sheet(contributionRows);
    const wsExpenses = XLSX.utils.json_to_sheet(expenseRows);

    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary (সারসংক্ষেপ)');
    XLSX.utils.book_append_sheet(wb, wsContributions, 'Contributions (চাঁদা)');
    XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses (খরচ)');

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `IU_${batchInfo.batchName.replace(/\s+/g, '_')}_Fund_Report_${dateStr}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setToast('এক্সেল শিট সফলভাবে ডাউনলোড হয়েছে!');
    setTimeout(() => setToast(null), 3500);
  };

  const handleExportPDF = () => {
    let filteredContributions = [...contributions];
    let filteredExpenses = [...expenses];

    if (onlyRunningTwoMonths) {
      filteredContributions = filteredContributions.filter(
        (c) =>
          (c.monthKey === runningMonths.currentMonth.key && c.year === runningMonths.currentMonth.year) ||
          (c.monthKey === runningMonths.previousMonth.key && c.year === runningMonths.previousMonth.year)
      );
      filteredExpenses = filteredExpenses.filter((e) => {
        const d = new Date(e.date);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        return (
          (m === runningMonths.currentMonth.key && y === runningMonths.currentMonth.year) ||
          (m === runningMonths.previousMonth.key && y === runningMonths.previousMonth.year)
        );
      });
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const totalCollected = filteredContributions.reduce((acc, c) => acc + (Number(c.amountPaid) || 0), 0);
    const totalDue = filteredContributions.reduce((acc, c) => acc + (Number(c.dueAmount) || 0), 0);
    const totalExpenses = filteredExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const remaining = totalCollected - totalExpenses;

    // Header banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 36, 'F');
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 2.5, 'F');

    // Title info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('ISLAMIC UNIVERSITY, KUSHTIA', 14, 13);
    
    doc.setFontSize(9.5);
    doc.setTextColor(110, 231, 183);
    doc.text(`${batchInfo.batchName} • DEPARTMENT OF CSE`, 14, 19.5);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    const sessionFormatted = toEnglishDigits(batchInfo.session || '2025-2026') || '2025-2026';
    doc.text(`Academic Session: ${sessionFormatted} | Official Fund Statement`, 14, 25.5);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}  •  Scope: ${onlyRunningTwoMonths ? 'Running 2 Months' : 'All Records'}`, 14, 30.5);

    // Summary cards
    const startY = 41;
    const cardW = 44;
    const cardH = 17;
    const gap = 5;

    // Card 1: Collected
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(14, startY, cardW, cardH, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('TOTAL COLLECTIONS', 17, startY + 5.5);
    doc.setFontSize(10.5);
    doc.setTextColor(5, 150, 105);
    doc.text(`BDT ${totalCollected.toLocaleString()}`, 17, startY + 12.5);

    // Card 2: Expenses
    const x2 = 14 + cardW + gap;
    doc.setFillColor(255, 241, 242);
    doc.setDrawColor(254, 205, 211);
    doc.roundedRect(x2, startY, cardW, cardH, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(159, 18, 57);
    doc.text('TOTAL EXPENSES', x2 + 3, startY + 5.5);
    doc.setFontSize(10.5);
    doc.setTextColor(225, 29, 72);
    doc.text(`BDT ${totalExpenses.toLocaleString()}`, x2 + 3, startY + 12.5);

    // Card 3: Net Balance
    const x3 = x2 + cardW + gap;
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(x3, startY, cardW, cardH, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('NET CASH BALANCE', x3 + 3, startY + 5.5);
    doc.setFontSize(10.5);
    doc.setTextColor(37, 99, 235);
    doc.text(`BDT ${remaining.toLocaleString()}`, x3 + 3, startY + 12.5);

    // Card 4: Dues
    const x4 = x3 + cardW + gap;
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(253, 230, 138);
    doc.roundedRect(x4, startY, cardW, cardH, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14);
    doc.text('OUTSTANDING DUES', x4 + 3, startY + 5.5);
    doc.setFontSize(10.5);
    doc.setTextColor(217, 119, 6);
    doc.text(`BDT ${totalDue.toLocaleString()}`, x4 + 3, startY + 12.5);

    // Contributions Table
    let tableY = startY + cardH + 7;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('STUDENT CONTRIBUTION & FEE COLLECTIONS', 14, tableY);

    const contributionTableData = filteredContributions.map((c, idx) => {
      const m = MONTHS.find((item) => item.key === c.monthKey);
      const mStr = m ? `${m.en} ${c.year || 2026}` : `${c.monthKey || 1}/${c.year || 2026}`;
      return [
        idx + 1,
        c.studentName,
        c.roll,
        mStr,
        `BDT ${c.amountPaid}`,
        c.dueAmount > 0 ? `BDT ${c.dueAmount}` : '0',
        c.paymentStatus.toUpperCase(),
        c.paymentDate
      ];
    });

    (doc as any).autoTable({
      startY: tableY + 2.5,
      head: [['#', 'Student Name', 'Roll', 'Month', 'Paid', 'Due', 'Status', 'Date']],
      body: contributionTableData,
      theme: 'striped',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: 2
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: {
        fontSize: 7.5,
        cellPadding: 1.8,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 48, fontStyle: 'bold' },
        2: { cellWidth: 20 },
        3: { cellWidth: 28 },
        4: { cellWidth: 20, halign: 'right', fontStyle: 'bold', textColor: [5, 150, 105] },
        5: { cellWidth: 18, halign: 'right', textColor: [217, 119, 6] },
        6: { cellWidth: 18, halign: 'center' },
        7: { cellWidth: 22, halign: 'center' }
      }
    });

    tableY = (doc as any).lastAutoTable.finalY + 7;
    if (tableY > 230) {
      doc.addPage();
      tableY = 18;
    }

    // Expenses Table
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('BATCH EXPENSES & DISBURSEMENTS', 14, tableY);

    const expenseTableData = filteredExpenses.map((exp, idx) => {
      const cat = EXPENSE_CATEGORIES.find((c) => c.id === exp.category);
      const catName = cat?.en || exp.category.toUpperCase();
      const safeTitle = !/[^\x00-\x7F]/.test(exp.title) ? exp.title : `${cat?.en || 'Batch Expense'} (${exp.receiptNumber || 'Voucher'})`;
      return [
        idx + 1,
        safeTitle,
        catName,
        exp.receiptNumber || 'N/A',
        `BDT ${exp.amount}`,
        exp.date
      ];
    });

    (doc as any).autoTable({
      startY: tableY + 2.5,
      head: [['#', 'Expense Purpose / Title', 'Category', 'Voucher #', 'Amount', 'Date']],
      body: expenseTableData.length > 0 ? expenseTableData : [['-', 'No expense records found', '-', '-', '-', '-']],
      theme: 'striped',
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: 2
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: {
        fontSize: 7.5,
        cellPadding: 1.8,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 70, fontStyle: 'bold' },
        2: { cellWidth: 28 },
        3: { cellWidth: 26 },
        4: { cellWidth: 22, halign: 'right', fontStyle: 'bold', textColor: [225, 29, 72] },
        5: { cellWidth: 28, halign: 'center' }
      }
    });

    // Page numbers & Footer
    const pageCount = (doc as any).getNumberOfPages?.() || (doc as any).internal?.getNumberOfPages?.() || 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(14, 283, 196, 283);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('CREATED BY JAYED, PARVEZ', 14, 288.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Islamic University, Kushtia • Department of CSE', 95, 288.5);
      doc.text(`Page ${i} of ${pageCount}`, 182, 288.5);
    }

    doc.save(`IU_${batchInfo.batchName.replace(/\s+/g, '_')}_Fund_Report.pdf`);

    setToast('পিডিএফ অডিট রিপোর্ট সফলভাবে তৈরি হয়েছে!');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-800 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-1.5">
            <Sparkles className="w-3 h-3" />
            অফিসিয়াল অডিট ও ব্যাকআপ এক্সপোর্ট
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            অডিট রিপোর্ট ও স্টেটমেন্ট ডাউনলোড
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            সকল শিক্ষার্থী চাঁদা ও খরচের হিসাব এক্সেল (.xlsx) বা অফিশিয়াল সিলযুক্ত পিডিএফ (.pdf) ফাইলে ডাউনলোড করুন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full lg:w-auto">
          <label className="flex items-center gap-2 text-xs font-medium bg-slate-800/90 px-3 py-2 rounded-lg border border-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyRunningTwoMonths}
              onChange={(e) => setOnlyRunningTwoMonths(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-slate-300 text-xs">
              শুধু রানিং ২ মাসের হিসাব ({runningMonths.currentMonth.name} ও পূর্ববর্তী মাস)
            </span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportExcel}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>এক্সেল ডাউনলোড</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>পিডিএফ ডাউনলোড</span>
            </button>
            <button
              onClick={onOpenResetAllModal}
              className="flex-1 sm:flex-initial px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 hover:border-rose-500 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              title="সকল চাঁদা ও খরচের হিসাব সম্পূর্ণ মুছুন (৩-ধাপ অনুমতি লাগবে)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>সব হিসাব মুছুন</span>
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="mt-3 p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {toast} — রিপোর্টে ফুটার ক্রেডিট <strong>CREATED BY JAYED, PARVEZ</strong> যুক্ত রয়েছে।
          </span>
        </div>
      )}
    </div>
  );
}
