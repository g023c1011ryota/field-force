"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Camera, Check, Calendar, MapPin, Home, CircleCheck, ClipboardList, FileText, Award } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  // 入力内容を管理する状態
  const [reportText, setReportText] = useState("");

  // 文字が入っているかチェック（1文字以上あればボタンを有効にする）
  const isFormValid = reportText.trim().length > 0;

  return (
    <main 
      className="relative mx-auto h-screen w-full max-w-md overflow-hidden font-sans shadow-2xl border-x border-gray-200 flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <header className="px-4 pt-14 pb-4 flex items-center gap-4 z-10 shrink-0">
        <Link href="/checkin" className="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm transition">
          <ChevronLeft size={28} className="text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800 drop-shadow-sm">タスク詳細</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-24">
        {/* 顧客情報カード */}
        <div className="bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-800">製品デモ</h2>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 font-bold border border-blue-200">商談</span>
          </div>
          <p className="text-sm text-gray-600 font-bold mb-4">株式会社Acme</p>
          <div className="flex flex-col gap-2 text-xs text-gray-500 font-medium border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2"><Calendar size={14} /><span>1月20日 14:00</span></div>
            <div className="flex items-center gap-2"><MapPin size={14} /><span>東京都渋谷区1-2-3</span></div>
          </div>
        </div>

        {/* 指示内容 */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">指示内容</label>
          <div className="bg-white p-4 border-2 border-black text-sm text-gray-700 shadow-sm">
            Q4の新製品ラインナップをプレゼンしてください。特にAI機能について重点的に説明し、価格モデルについてのフィードバックをいただいてください。
          </div>
        </div>

        {/* 完了報告（必須項目） */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            完了報告 <span className="text-red-500">*</span>
          </label>
          <textarea 
            className="w-full h-40 p-4 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm placeholder-gray-400 shadow-sm resize-none"
            placeholder="訪問メモを入力..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          ></textarea>
        </div>

        {/* 写真追加 */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">写真</label>
          <button className="w-24 h-24 bg-white border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500">
            <Camera size={24} className="mb-1" />
            <span className="text-[10px] font-bold">追加</span>
          </button>
        </div>
        
        {/* 完了ボタン：入力がない間は disabled（無効）になる */}
        <div className="pt-4">
          <button 
            onClick={() => router.push('/pet')}
            disabled={!isFormValid}
            className={`block w-full text-center font-bold py-4 border-2 border-black shadow-lg transition-all flex items-center justify-center gap-2 text-lg ${
              isFormValid 
              ? 'bg-black text-white active:translate-y-[2px] active:shadow-none' 
              : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>タスクを完了する</span>
            <Check size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}