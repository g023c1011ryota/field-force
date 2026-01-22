"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, CircleCheck, ClipboardList, FileText, Award, Bone, Heart } from 'lucide-react';

type FloatingHeart = {
  id: number;
  left: number;
  scale: number;
  duration: number;
};

export default function PetPage() {
  const [level, setLevel] = useState(12);
  const [taskCompletedCount, setTaskCompletedCount] = useState(0);
  const taskTargetCount = 5;
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  // ✅ 追加・変更したステート
  const [foodStock, setFoodStock] = useState(0);   // エサの在庫数（タスク完了で増える）
  const [feedProgress, setFeedProgress] = useState(0); // 次のレベルまでの進捗（0〜5）
  const maxFeed = 5; // レベルアップに必要なエサの数

  // データの読み込み
  useEffect(() => {
    const savedLevel = localStorage.getItem('pet_level');
    const savedTaskCompleted = localStorage.getItem('pet_task_completed');
    const savedStock = localStorage.getItem('pet_food_stock');
    const savedProgress = localStorage.getItem('pet_feed_progress');

    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedTaskCompleted) setTaskCompletedCount(parseInt(savedTaskCompleted));
    
    // 在庫と進捗を復元（無ければ初期値）
    if (savedStock) setFoodStock(parseInt(savedStock));
    if (savedProgress) setFeedProgress(parseInt(savedProgress));
  }, []);

  // 餌やり処理
  const handleFeed = () => {
    // 🚫 在庫がなければ何もしない
    if (foodStock <= 0) return;

    // 1. ハート演出
    const newHearts: FloatingHeart[] = [];
    for (let i = 0; i < 3; i++) {
      const newHeart: FloatingHeart = {
        id: Date.now() + i,
        left: 50 + (Math.random() * 80 - 40),
        scale: 1.5 + Math.random() * 1.5,
        duration: 0.8 + Math.random() * 0.5
      };
      newHearts.push(newHeart);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1500);
    }
    setHearts((prev) => [...prev, ...newHearts]);

    // 2. 在庫を減らして、進捗を進める
    const newStock = foodStock - 1;
    let newProgress = feedProgress + 1;
    let newLevel = level;

    // レベルアップ判定
    if (newProgress >= maxFeed) {
      newLevel = level + 1;
      newProgress = 0;
    }

    // ステート更新
    setFoodStock(newStock);
    setFeedProgress(newProgress);
    setLevel(newLevel);

    // 保存
    localStorage.setItem('pet_food_stock', newStock.toString());
    localStorage.setItem('pet_feed_progress', newProgress.toString());
    localStorage.setItem('pet_level', newLevel.toString());
  };

  return (
    <main 
      className="relative mx-auto h-screen w-full max-w-md overflow-hidden font-sans shadow-2xl border-x border-gray-200 bg-cover bg-center"
      style={{ backgroundImage: "url('/petbackground.jpg')" }}
    >
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* ステータスカード */}
      <div className="absolute top-12 left-6 z-10 w-40 rounded-3xl bg-white/95 p-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-white">
            Lv.{level}
          </div>
          <span className="text-xs font-bold text-gray-800">柴犬</span>
        </div>
        
        <div className="text-xs font-bold text-gray-500">
          <div className="flex justify-between items-center">
            <span>タスク完了</span>
            <span className="text-gray-800 text-sm">{taskCompletedCount}/{taskTargetCount}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 mt-1.5">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min((taskCompletedCount / taskTargetCount) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 吹き出し */}
      <div className="absolute top-44 left-6 z-10 w-48 animate-pulse">
        <div className="relative rounded-2xl bg-white p-3 shadow-md text-left">
          <p className="text-xs font-bold text-gray-700 leading-relaxed">
            {foodStock > 0 ? "お腹すいたワン！" : "タスク頑張ってね！"}
          </p>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 -translate-x-1/2 rotate-45 bg-white"></div>
        </div>
      </div>

      {/* ペット画像 */}
      <div className="absolute bottom-36 left-1/2 z-0 -translate-x-1/2 transform flex justify-center w-full pointer-events-none">
        <div className="relative">
          <img src="/pet_dog.png" alt="My Pet" className="w-72 h-auto drop-shadow-xl object-contain relative z-10" />
          {hearts.map((heart) => (
            <div key={heart.id} className="absolute bottom-20 text-pink-500 z-20" style={{ left: `${heart.left}%`, transform: `scale(${heart.scale})`, animation: `floatUp ${heart.duration}s ease-out forwards` }}>
              <Heart fill="currentColor" size={32} />
            </div>
          ))}
        </div>
      </div>

      {/* 餌やりボタン（修正箇所） */}
      <div className="absolute bottom-28 right-6 z-10 flex flex-col items-center rounded-2xl bg-white/95 p-3 shadow-md backdrop-blur-md">
        <button 
          onClick={handleFeed}
          disabled={foodStock <= 0} // 在庫が0なら押せなくする
          className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full transition shadow-sm 
            ${foodStock > 0 
              ? 'bg-orange-100 text-orange-500 active:scale-90 active:bg-orange-200 cursor-pointer' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Bone size={24} fill="currentColor" />
        </button>
        <span className="text-[10px] font-bold text-gray-600 mb-1">餌やり</span>
        
        {/* 進捗バー */}
        <div className="h-1.5 w-10 overflow-hidden rounded-full bg-gray-200">
          <div 
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${(feedProgress / maxFeed) * 100}%` }}
          ></div>
        </div>
        <span className="mt-0.5 text-[9px] text-gray-400">{feedProgress}/{maxFeed}</span>

        {/* ✅ 追加：在庫数のバッジ */}
        {foodStock > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
            {foodStock}
          </div>
        )}
      </div>

      {/* ナビゲーション */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 pb-8 pt-3 rounded-t-3xl z-20">
        <div className="flex justify-around px-4">
          <Link href="/pet" className="flex flex-col items-center gap-1 text-blue-600"><Home size={24} strokeWidth={2.5} /><span className="text-[9px] font-bold">ホーム</span></Link>
          <Link href="/checkin" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition"><CircleCheck size={24} /><span className="text-[9px] font-bold">打刻</span></Link>
          <div className="flex flex-col items-center gap-1 text-gray-400"><ClipboardList size={24} /><span className="text-[9px] font-bold">タスク</span></div>
          <div className="flex flex-col items-center gap-1 text-gray-400"><FileText size={24} /><span className="text-[9px] font-bold">日報</span></div>
          <div className="flex flex-col items-center gap-1 text-gray-400"><Award size={24} /><span className="text-[9px] font-bold">実績</span></div>
        </div>
      </div>
    </main>
  );
}