"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Camera, Check, Calendar, MapPin, Home, CircleCheck, ClipboardList, FileText, Award } from 'lucide-react';

export default function ReportPage() {
  return (
    <main 
      className="relative mx-auto h-screen w-full max-w-md overflow-hidden font-sans shadow-2xl border-x border-gray-200 flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      
      {/* ヘッダー（修正箇所） */}
      {/* ■ 修正ポイント：背景色と枠線のクラスを削除し、透明にしました */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-4 z-10 shrink-0">
        <Link href="/checkin" className="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm transition">
          <ChevronLeft size={28} className="text-gray-800" />
        </Link>
        {/* 文字が見やすいように、少しだけ白い影をつけました */}
        <h1 className="text-lg font-bold text-gray-800 drop-shadow-sm">タスク詳細</h1>
      </header>

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-24">
        
        {/* 顧客情報カード */}
        <div className="bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-800">製品デモ</h2>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 font-bold border border-blue-200">商談</span>
          </div>
          <p className="text-sm text-gray-600 font-bold mb-4">株式会社Acme</p>
          
          <div className="flex flex-col gap-2 text-xs text-gray-500 font-medium border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>1月20日 14:00</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>東京都渋谷区1-2-3</span>
            </div>
          </div>
        </div>

        {/* 指示内容 */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2 drop-shadow-sm">指示内容</label>
          <div className="bg-white p-4 border-2 border-black text-sm text-gray-700 leading-relaxed shadow-sm">
            Q4の新製品ラインナップをプレゼンしてください。特にAI機能について重点的に説明し、価格モデルについてのフィードバックをいただいてください。
          </div>
        </div>

        {/* 完了報告 */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2 drop-shadow-sm">
            完了報告 <span className="text-red-500">*</span>
          </label>
          <textarea 
            className="w-full h-40 p-4 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm placeholder-gray-400 shadow-sm resize-none"
            placeholder="訪問メモを入力..."
          ></textarea>
        </div>

        {/* 写真追加 */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2 drop-shadow-sm">写真</label>
          <button className="w-24 h-24 bg-white border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-600 transition shadow-sm">
            <Camera size={24} className="mb-1" />
            <span className="text-[10px] font-bold">追加</span>
          </button>
        </div>
        
        {/* 完了ボタンエリア */}
        <div className="pt-4">
          <Link href="/pet" className="block w-full bg-black text-white text-center font-bold py-4 border-2 border-black shadow-lg active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 text-lg">
            <span>タスクを完了する</span>
            <Check size={20} />
          </Link>
        </div>
      </div>

      {/* ナビゲーションバー */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 pb-8 pt-3 z-40">
        <div className="flex justify-around px-4">
          <Link href="/pet" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition">
            <Home size={24} />
            <span className="text-[9px] font-bold">ホーム</span>
          </Link>
          <Link href="/checkin" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition">
            <CircleCheck size={24} />
            <span className="text-[9px] font-bold">打刻</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-blue-600">
            <ClipboardList size={24} />
            <span className="text-[9px] font-bold">タスク</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <FileText size={24} />
            <span className="text-[9px] font-bold">日報</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Award size={24} />
            <span className="text-[9px] font-bold">実績</span>
          </div>
        </div>
      </div>

    </main>
  );
}