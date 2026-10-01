import React, { useState } from 'react';
import { Contribution, Expense, BatchInfo } from '../types';
import { 
  Download, 
  FileText, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  FileSpreadsheet,
  Printer,
  X,
  Award,
  CircleAlert,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { 
  getRunningTwoMonths, 
  MONTHS, 
  EXPENSE_CATEGORIES, 
  toEnglishDigits,
  toBengaliDigits,
  formatCurrency,
  formatBengaliDate
} from '../lib/constants';
import { processImageFile, getDefaultEmblemDataUrl, renderFancyBadgeToDataUrl } from '../lib/imageUtils';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';

// Ensure jspdf-autotable plugin is properly linked
try {
  if (typeof applyPlugin === 'function') {
    applyPlugin(jsPDF);
  }
} catch {
  // Ignored if already attached
}

interface ExportProps {
  contributions: Contribution[];
  expenses: Expense[];
  batchInfo: BatchInfo;
  onUpdateBatchInfo?: (info: BatchInfo) => void;
  onOpenResetAllModal: () => void;
}

export function Export({
  contributions,
  expenses,
  batchInfo,
  onUpdateBatchInfo,
  onOpenResetAllModal
}: ExportProps) {
  const [onlyRunningTwoMonths, setOnlyRunningTwoMonths] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showPrintReportModal, setShowPrintReportModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const runningMonths = getRunningTwoMonths();

  const getFilteredData = () => {
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

    return {
      filteredContributions,
      filteredExpenses,
      totalCollected,
      totalDue,
      totalExpenses,
      remaining
    };
  };

  const handleExportExcel = () => {
    try {
      const {
        filteredContributions,
        filteredExpenses,
        totalCollected,
        totalDue,
        totalExpenses,
        remaining
      } = getFilteredData();

      const summaryData = [
        { 'বিষয় / বিবরণ': 'প্রতিষ্ঠান ও বিশ্ববিদ্যালয়', 'তথ্য / মান': 'Islamic University, Kushtia (ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া)' },
        { 'বিষয় / বিবরণ': 'ব্যাচ নাম', 'তথ্য / মান': batchInfo.batchName },
        { 'বিষয় / বিবরণ': 'সেশন ও বিভাগ', 'তথ্য / মান': `${batchInfo.department} (Session: ${batchInfo.session})` },
        { 'বিষয় / বিবরণ': 'মোট সংগৃহীত চাঁদা (Total Paid)', 'তথ্য / মান': `৳ ${totalCollected.toLocaleString()}` },
        { 'বিষয় / বিবরণ': 'মোট খরচ (Total Expenses)', 'তথ্য / মান': `৳ ${totalExpenses.toLocaleString()}` },
        { 'বিষয় / বিবরণ': 'বর্তমান অবশিষ্ট ব্যালেন্স (Remaining Balance)', 'তথ্য / মান': `৳ ${remaining.toLocaleString()}` },
        { 'বিষয় / বিবরণ': 'মোট বকেয়া (Total Due)', 'তথ্য / মান': `৳ ${totalDue.toLocaleString()}` },
        { 'বিষয় / বিবরণ': 'রিপোর্ট পরিসীমা', 'তথ্য / মান': onlyRunningTwoMonths ? 'রানিং ২ মাস' : 'সর্বমোট রেকর্ড' },
        { 'বিষয় / বিবরণ': 'সিস্টেম প্রস্তুতকারক ও ক্রেডিট', 'তথ্য / মান': 'CREATED BY JAYED • ISLAMIC UNIVERSITY, KUSHTIA' }
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

      setToast({ message: 'এক্সেল শিট সফলভাবে ডাউনলোড হয়েছে!', type: 'success' });
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      console.error('Excel Export Error:', err);
      setToast({ message: `এক্সেল ডাউনলোড ব্যর্থ হয়েছে: ${err.message || 'অপ্রত্যাশিত সমস্যা'}`, type: 'error' });
    }
  };

  const handleExportPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const {
        filteredContributions,
        filteredExpenses,
        totalCollected,
        totalDue,
        totalExpenses,
        remaining
      } = getFilteredData();

      // Safely instantiate jsPDF
      const DocConstructor = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF;
      if (!DocConstructor) {
        throw new Error('jsPDF লাইব্রেরি লোড হতে পারেনি');
      }

      const doc = new DocConstructor({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Clean ASCII helper to ensure PDF won't crash on unencoded Unicode glyphs in standard font
      const safeAscii = (text: string, fallback = '') => {
        if (!text) return fallback;
        return text;
      };

      // Header banner (Deep Navy with Emerald Accent Top Line)
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 39, 'F');
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 0, 210, 2.8, 'F');

      // -------------------------------------------------------------
      // TOP-LEFT LOGO & BANNER DETAILS
      // User request:
      // 1. "created by osman lekha ta sudhu nise thak be" (only at the bottom)
      // 2. "er pdf er upor logo ta bam pash e de" (logo on the top-left side)
      // -------------------------------------------------------------
      const logoData = batchInfo.customLogo || getDefaultEmblemDataUrl();
      let textStartX = 14;

      if (logoData) {
        try {
          // White rounded badge box for the logo on the TOP-LEFT (bam pash)
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(52, 211, 153);
          doc.setLineWidth(0.4);
          doc.roundedRect(14, 5.5, 26, 26, 2.5, 2.5, 'FD');

          // Place the user's photo inside the badge on the left
          doc.addImage(logoData, 'JPEG', 15.5, 7, 23, 23);

          textStartX = 44; // Text starts after the left logo
        } catch (imgErr) {
          console.warn('Could not embed custom photo in PDF:', imgErr);
        }
      }

      // Institutional & Batch Details to the right of the logo
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12.5);
      doc.setFont('helvetica', 'bold');
      doc.text('ISLAMIC UNIVERSITY, KUSHTIA', textStartX, 12.5);
      
      doc.setFontSize(9.5);
      doc.setTextColor(110, 231, 183);
      const safeBatchName = safeAscii(batchInfo.batchName, 'CSE BATCH 25-26');
      doc.text(`${safeBatchName} - DEPARTMENT OF CSE`, textStartX, 18.5);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      const sessionFormatted = toEnglishDigits(batchInfo.session || '2025-2026') || '2025-2026';
      doc.text(`Academic Session: ${sessionFormatted} | Official Fund Audit Statement`, textStartX, 24.5);
      
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}  |  Scope: ${onlyRunningTwoMonths ? 'Running 2 Months' : 'All Records'}`, textStartX, 30.5);

      // Summary Metric Cards
      const startY = 44;
      const cardW = 44;
      const cardH = 17;
      const gap = 5;

      // Card 1: Collections
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

      // Card 4: Outstanding Dues
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

      // Contributions Table Section
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

      // Call autoTable safely
      const runAutoTable = (typeof autoTable === 'function' ? autoTable : (autoTable as any)?.default) || (doc as any).autoTable;
      
      if (typeof runAutoTable === 'function') {
        runAutoTable(doc, {
          startY: tableY + 2.5,
          head: [['#', 'Student Name', 'Roll', 'Month', 'Paid', 'Due', 'Status', 'Date']],
          body: contributionTableData.length > 0 ? contributionTableData : [['-', 'No contribution records found', '-', '-', '-', '-', '-', '-']],
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
      }

      const lastAutoTable = (doc as any).lastAutoTable;
      tableY = (lastAutoTable?.finalY || (tableY + 40)) + 7;
      if (tableY > 230) {
        doc.addPage();
        tableY = 18;
      }

      // Expenses Table Section
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

      if (typeof runAutoTable === 'function') {
        runAutoTable(doc, {
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
      }

      // Page numbers & Footer with "ⒿⒶⓎⒺⒹ〆ⓄⓈⓂ️ⒶⓃ"
      const fancyFooterBadge = renderFancyBadgeToDataUrl('ⒿⒶⓎⒺⒹ〆ⓄⓈⓂ️ⒶⓃ');
      const pageCount = (doc as any).getNumberOfPages?.() || (doc as any).internal?.getNumberOfPages?.() || 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(14, 283, 196, 283);
        
        if (fancyFooterBadge) {
          doc.addImage(fancyFooterBadge, 'PNG', 14, 284.5, 48, 5.6);
        } else {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text('JAYED x OSMAN', 14, 288.5);
        }
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Islamic University, Kushtia - Department of CSE', 95, 288.5);
        doc.text(`Page ${i} of ${pageCount}`, 182, 288.5);
      }

      const filename = `IU_${batchInfo.batchName.replace(/\s+/g, '_')}_Fund_Report.pdf`;

      // Fail-proof PDF download using Blob Object URL with fallback to doc.save
      try {
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 2000);
      } catch {
        doc.save(filename);
      }

      setToast({ message: 'পিডিএফ অডিট রিপোর্ট সফলভাবে ডাউনলোড হয়েছে!', type: 'success' });
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      setToast({ 
        message: `পিডিএফ ডাউনলোড ত্রুটি: ${err.message || 'অপ্রত্যাশিত সমস্যা'}। ফুল প্রিন্ট ভিউ ওপেন করা হচ্ছে...`, 
        type: 'error' 
      });
      setShowPrintReportModal(true);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const {
    filteredContributions,
    filteredExpenses,
    totalCollected,
    totalDue,
    totalExpenses,
    remaining
  } = getFilteredData();

  return (
    <>
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-800 mb-6">
        
        {/* Top Header Information */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-1.5">
              <Sparkles className="w-3 h-3" />
              অফিসিয়াল অডিট ও ব্যাকআপ এক্সপোর্ট
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              অডিট রিপোর্ট ও স্টেটমেন্ট ডাউনলোড
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              সকল শিক্ষার্থী চাঁদা ও খরচের হিসাব এক্সেল (.xlsx) বা অফিশিয়াল সিলযুক্ত পিডিএফ (.pdf) ফাইলে ডাউনলোড বা প্রিন্ট করুন।
            </p>
          </div>

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
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPdf}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            title="ছবি ও সিল সহ সরাসরি .pdf ফাইল ডাউনলোড করুন"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'পিডিএফ তৈরি হচ্ছে...' : 'পিডিএফ ডাউনলোড (ছবি সহ)'}</span>
          </button>

          <button
            onClick={() => setShowPrintReportModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            title="বাংলা ফন্টসহ ফুল রিপোর্ট প্রিন্ট বা ব্রাউজার থেকে PDF হিসেবে সেভ করুন"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট / সেভ PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            title="Excel ফাইলে সম্পূর্ণ হিসাব ডাউনলোড করুন"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>এক্সেল ডাউনলোড</span>
          </button>

          <button
            onClick={onOpenResetAllModal}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 hover:border-rose-500 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ml-auto"
            title="সকল চাঁদা ও খরচের হিসাব সম্পূর্ণ মুছুন (৩-ধাপ অনুমতি লাগবে)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>সব হিসাব মুছুন</span>
          </button>
        </div>

        {toast && (
          <div className={`mt-3.5 p-3 rounded-xl text-xs flex items-center gap-2.5 ${
            toast.type === 'success' 
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
          }`}>
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <CircleAlert className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}
      </div>

      {/* Full Printable / Save-as-PDF Report Modal in Native Bengali */}
      {showPrintReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-slate-300 flex flex-col max-h-[90vh]">
            
            {/* Top Bar for Modal */}
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs sm:text-sm">
                  অফিসিয়াল অডিট রিপোর্ট প্রিন্ট ভিউ (PDF হিসেবে সেভ করুন)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>এখনই প্রিন্ট / PDF সেভ করুন</span>
                </button>

                <button
                  onClick={() => setShowPrintReportModal(false)}
                  className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Document */}
            <div className="p-6 sm:p-10 overflow-y-auto bg-white text-slate-900 space-y-6">
              
              {/* Header with Logo on the LEFT side */}
              <div className="border-b-2 border-emerald-900 pb-4 flex items-center gap-4">
                {/* Logo on the LEFT side */}
                <div className="w-16 h-16 rounded-xl border-2 border-emerald-600 p-1 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  <img 
                    src={batchInfo.customLogo || getDefaultEmblemDataUrl()} 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-left flex-1">
                  <h1 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight">
                    {batchInfo.institution || "ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া"}
                  </h1>
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mt-0.5">
                    ISLAMIC UNIVERSITY, KUSHTIA - BANGLADESH
                  </p>
                  <h2 className="text-sm font-extrabold text-slate-800 mt-1">
                    {batchInfo.department} • {batchInfo.batchName}
                  </h2>
                  <div className="text-xs text-slate-600 mt-0.5">
                    শিক্ষাবর্ষ: <strong>{batchInfo.session}</strong> | অফিসিয়াল ব্যাচ ফান্ড অডিট স্টেটমেন্ট
                  </div>
                  <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-300 text-[11px] font-semibold text-slate-700">
                    তারিখ: {formatBengaliDate(new Date().toISOString())} | পরিসীমা: {onlyRunningTwoMonths ? 'রানিং ২ মাস' : 'সর্বমোট রেকর্ড'}
                  </div>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">মোট সংগৃহীত ফান্ড</div>
                  <div className="text-lg font-black text-emerald-700">{formatCurrency(totalCollected)}</div>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="text-[11px] font-bold text-rose-800 uppercase">মোট ব্যয় / খরচ</div>
                  <div className="text-lg font-black text-rose-700">{formatCurrency(totalExpenses)}</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-[11px] font-bold text-blue-800 uppercase">অবশিষ্ট ব্যালেন্স</div>
                  <div className="text-lg font-black text-blue-700">{formatCurrency(remaining)}</div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-[11px] font-bold text-amber-800 uppercase">মোট বকেয়া</div>
                  <div className="text-lg font-black text-amber-700">{formatCurrency(totalDue)}</div>
                </div>
              </div>

              {/* Contributions Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  ১. শিক্ষার্থী চাঁদা ও আদায় তালিকা ({toBengaliDigits(filteredContributions.length)} টি এন্ট্রি)
                </h3>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700">
                    <tr>
                      <th className="p-2 border border-slate-200 text-center">#</th>
                      <th className="p-2 border border-slate-200">শিক্ষার্থীর নাম</th>
                      <th className="p-2 border border-slate-200">রোল</th>
                      <th className="p-2 border border-slate-200">মাস</th>
                      <th className="p-2 border border-slate-200 text-right">জমা (৳)</th>
                      <th className="p-2 border border-slate-200 text-right">বকেয়া (৳)</th>
                      <th className="p-2 border border-slate-200 text-center">স্ট্যাটাস</th>
                      <th className="p-2 border border-slate-200">তারিখ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContributions.map((c, i) => (
                      <tr key={c.id} className="border-b border-slate-200">
                        <td className="p-1.5 border border-slate-200 text-center text-slate-500 font-mono">
                          {toBengaliDigits(i + 1)}
                        </td>
                        <td className="p-1.5 border border-slate-200 font-bold">{c.studentName}</td>
                        <td className="p-1.5 border border-slate-200 font-mono text-[11px]">{c.roll}</td>
                        <td className="p-1.5 border border-slate-200">{c.month}</td>
                        <td className="p-1.5 border border-slate-200 text-right font-bold text-emerald-700">
                          {formatCurrency(c.amountPaid)}
                        </td>
                        <td className="p-1.5 border border-slate-200 text-right text-orange-600">
                          {c.dueAmount > 0 ? formatCurrency(c.dueAmount) : '০৳'}
                        </td>
                        <td className="p-1.5 border border-slate-200 text-center text-[10px]">
                          {c.paymentStatus === 'paid' ? 'পরিশোধিত' : c.paymentStatus === 'partial' ? 'আংশিক' : 'বকেয়া'}
                        </td>
                        <td className="p-1.5 border border-slate-200 text-[11px]">{formatBengaliDate(c.paymentDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expenses Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  ২. ব্যাচ খরচ ও ব্যয় বিবরণী ({toBengaliDigits(filteredExpenses.length)} টি এন্ট্রি)
                </h3>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700">
                    <tr>
                      <th className="p-2 border border-slate-200 text-center">#</th>
                      <th className="p-2 border border-slate-200">খরচের উদ্দেশ্য ও বিবরণ</th>
                      <th className="p-2 border border-slate-200">ক্যাটাগরি</th>
                      <th className="p-2 border border-slate-200">মেমো নং</th>
                      <th className="p-2 border border-slate-200 text-right">পরিমাণ (৳)</th>
                      <th className="p-2 border border-slate-200">তারিখ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((e, i) => {
                        const cat = EXPENSE_CATEGORIES.find((item) => item.id === e.category);
                        return (
                          <tr key={e.id} className="border-b border-slate-200">
                            <td className="p-1.5 border border-slate-200 text-center text-slate-500 font-mono">
                              {toBengaliDigits(i + 1)}
                            </td>
                            <td className="p-1.5 border border-slate-200 font-semibold">{e.title}</td>
                            <td className="p-1.5 border border-slate-200 text-[11px]">{cat?.name || e.category}</td>
                            <td className="p-1.5 border border-slate-200 font-mono text-[11px]">{e.receiptNumber || 'N/A'}</td>
                            <td className="p-1.5 border border-slate-200 text-right font-bold text-rose-700">
                              {formatCurrency(e.amount)}
                            </td>
                            <td className="p-1.5 border border-slate-200 text-[11px]">{formatBengaliDate(e.date)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400">
                          কোনো খরচের রেকর্ড নেই
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Signatures & Accreditation */}
              <div className="pt-8 flex items-end justify-between text-xs border-t border-slate-300">
                <div className="space-y-1">
                  <div className="font-bold text-slate-800">অডিট কমিটি ও কোষাধক্ষ্য</div>
                  <div className="text-[11px] text-slate-500">{batchInfo.batchName} • সিএসই ডিপার্টমেন্ট</div>
                  <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 mt-1">
                    <Award className="w-3.5 h-3.5" /> ইসলামিক ইউনিভার্সিটি কুষ্টিয়া ভেরিফাইড
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="border-t border-slate-400 pt-1 w-44 font-bold text-slate-800 text-center">
                    স্বাক্ষর ও সিল
                  </div>
                </div>
              </div>

              {/* Credit Footer */}
              <div className="text-center text-xs font-bold text-slate-700 pt-4 border-t border-dashed border-slate-200 tracking-wider">
                ⒿⒶⓎⒺⒹ〆ⓄⓈⓂ️ⒶⓃ • ISLAMIC UNIVERSITY, KUSHTIA
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
