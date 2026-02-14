'use client';

import { useState } from 'react';
import { startAuthentication } from '@simplewebauthn/browser';

interface BiometricAuthProps {
  onAuthSuccess: (reservationId: string) => void;
}

export default function BiometricAuth({ onAuthSuccess }: BiometricAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthenticate = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (!window.PublicKeyCredential) {
        throw new Error(
          'このブラウザはWebAuthn（生体認証）に対応していません。Chrome、Safari、Firefoxの最新版をご利用ください。'
        );
      }

      const optionsResponse = await fetch(
        '/api/webauthn/authenticate/generate-options',
        { method: 'POST' }
      );

      const optionsData = await optionsResponse.json();

      if (!optionsResponse.ok) {
        throw new Error(optionsData.error || 'Failed to get authentication options');
      }

      const { options, challengeId } = optionsData;

      let credential;
      try {
        credential = await startAuthentication(options);
      } catch (authError) {
        if (authError instanceof Error && authError.name === 'NotAllowedError') {
          throw new Error('生体認証がキャンセルされました。もう一度お試しください。');
        }
        throw new Error('生体認証に失敗しました。登録したデバイスで認証を行ってください。');
      }

      const verifyResponse = await fetch('/api/webauthn/authenticate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, credential }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Authentication verification failed');
      }

      onAuthSuccess(verifyData.reservationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">生体認証</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          事前登録したデバイスで生体認証を行ってください。
        </p>
      </div>

      <div className="bg-surface-secondary rounded-lg p-4">
        <ul className="text-sm text-text-secondary space-y-1.5">
          <li>・ 登録したデバイスを使用してください</li>
          <li>・ Touch ID / Face ID / Windows Hello で認証します</li>
          <li>・ 認証後、Secret Codeの入力が必要です</li>
        </ul>
      </div>

      {error && (
        <div className="rounded-lg bg-danger/5 border border-danger/20 p-4">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <button
        onClick={handleAuthenticate}
        disabled={isLoading}
        className="w-full py-4 px-4 rounded-lg bg-foreground text-background text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            生体認証を待機中...
          </span>
        ) : (
          'チェックインを開始'
        )}
      </button>
    </div>
  );
}
