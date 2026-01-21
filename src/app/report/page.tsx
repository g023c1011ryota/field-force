"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Camera, Check, Calendar, MapPin, Home, CircleCheck, ClipboardList, FileText, Award, X } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [reportText, setReportText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isFormValid = reportText.trim().length > 0;

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearPhoto = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ 追加：タスク完了時の処理
  const handleComplete = () => {
    // 1. 今のデータを読み込む（無ければデフォルト3）
    const currentFeed = parseInt(localStorage.getItem('pet_feed') || '3');
    const maxFeed = 5;

    // 2. エサを1つ増やす（最大値を超えたらループさせたり、レベルアップの計算をここでするかはお好みで。今回は単純に+1）
    // ※もし「タスク完了＝即レベルアップ」にしたい場合はここで計算が必要ですが、
    // 　一旦「経験値がたまる」挙動にします。
    const newFeed = currentFeed + 1;

    // 3. 保存する
    localStorage.setItem('pet_feed', newFeed.toString());

    // 4. ペット画面へ移動
    router.push('/pet');
  };

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
            placeholder="訪問メモを入力してください（必須）"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          ></textarea>
          {!isFormValid && (
            <p className="text-red-500 text-xs mt-1 font-bold">※完了するには報告の入力が必要です</p>
          )}
        </div>

        {/* 写真追加エリア */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2 drop-shadow-sm">写真</label>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
            capture="environment"
          />
          
          {previewUrl ? (
            <div className="relative w-full h-48 border-2 border-black bg-gray-100">
              <img src={previewUrl} alt="プレビュー" className="w-full h-full object-cover" />
              <button 
                onClick={clearPhoto}
                className="absolute top-2 right-2 bg-black text-white p-1 rounded-full shadow-md hover:bg-gray-800 transition"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handlePhotoClick}
              className="w-24 h-24 bg-white border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-600 transition shadow-sm active:bg-gray-200"
            >
              <Camera size={24} className="mb-1" />
              <span className="text-[10px] font-bold">追加</span>
            </button>
          )}
        </div>
        
        {/* 完了ボタン */}
        <div className="pt-4">
          <button 
            onClick={handleComplete} // 👈 ここを変更しました！
            disabled={!isFormValid} 
            className={`block w-full text-center font-bold py-4 border-2 transition-all flex items-center justify-center gap-2 text-lg ${
              isFormValid 
              ? 'bg-black text-white border-black shadow-lg active:translate-y-[2px] active:shadow-none cursor-pointer' 
              : 'bg-gray-300 text-gray-500 border-gray-400 shadow-none cursor-not-allowed opacity-70'
            }`}
          >
            <span>タスクを完了する</span>
            <Check size={20} />
          </button>
        </div>
      </div>

      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 pb-8 pt-3 z-40">
        <div className="flex justify-around px-4">
          <Link href="/pet" className="flex flex-col items-center gap-1 text-gray-400"><Home size={24} /><span className="text-[9px] font-bold">ホーム</span></Link>
          <Link href="/checkin" className="flex flex-col items-center gap-1 text-gray-400"><CircleCheck size={24} /><span className="text-[9px] font-bold">打刻</span></Link>
          <div className="flex flex-col items-center gap-1 text-blue-600"><ClipboardList size={24} /><span className="text-[9px] font-bold">タスク</span></div>
          <div className="flex flex-col items-center gap-1 text-gray-400"><FileText size={24} /><span className="text-[9px] font-bold">日報</span></div>
          <div className="flex flex-col items-center gap-1 text-gray-400"><Award size={24} /><span className="text-[9px] font-bold">実績</span></div>
        </div>
      </nav>
    </main>
  );
}