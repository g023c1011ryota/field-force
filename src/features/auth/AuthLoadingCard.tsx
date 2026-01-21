"use client";

export function AuthLoadingCard() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        padding: 20,
        backgroundColor: "#fff",
        border: "3px solid #000",
        borderRadius: 8,
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>
        フィールドセールス・アプリ
      </h1>

         <hr
  style={{
    margin: 0,              // ★ デフォルト余白を消す
    marginBottom: 60,       // ★ 下だけ余白
    border: "none",         // ★ デフォルトの線を消す
    borderTop: "3px solid #000", // ★ 太い線を指定
  }}
/>
      {/* ローディング */}

      <div
        style={{
          width: 30,
          height: 30,
          border: "4px solid #000",
          borderTop: "4px solid #fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 16px",
        }}
      />

      <p style={{ fontWeight: "bold",textAlign: "center",fontSize: 16, color: "#000",marginBottom: 45, }}>
        認証中…
      </p>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
