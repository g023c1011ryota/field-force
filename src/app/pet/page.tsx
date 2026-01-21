"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, CircleCheck, ClipboardList, FileText, Award, Bone, Heart } from 'lucide-react';

// ハートのアニメーション用データの型定義
type FloatingHeart = {
  id: number;
  left: number; // 横位置（%）
  scale: number; // 大きさ
  duration: number; // アニメーション時間
};

export default function PetPage() {
  const [level, setLevel] = useState(12);
  const [feedCount, setFeedCount] = useState(3);
  const maxFeed = 5;
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  // 餌やりボタンを押したときの処理
  const handleFeed = () => {
    // ------------------------------------------------
    // 1. ハートを出す演出
    // ------------------------------------------------
    const newHeart: FloatingHeart = {
      id: Date.now(),
      left: 50 + (Math.random() * 40 - 20), // 30%〜70%の位置にランダム表示
      scale: 0.8 + Math.random() * 0.7,     // 大きさをランダムに
      duration: 0.8 + Math.random() * 0.5   // スピードをランダムに
    };
    setHearts((prev) => [...prev, newHeart]);

    // 1秒後（アニメーション終了後）にハートのデータを消す
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);

    // ------------------------------------------------
    // 2. レベルアップのロジック
    // ------------------------------------------------
    if (feedCount + 1 >= maxFeed) {
      // 満タンになったらレベルアップしてリセット
      setLevel((prev) => prev + 1);
      setFeedCount(0);
    } else {
      // それ以外はカウントアップ
      setFeedCount((prev) => prev + 1);
    }
  };

  return (
    <main 
      className="relative mx-auto h-screen w-full max-w-md overflow-hidden font-sans shadow-2xl border-x border-gray-200 bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/petbackground.jpg')" 
      }}
    >
      {/* CSSアニメーションの定義 */}
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* --------------------------------------
          ① 左上：ステータスカード
      --------------------------------------- */}
      <div className="absolute top-12 left-6 z-10 w-40 rounded-3xl bg-white/95 p-4 shadow-sm backdrop-blur-md">
        
        {/* 上段：Lvバッジと名前 */}
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-white">
            Lv.{level}
          </div>
          <span className="text-xs font-bold text-gray-800">柴犬</span>
        </div>

        {/* 下段：ステータスリスト */}
        <div className="space-y-1 text-xs font-bold text-gray-500">
          <div className="flex justify-between items-center">
            <span>訪問数</span>
            <span className="text-gray-800">3/5</span>
          </div>
          <div className="flex justify-between items-center">
            <span>タスク</span>
            <span className="text-gray-800">2/4</span>
          </div>
        </div>
      </div>

      {/* --------------------------------------
          ② 中央左：吹き出しメッセージ
      --------------------------------------- */}
      <div className="absolute top-40 left-6 z-10 w-48 animate-pulse">
        <div className="relative rounded-2xl bg-white p-3 shadow-md text-left">
          <p className="text-xs font-bold text-gray-700 leading-relaxed">
            昨日の日報提出<br />忘れないでね！
          </p>
          {/* しっぽの位置 */}
          <div className="absolute -bottom-1 -right-1 h-4 w-4 -translate-x-1/2 rotate-45 bg-white"></div>
        </div>
      </div>

      {/* --------------------------------------
          ③ 中央下：ペット画像の表示エリア ＋ ハート
      --------------------------------------- */}
      <div className="absolute bottom-36 left-1/2 z-0 -translate-x-1/2 transform flex justify-center w-full pointer-events-none">
        <div className="relative">
          <img 
            src="/pet_dog.png" 
            alt="My Pet" 
            className="w-72 h-auto drop-shadow-xl object-contain relative z-10"
          />
          
          {/* ハートのエフェクト表示 */}
          {hearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute bottom-20 text-pink-500 z-20"
              style={{
                left: `${heart.left}%`,
                transform: `scale(${heart.scale})`,
                animation: `floatUp ${heart.duration}s ease-out forwards`
              }}
            >
              <Heart fill="currentColor" size={32} />
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------
          ④ 右下：餌やりアクションボタン
      --------------------------------------- */}
      <div className="absolute bottom-28 right-6 z-10 flex flex-col items-center rounded-2xl bg-white/95 p-3 shadow-md backdrop-blur-md">
        <button 
          onClick={handleFeed}
          className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 active:scale-90 transition shadow-sm active:bg-orange-200"
        >
          <Bone size={24} fill="currentColor" />
        </button>
        <span className="text-[10px] font-bold text-gray-600 mb-1">餌やり</span>
        <div className="h-1.5 w-10 overflow-hidden rounded-full bg-gray-200">
          <div 
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${(feedCount / maxFeed) * 100}%` }}
          ></div>
        </div>
        <span className="mt-0.5 text-[9px] text-gray-400">{feedCount}/{maxFeed}</span>
      </div>

      {/* --------------------------------------
          ⑤ 最下部：ナビゲーションバー
      --------------------------------------- */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 pb-8 pt-3 rounded-t-3xl z-20">
        <div className="flex justify-around px-4">
          <Link href="/pet" className="flex flex-col items-center gap-1 text-blue-600">
            <Home size={24} strokeWidth={2.5} />
            <span className="text-[9px] font-bold">ホーム</span>
          </Link>
          <Link href="/checkin" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition">
            <CircleCheck size={24} />
            <span className="text-[9px] font-bold">打刻</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-gray-400">
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