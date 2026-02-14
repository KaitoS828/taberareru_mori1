'use client';

import { useState } from 'react';
import { Reservation } from '@/lib/supabase/types';

interface CreateReservationFormProps {
  onReservationCreated: (reservation: Reservation) => void;
}

export default function CreateReservationForm({
  onReservationCreated,
}: CreateReservationFormProps) {
  const [doorPin, setDoorPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setShowSuccess(false);
    setShowEmailPreview(false);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ door_pin: doorPin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create reservation');
      }

      setCreatedReservation(data.reservation);
      setShowSuccess(true);
      setDoorPin('');
      onReservationCreated(data.reservation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getRegistrationUrl = () => {
    if (!createdReservation) return '';
    return `${window.location.origin}/register/${createdReservation.id}`;
  };

  const generateEmailBody = () => {
    if (!createdReservation) return '';
    const url = getRegistrationUrl();

    return `この度はご予約いただきありがとうございます。

チェックイン当日はフロントでのお手続きは不要です。
以下の手順で事前登録をお済ませの上、当日セルフチェックインをご利用ください。

━━━━━━━━━━━━━━━━━━━━
■ 事前登録（ご到着前にお済ませください）
━━━━━━━━━━━━━━━━━━━━

以下のURLにアクセスしてください：
${url}

手順：
1. 宿泊者情報（お名前・ご住所・連絡先）を入力
2. 生体認証デバイスを登録（Touch ID / Face ID 等）
3. Secret Code が表示されます → 必ず控えてください

━━━━━━━━━━━━━━━━━━━━
■ Secret Code
━━━━━━━━━━━━━━━━━━━━

${createdReservation.secret_code}

※ チェックイン時に必要です。必ずお控えください。

━━━━━━━━━━━━━━━━━━━━
■ 当日のチェックイン方法
━━━━━━━━━━━━━━━━━━━━

1. チェックイン画面にアクセス
2. 登録したデバイスで生体認証
3. Secret Code を入力
4. ドア解錠PINが表示されます

ご不明な点がございましたら、お気軽にお問い合わせください。
それでは、お会いできることを楽しみにしております。`;
  };

  const handleOpenMailApp = () => {
    const subject = encodeURIComponent('【ご予約ありがとうございます】セルフチェックインのご案内');
    const body = encodeURIComponent(generateEmailBody());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleCopyEmail = () => {
    const subject = '【ご予約ありがとうございます】セルフチェックインのご案内\n\n';
    handleCopy(subject + generateEmailBody(), 'email');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="door_pin"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            スマートロック Door PIN
          </label>
          <input
            type="text"
            id="door_pin"
            value={doorPin}
            onChange={(e) => setDoorPin(e.target.value)}
            className="block w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40"
            placeholder="例: 1234"
            required
            disabled={isLoading}
          />
          <p className="mt-1.5 text-xs text-text-muted">
            チェックイン後にゲストに提示される解錠用PINコードです
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-danger/5 border border-danger/20 p-3">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '作成中...' : '新規予約を作成'}
        </button>
      </form>

      {showSuccess && createdReservation && (
        <div className="rounded-lg border-2 border-success/30 bg-success/5 p-5 space-y-4 animate-fade-in">
          <p className="text-sm font-semibold text-success">✓ 予約が作成されました</p>

          {/* Registration URL */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1.5">
              事前登録URL
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={getRegistrationUrl()}
                readOnly
                className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-xs font-mono text-foreground"
              />
              <button
                onClick={() => handleCopy(getRegistrationUrl(), 'url')}
                className="px-3 py-2 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-surface-secondary transition-colors"
              >
                {copiedField === 'url' ? '✓' : 'コピー'}
              </button>
            </div>
          </div>

          {/* Secret Code */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1.5">
              Secret Code
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={createdReservation.secret_code}
                readOnly
                className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-lg font-bold font-mono text-foreground"
              />
              <button
                onClick={() => handleCopy(createdReservation.secret_code, 'code')}
                className="px-3 py-2 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-surface-secondary transition-colors"
              >
                {copiedField === 'code' ? '✓' : 'コピー'}
              </button>
            </div>
          </div>

          {/* Email Actions */}
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs font-medium text-text-secondary mb-2">
              ゲストへの案内メール
            </p>
            <button
              onClick={handleOpenMailApp}
              className="w-full py-2.5 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              メールアプリで作成
            </button>
            <button
              onClick={handleCopyEmail}
              className="w-full py-2.5 px-4 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-surface-secondary transition-colors"
            >
              {copiedField === 'email' ? '✓ コピーしました' : 'メール文面をコピー'}
            </button>
            <button
              onClick={() => setShowEmailPreview(!showEmailPreview)}
              className="w-full py-2 px-4 text-xs text-text-secondary hover:text-foreground transition-colors"
            >
              {showEmailPreview ? '▲ プレビューを閉じる' : '▼ メール文面をプレビュー'}
            </button>
          </div>

          {/* Email Preview */}
          {showEmailPreview && (
            <div className="border border-border rounded-lg overflow-hidden animate-fade-in">
              <div className="bg-surface-secondary px-4 py-2 border-b border-border">
                <p className="text-xs font-semibold text-foreground">
                  件名: 【ご予約ありがとうございます】セルフチェックインのご案内
                </p>
              </div>
              <pre className="px-4 py-3 text-xs text-text-secondary whitespace-pre-wrap font-sans leading-relaxed max-h-80 overflow-y-auto">
                {generateEmailBody()}
              </pre>
            </div>
          )}

          <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
            <p className="text-xs text-warning">
              <strong>重要:</strong> Secret Codeは当日のチェックインで必要です。URLと一緒にゲストに送付してください。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
