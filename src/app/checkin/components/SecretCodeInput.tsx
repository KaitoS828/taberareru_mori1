'use client';

import { useState } from 'react';

interface SecretCodeInputProps {
  reservationId: string;
  onCheckinSuccess: (doorPin: string) => void;
}

export default function SecretCodeInput({
  reservationId,
  onCheckinSuccess,
}: SecretCodeInputProps) {
  const [secretCode, setSecretCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/reservations/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, secretCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyCheckedIn && data.doorPin) {
          onCheckinSuccess(data.doorPin);
          return;
        }
        throw new Error(data.error || 'Failed to complete check-in');
      }

      onCheckinSuccess(data.doorPin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatSecretCode = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 3) {
      parts.push(cleaned.slice(i, i + 3));
    }
    return parts.join('-').slice(0, 11);
  };

  const handleSecretCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretCode(formatSecretCode(e.target.value));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Secret Code入力</h2>
        <p className="text-text-secondary text-sm">
          事前登録時に発行されたSecret Codeを入力してください。
        </p>
      </div>

      <div className="bg-success/5 border border-success/20 rounded-lg p-3">
        <p className="text-sm text-success font-medium">✓ 生体認証が完了しました</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="secret_code"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Secret Code
          </label>
          <input
            type="text"
            id="secret_code"
            value={secretCode}
            onChange={handleSecretCodeChange}
            className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-2xl font-bold font-mono text-center tracking-wider text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40"
            placeholder="XXX-XXX-XXX"
            required
            disabled={isLoading}
            maxLength={11}
          />
          <p className="mt-2 text-xs text-text-muted">
            フォーマット: XXX-XXX-XXX（英数字）
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-danger/5 border border-danger/20 p-4">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || secretCode.length < 11}
          className="w-full py-4 px-4 rounded-lg bg-foreground text-background text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'チェックイン処理中...' : 'チェックインを完了'}
        </button>
      </form>
    </div>
  );
}
