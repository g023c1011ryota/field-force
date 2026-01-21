"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, CircleCheck, ClipboardList, FileText, Award, MapPin, Zap } from 'lucide-react';

export default function CheckInPage() {
  const router = useRouter();
  
  const [status, setStatus] = useState<'OUT_RANGE' | 'IN_RANGE' | 'VISITING' | 'DONE'>('OUT_RANGE');
  const [distance, setDistance] = useState(150);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // ---------------------------------------------------------
  // ★ タイマー継続ロジック
  // ---------------------------------------------------------
  useEffect(() => {
    // 1. ページを開いた時、保存されている開始時間があるか確認
    const startTime = localStorage.getItem('visit_start_time');
    if (startTime) {
      setStatus('VISITING');
    }

    let interval: NodeJS.Timeout;

    if (status === 'VISITING') {
      interval = setInterval(() => {
        const start = localStorage.getItem('visit_start_time');
        if (start) {
          // 現在時刻 - 開始時刻 = 経過秒数 を計算
          const diff = Math.floor((Date.now() - parseInt(start)) / 1000);
          setElapsedSeconds(diff);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  const handleStart = () => {
    // 訪問開始時に「今の時間」をスマホに保存
    localStorage.setItem('visit_start_time', Date.now().toString());
    setStatus('VISITING');
  };

  const handleEnd = () => {
    // 終了時にメモを消す
    localStorage.removeItem('visit_start_time');
    setStatus('DONE');
    router.push('/report');
  };
  // ---------------------------------------------------------

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const toggleDistance = () => {
    if (distance > 50) {
      setDistance(30);
      if (status === 'OUT_RANGE') setStatus('IN_RANGE');
    } else {
      setDistance(150);
      if (status === 'IN_RANGE') setStatus('OUT_RANGE');
    }
  };

  return (
    <main 
      className="relative mx-auto h-screen w-full max-w-md overflow-hidden font-sans shadow-2xl border-x border-gray-200 flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <header className="px-4 pt-14 pb-4 z-30 shrink-0">
        <div className="flex justify-between items-center bg-white w-full px-4 py-3 rounded-md shadow-sm">
          <div className="flex items-center gap-2">
             <Link href="/pet" className="p-1 rounded-full hover:bg-gray-100">
              <MapPin size={24} className="text-gray-800" />
             </Link>
            <h1 className="text-lg font-bold text-gray-800">訪問打刻</h1>
          </div>
          {status !== 'VISITING' && (
            <button onClick={toggleDistance} className="p-2 bg-yellow-100 text-yellow-600 rounded-full animate-pulse hover:bg-yellow-200 transition">
              <Zap size={16} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 relative flex flex-col w-full h-full overflow-hidden">
        {status === 'VISITING' ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white bg-blue-900/20 backdrop-blur-[2px]">
            <div className="flex flex-col items-center w-full px-6">
              <h2 className="text-2xl font-bold tracking-widest mb-2 text-green-600 drop-shadow-md">
                訪問中
              </h2>
              <div className="text-5xl font-mono font-bold tracking-widest drop-shadow-lg text-gray-800">
                {formatTime(elapsedSeconds)}
              </div>
              <div className="w-full mt-12">
                 <button 
                  onClick={handleEnd}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-md shadow-lg border-2 border-red-800 transition-transform active:scale-95 text-lg"
                >
                  訪問終了
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden h-full">
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] shrink-0">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-gray-500 font-bold">訪問先</span>
                <button className="text-blue-600 text-xs font-bold hover:underline">変更</button>
              </div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight mb-1">株式会社ABC</h2>
              <div className="text-xs text-gray-500">東京都渋谷区1-2-3</div>
            </div>

            <div className="flex-1 relative border-2 border-black bg-gray-200 overflow-hidden min-h-0">
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <MapPin size={48} className="mb-2 opacity-50" />
                <span className="text-sm font-bold opacity-50">Google Map Area</span>
              </div>
              <div className={`absolute bottom-4 left-4 right-4 py-3 px-4 border-2 border-black text-center font-bold text-sm transition-colors duration-300 ${
                  status === 'IN_RANGE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {status === 'IN_RANGE' ? (
                  <><div>距離: {distance}m</div><div className="text-xs opacity-80">打刻可能です</div></>
                ) : (
                  <><div>距離: {distance}m</div><div className="text-xs opacity-80">もっと近づいてください（100m以内）</div></>
                )}
              </div>
            </div>

            <div className="pb-24 shrink-0">
              {status === 'IN_RANGE' ? (
                <button onClick={handleStart} className="w-full bg-black text-white font-bold py-4 border-2 border-black shadow-md text-lg active:scale-95">
                  訪問開始
                </button>
              ) : (
                <div className="w-full py-4 text-center font-bold text-gray-500 text-lg">
                  範囲外です
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 pb-8 pt-3 z-40">
        <div className="flex justify-around px-4">
          <Link href="/pet" className="flex flex-col items-center gap-1 text-gray-400"><Home size={24} /><span className="text-[9px] font-bold">ホーム</span></Link>
          <div className="flex flex-col items-center gap-1 text-blue-600"><CircleCheck size={24} /><span className="text-[9px] font-bold">打刻</span></div>
          <Link href="/report" className="flex flex-col items-center gap-1 text-gray-400"><ClipboardList size={24} /><span className="text-[9px] font-bold">タスク</span></Link>
          <div className="flex flex-col items-center gap-1 text-gray-400"><FileText size={24} /><span className="text-[9px] font-bold">日報</span></div>
          <div className="flex flex-col items-center gap-1 text-gray-400"><Award size={24} /><span className="text-[9px] font-bold">実績</span></div>
        </div>
      </nav>
    </main>
  );
}