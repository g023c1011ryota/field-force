"use client";

type Props = {
  onLoginClick: () => void;
};

export function LoginForm({ onLoginClick }: Props) {
  return (
    <div
      style={{
        maxWidth: 420,
        width: "100%",
        margin: 0,
        padding: 20,
        backgroundColor: "#ffffff",
        border: "3px solid #000",
        borderRadius: 4,
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>
        フィールドセールス・アプリ
      </h1>

   <hr
  style={{
    margin: 0,              // ★ デフォルト余白を消す
    marginBottom: 16,       // ★ 下だけ余白
    border: "none",         // ★ デフォルトの線を消す
    borderTop: "3px solid #000", // ★ 太い線を指定
  }}
/>

      <p
        style={{
          textAlign: "center",
          color: "#000",
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        ログインして続けてください
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 14 }}>
          社員ID / メールアドレス
        </label>
        <input
          type="text"
          placeholder="user@example.com"
          style={{
            width: "100%",
            padding: 12,
            marginTop: 4,
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 14 }}>
          パスワード
        </label>
        <input
          type="password"
          placeholder="••••••••"
          style={{
            width: "100%",
            padding: 12,
            marginTop: 4,
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "space-between",
          marginBottom: 24,
          fontSize: 13,
        }}
      >
        <label>
          <input type="checkbox" /> ログイン状態を保持
        </label>

        <a href="#">パスワードを忘れた場合</a>
      </div>

      <button
        type="button"
          onClick={() => {
    console.log("login button clicked");
    onLoginClick();
  }}
        style={{
          width: "100%",
          padding: 14,
          backgroundColor: "#000",
          color: "#fff",
          fontSize: 16,
          border: "none",
          borderRadius: 4,
        }}
      >
        ログイン
      </button>
    </div>
  );
}
