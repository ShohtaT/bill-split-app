# シンプルクリーンアーキテクチャ設計（Next.js × TypeScript × Supabase）

このドキュメントでは、Next.js (App Router) × TypeScript × Supabase を用いたフルスタックアプリケーションの、APIとフロントエンドを分離したシンプルなクリーンアーキテクチャ構成について具体的に説明します。

---

## 1. アーキテクチャ全体像

本アプリケーションは以下の設計思想に基づいて構築します：

- **クリーンアーキテクチャの徹底**
  - 層ごとに責務を明確化し、依存性逆転を守る
- **API（バックエンド）とフロントエンドの明確な分離**
  - Next.js App Routerの`/api`ディレクトリでAPIを実装
  - フロントエンドはAPI経由でデータ取得
- **型安全・テスト容易性・拡張性の確保**

### 依存関係の方向

```
UI (Front) → Application (UseCase) → Domain (Entity) → Infrastructure (Supabase, API)
```

- 内側（Domain, Application）は外側（Infra, UI）に依存しない
- 外部依存（Supabase）はInfrastructure層でカプセル化
- 各層は独立してテスト可能

---

## 2. ディレクトリ構成（例）

```
src/
├── app/                # Next.js App Router
│   ├── api/            # APIルート（バックエンド）
│   │   └── payment/    # 機能ごとのAPIエンドポイント
│   └── ...             # フロントエンドページ
│
├── features/           # 機能単位でまとめたユースケース・ドメイン
│   └── payment/
│       ├── usecase/    # ユースケース（サービス）
│       ├── domain/     # エンティティ・ドメインサービス
│       └── infra/      # リポジトリ実装（Supabase等）
│
├── shared/             # 共通型・ユーティリティ
│   ├── types/
│   └── lib/
└── styles/
```

---

## 3. 各層の責務と具体例

### 3.1 UI層（Front, `src/app/`）

- Next.js App Routerのページ・コンポーネント
- API（`/api`）をfetchで呼び出し、データ取得・送信
- UIロジックのみを担当し、ビジネスロジックは持たない

**例：支払い作成ページ**

```tsx
// src/app/payments/new/page.tsx
import { useState } from 'react';

export default function NewPaymentPage() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSubmit = async () => {
    await fetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify({ title, amount }),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button type="submit">作成</button>
    </form>
  );
}
```

### 3.2 API層（Back, `src/app/api/`）

- Next.jsのAPI Routeでエンドポイントを実装
- Application層（UseCase）を呼び出し、リクエスト/レスポンスを処理

**例：支払い作成API**

```typescript
// src/app/api/payment/route.ts
import { createPaymentUseCase } from '@/features/payment/usecase/createPayment';

export async function POST(req: Request) {
  const { title, amount } = await req.json();
  await createPaymentUseCase({ title, amount });
  return new Response(null, { status: 201 });
}
```

### 3.3 Application層（UseCase, `src/features/*/usecase/`）

- ユースケース（アプリケーションサービス）を実装
- ドメイン層とインフラ層の橋渡し
- 入出力DTOの定義

**例：支払い作成ユースケース**

```typescript
// src/features/payment/usecase/createPayment.ts
import { Payment } from '../domain/Payment';
import { paymentRepository } from '../infra/PaymentRepositorySupabase';

export async function createPaymentUseCase(input: { title: string; amount: number }) {
  const payment = Payment.create(input.title, input.amount);
  await paymentRepository.save(payment);
}
```

### 3.4 Domain層（Entity, `src/features/*/domain/`）

- ドメインモデル・ビジネスロジックを実装
- エンティティ・値オブジェクト・ドメインサービス

**例：支払いエンティティ**

```typescript
// src/features/payment/domain/Payment.ts
export class Payment {
  constructor(
    public title: string,
    public amount: number
  ) {}

  static create(title: string, amount: number) {
    if (!title) throw new Error('タイトル必須');
    if (amount <= 0) throw new Error('金額は正の数');
    return new Payment(title, amount);
  }
}
```

### 3.5 Infrastructure層（`src/features/*/infra/`）

- SupabaseやAPIとの通信を担当
- リポジトリ実装で外部依存をカプセル化

**例：Supabaseリポジトリ実装**

