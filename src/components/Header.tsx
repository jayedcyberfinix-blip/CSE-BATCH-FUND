import React, { useState, useRef } from 'react';
import { BatchInfo } from '../types';
import { 
  Pencil, 
  Camera, 
  Check, 
  X, 
  GraduationCap, 
  ShieldCheck, 
  RotateCcw, 
  UserCheck, 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { toBengaliDigits, MONTHS } from '../lib/constants';
import { processImageFile } from '../lib/imageUtils';

interface HeaderProps {
  batchInfo: BatchInfo;
  onUpdateBatchInfo: (info: BatchInfo) => void;
  totalStudents: number;
  onQuickNewEntry?: () => void;
}

export function Logo({
  customLogo,
  editable = false,
  onLogoChange,
  onResetLogo,
  size = 'md'
}: {
  customLogo?: string;
  editable?: boolean;
  onLogoChange?: (logo: string) => void;
  onResetLogo?: () => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onLogoChange) {
      try {
        const compressedBase64 = await processImageFile(file);
        onLogoChange(compressedBase64);
        setImgError(false);
      } catch (err) {
        console.error('Failed to process image:', err);
      }
    }
  };

  return (
    <div className="relative group">
      <div 
        onClick={() => editable && fileInputRef.current?.click()}
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-white p-1 shadow-md border-2 border-emerald-500/40 flex items-center justify-center shrink-0 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all' : ''}`}
        title={editable ? "ছবি পরিবর্তন বা আপলোড করতে ক্লিক করুন (PDF এ এটি যুক্ত হবে)" : "ইসলামী বিশ্ববিদ্যালয় লোগো"}
      >
        {customLogo && !imgError ? (
          <img 
            src={customLogo} 
            alt="Batch Logo" 
            onError={() => setImgError(true)} 
            className="w-full h-full object-contain drop-shadow-sm rounded-full" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-emerald-800 to-teal-700 text-white rounded-full flex flex-col items-center justify-center p-1 border border-emerald-400/40">
            <BookOpen className="w-1/2 h-1/2 text-emerald-200" />
            <span className="text-[7px] font-black tracking-tighter leading-none text-emerald-100">IU</span>
          </div>
        )}

        {editable && (
          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity rounded-full">
            <Camera className="w-4 h-4 text-emerald-300" />
            <span className="text-[8px] font-bold text-center leading-none mt-0.5">ছবি দিন</span>
          </div>
        )}
      </div>

      {editable && (
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
}

export function Header({ batchInfo, onUpdateBatchInfo, totalStudents, onQuickNewEntry }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [batchName, setBatchName] = useState(batchInfo.batchName);
  const [department, setDepartment] = useState(batchInfo.department);
  const [institution, setInstitution] = useState(batchInfo.institution || 'ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া');
  const [session, setSession] = useState(batchInfo.session || '2025-2026');

  const now = new Date();
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const monthName = MONTHS[now.getMonth()]?.name || '';
  const formattedDate = `${days[now.getDay()]}, ${toBengaliDigits(now.getDate())} ${monthName} ${toBengaliDigits(now.getFullYear())}`;

  const handleSave = () => {
    if (batchName.trim()) {
      onUpdateBatchInfo({
        ...batchInfo,
        batchName: batchName.trim(),
        department: department.trim() || batchInfo.department,
        institution: institution.trim() || batchInfo.institution,
        session: session.trim() || batchInfo.session
      });
    }
    setIsEditing(false);
  };

  const handleLogoChange = (logoData: string) => {
    onUpdateBatchInfo({ ...batchInfo, customLogo: logoData });
  };

  const handleResetLogo = () => {
    const updated = { ...batchInfo };
    delete updated.customLogo;
    onUpdateBatchInfo(updated);
  };

  return (
    <header className="mb-6">
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="p-1 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15 shadow-inner">
                <Logo 
                  size="lg"
                  customLogo={batchInfo.customLogo}
                  editable={true}
                  onLogoChange={handleLogoChange}
                  onResetLogo={handleResetLogo}
                />
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                    input?.click();
                  }}
                  className="text-emerald-300 hover:text-emerald-200 underline font-medium cursor-pointer transition-colors"
                >
                  {batchInfo.customLogo ? "ছবি বদলান" : "ছবি যোগ করুন"}
                </button>
                {batchInfo.customLogo && (
                  <>
                    <span className="text-slate-500">•</span>
                    <button
                      onClick={handleResetLogo}
                      className="text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="লোগো রিসেট করুন"
                    >
                      রিসেট
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {batchInfo.institution || "ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া"}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  অফিসিয়াল ব্যাচ ফান্ড পোর্টাল
                </span>
              </div>

              {isEditing ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-1 flex-wrap">
                  <input 
                    type="text"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="bg-slate-800 text-white text-base sm:text-lg font-bold px-3 py-1.5 rounded-lg border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="ব্যাচের নাম"
                  />
                  <input 
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-slate-800 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700"
                    placeholder="ডিপার্টমেন্ট"
                  />
                  <input 
                    type="text"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="bg-slate-800 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 w-28"
                    placeholder="সেশন"
                  />
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={handleSave}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> সংরক্ষণ
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 pt-0.5">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    {batchInfo.batchName}
                  </h1>
                  <button 
                    onClick={() => {
                      setBatchName(batchInfo.batchName);
                      setDepartment(batchInfo.department);
                      setInstitution(batchInfo.institution);
                      setSession(batchInfo.session);
                      setIsEditing(true);
                    }}
                    title="নাম বা তথ্য পরিবর্তন করুন"
                    className="p-1.5 rounded-lg text-emerald-400/80 hover:text-emerald-300 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2.5 text-xs text-emerald-200/80 flex-wrap">
                <span className="font-medium text-slate-200">{batchInfo.department}</span>
                <span>•</span>
                <span className="text-emerald-300 font-semibold">সেশন: {batchInfo.session}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  মোট শিক্ষার্থী: <strong className="text-white font-mono">{toBengaliDigits(totalStudents)} জন</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
            <div className="bg-slate-800/90 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-emerald-700/50 flex items-center gap-2 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center border border-emerald-400/30">
                J
              </div>
              <div className="text-[10px] leading-tight text-left">
                <span className="text-slate-400 block font-medium">সিস্টেম প্রস্তুতকারক</span>
                <span className="text-emerald-300 font-extrabold tracking-wider">CREATED BY JAYED</span>
              </div>
            </div>

            {onQuickNewEntry && (
              <button 
                onClick={onQuickNewEntry}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>চাঁদা এন্ট্রি +</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>সিস্টেম সচল • ইসলামী বিশ্ববিদ্যালয় ক্যাম্পাস, কুষ্টিয়া ৭০০৩</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-300">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
