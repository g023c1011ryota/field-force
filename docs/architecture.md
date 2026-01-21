# Architecture

## 目的

- 置き場所の迷いを減らし、探索性と保守性を上げる
- ルーティング、機能、共通要素の責務を明確にする
- 追加実装時の判断基準を共有する

## ディレクトリ構成（概要）

```
src/
  app/
    (auth)/
      login/
        _components/
    (tabs)/
      home/
      checkin/
      in-progress/
      tasks/
        [taskId]/
      reports/
      results/
    api/
      checkin/
      tasks/
      reports/
  components/
    ui/
    layout/
  features/
    auth/
      components/
      hooks/
    checkin/
      components/
      hooks/
    tasks/
      components/
      hooks/
    reports/
      components/
      hooks/
    results/
      components/
      hooks/
  hooks/
  lib/
  store/
  types/
  assets/
    images/
    icons/
public/
```

## 配置ルール（詳細）

### ルーティング（Next.js App Router）

- ルーティングはすべて `src/app` 配下で管理する
- 認証系は `src/app/(auth)`、ログイン後は `src/app/(tabs)` に配置する
- ルート配下では `page.tsx`/`layout.tsx`/`loading.tsx`/`error.tsx`/`not-found.tsx` を使用する
- API Route Handlers は `src/app/api/*/route.ts` に置く
- ルート直下のファイルは「画面の組み立て」に徹し、業務ロジックは `src/features` に寄せる

### ページ固有 UI

- ページ固有 UI は各ルート直下の `_components` に置く
- `_components` はそのルート専用とし、他ルートで再利用しない
- 共有される可能性が出たら `src/features/<feature>/components` か `src/components` に移す

### 共通 UI とレイアウト

- 再利用可能な UI は `src/components/ui` に置く
- レイアウト関連は `src/components/layout` に置く
- `src/components` 配下は「業務知識を持たない」ことを原則とする

### 機能単位の集約

- 機能単位のロジックは `src/features/<feature>` に集約する
- 典型的な構成は `api.ts`/`types.ts`/`schema.ts`/`components`/`hooks`
- `api.ts` はデータ取得や外部 I/O の入口、`schema.ts` は入力検証やパース、`types.ts` は型定義に使う

例:

```
src/features/tasks/
  api.ts
  schema.ts
  types.ts
  components/
  hooks/
```

### 横断的な Hooks

- 機能に依存しない共通 Hooks は `src/hooks` に置く
- 機能に依存する Hooks は `src/features/<feature>/hooks` に置く

### 共通ユーティリティ

- AWS/Cognito 連携などの共通ユーティリティは `src/lib` に置く
- `src/lib` は UI 依存を持たない

### 状態管理

- アプリ全体で共有する状態は `src/store` に置く
- 画面内・機能内の限定的な状態は各 `features` またはコンポーネント内に閉じる

### 型の置き場

- 共通の型定義は `src/types` に置く
- 機能固有の型は `src/features/<feature>/types.ts` に置く
- 画面専用の型は `_components` かページファイル内に閉じる

### アセット

- バンドルするアセットは `src/assets` に置く
- 画像は `src/assets/images`、アイコンは `src/assets/icons` に置く
- 公開用の静的ファイルは `public/` に置く

## 依存関係の原則（迷ったらここ）

- `src/app` は組み立てに専念し、`src/features` や `src/components` を利用する
- `src/features` は `src/components/ui`、`src/hooks`、`src/lib`、`src/types`、`src/store` に依存してよい
- `src/components` と `src/hooks` は `src/features` や `src/app` に依存しない
- `src/lib` は `src/types` 以外に依存しない
- 依存が循環しそうな場合は共通モジュールに切り出す

## 命名ルール

- React コンポーネントは PascalCase（例: `TaskCard.tsx`）
- Hooks は `useXxx` 形式（例: `useTaskFilters.ts`）
- ルートセグメントは小文字・ハイフン区切り（例: `in-progress`）
- `src/features` 配下は機能名の小文字（例: `tasks`）

## 置き場所の判断フロー

1. ルーティングに関わるか → `src/app`
2. そのページだけで使う UI か → `src/app/.../_components`
3. 機能固有か → `src/features/<feature>`
4. 複数機能で使う UI か → `src/components`
5. どの機能にも依存しない Hook か → `src/hooks`
6. 外部サービスや共通ユーティリティか → `src/lib`
7. 画像やアイコンか → `src/assets` または `public/`

## 具体例（OK / NG）

OK:

- `src/app/(tabs)/tasks/_components/TaskList.tsx`（tasks ページ専用）
- `src/features/tasks/components/TaskCard.tsx`（tasks で再利用）
- `src/components/ui/Button.tsx`（汎用 UI）

NG:

- `src/components/ui/TaskCard.tsx`（業務知識が含まれるため `features` へ）
- `src/features/tasks/api.ts` を `src/components/ui` から直接呼ぶ（依存逆転）

## Notes

- 可能な限り、ルート名と機能名は揃える
- UI は「最も近い所有者」（ルート or 機能）に寄せて配置する
- 迷ったら `src/features` に寄せる方が拡張しやすい