```typescript
// src/features/payment/infra/PaymentRepositorySupabase.ts
import { supabaseClient } from '@/shared/lib/supabaseClient';
import { Payment } from '../domain/Payment';

export const paymentRepository = {
  async save(payment: Payment) {
    await supabaseClient.from('payments').insert({
      title: payment.title,
      amount: payment.amount,
    });
  },
};
```

---

## 4. 状態管理・型・共通部品

- ZustandやReact Contextでグローバル状態管理（必要最小限）
- 型定義は`shared/types/`に集約
- 共通ライブラリ・ユーティリティは`shared/lib/`に配置

---

## 5. この構成のメリット

1. **保守性・拡張性**
   - 層ごとに責務が明確で、変更の影響範囲が限定的
2. **テスタビリティ**
   - 各層が独立してテスト可能。モック・スタブも容易
3. **スケーラビリティ**
   - 機能追加やチーム開発がしやすい
4. **依存性の制御**
   - 外部サービスの変更が内部に影響しにくい

---

## 6. 今後の展望

1. **テストカバレッジの向上**
2. **パフォーマンスの最適化**
3. **セキュリティの強化**

// ビジネスロジックを実装
async createPayment(title: string, amount: number, billings: Billing[]) {
// バリデーションやビジネスルールの適用
// データの整形
// リポジトリを使用したデータ操作
}
}

````

### 3. データアクセス層 (`src/repositories/`)

- データベース（Supabase）とのインタラクション
- クエリの実行とデータの永続化
- 外部サービスとの通信をカプセル化

実装例：

```typescript
export class PaymentRepository {
  // Supabaseクライアントへの依存
  constructor(private supabaseClient: SupabaseClient) {}

  // データアクセスメソッド
  async getPayments(): Promise<Payment[]> {
    const { data, error } = await this.supabaseClient.from('Payments').select();
    if (error) throw error;
    return data;
  }
}
````

## 状態管理 (`src/stores/`)

Zustandを使用した状態管理の実装：

- グローバル状態の一元管理
- 各機能ごとに分割された状態管理
  - ユーザー状態 (`users.ts`)
  - 支払い状態 (`payments.ts`)
  - ナビゲーション状態 (`navigation.ts`)

## コンポーネント設計 (`src/components/`)

- 再利用可能なUIコンポーネントの分離
- 共通コンポーネントの集約
- フォームコンポーネントの標準化

## 型システム (`src/types/`)

- ドメインモデルの型定義
- 厳格な型チェックの活用
- インターフェースとタイプエイリアスの定義

## アーキテクチャの利点

1. **保守性**

   - 各層の責務が明確
   - 変更の影響範囲が限定的
   - コードの理解が容易

2. **テスタビリティ**

   - 各層が独立してテスト可能
   - モックやスタブの作成が容易
   - ビジネスロジックの単体テストが書きやすい

3. **スケーラビリティ**

   - 新機能の追加が容易
   - チーム開発での作業分担がしやすい
   - コードベースの拡張性が高い

4. **依存性の制御**
   - 外部サービスの変更が内部に影響しにくい
   - ビジネスロジックが技術的な実装から独立
   - インフラストラクチャの変更が容易

## ディレクトリ構造の詳細

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx          # ルートページ
│   ├── login/            # ログイン機能
│   ├── signup/           # サインアップ機能
│   ├── mypage/           # ユーザープロフィール
│   └── payments/         # 支払い関連機能
│
├── components/           # 再利用可能なコンポーネント
│   └── common/           # 共通コンポーネント
│
├── services/            # ビジネスロジック層
│   ├── authService.ts    # 認証サービス
│   ├── paymentService.ts # 支払いサービス
│   └── ...
│
├── repositories/        # データアクセス層
│   ├── authRepository.ts # 認証リポジトリ
│   ├── paymentRepository.ts # 支払いリポジトリ
│   └── ...
│
└── types/              # 型定義
    ├── payment.ts       # 支払い関連の型
    └── ...
```

## 今後の展望

1. **テストカバレッジの向上**

   - 単体テストの追加
   - 統合テストの実装
   - E2Eテストの導入

2. **パフォーマンスの最適化**

   - キャッシング戦略の実装
   - バンドルサイズの最適化
   - レンダリングパフォーマンスの改善

3. **セキュリティの強化**
   - 認証・認可の強化
   - 入力バリデーションの改善
   - セキュリティヘッダーの最適化
