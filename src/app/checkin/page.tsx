'use client';

import { useState } from 'react';
import Link from 'next/link';
import BiometricAuth from './components/BiometricAuth';
import SecretCodeInput from './components/SecretCodeInput';

type CheckinStep = 'biometric' | 'secret_code' | 'complete';

export default function CheckinPage() {
  const [currentStep, setCurrentStep] = useState<CheckinStep>('biometric');
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [doorPin, setDoorPin] = useState<string | null>(null);

  const handleBiometricSuccess = (id: string) => {
    setReservationId(id);
    setCurrentStep('secret_code');
  };

  const handleCheckinSuccess = (pin: string) => {
    setDoorPin(pin);
    setCurrentStep('complete');
  };

  const handleStartOver = () => {
    setCurrentStep('biometric');
    setReservationId(null);
    setDoorPin(null);
  };

  const steps = [
    { key: 'biometric', label: '生体認証' },
    { key: 'secret_code', label: 'Secret Code' },
    { key: 'complete', label: '完了' },
  ];
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          Smart Check-in
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          セルフチェックイン
        </h1>
        <p className="text-text-secondary mb-10">
          生体認証とSecret Codeで本人確認を行います
        </p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${
                    i < currentIndex
                      ? 'bg-foreground text-background'
                      : i === currentIndex
                      ? 'bg-foreground text-background'
                      : 'bg-surface-secondary text-text-muted border border-border'
                  }`}
                >
                  {i < currentIndex ? '✓' : i + 1}
                </div>
                <span className={`text-sm ${i <= currentIndex ? 'text-foreground font-medium' : 'text-text-muted'}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px ${i < currentIndex ? 'bg-foreground' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="animate-fade-in">
          {currentStep === 'biometric' && (
            <BiometricAuth onAuthSuccess={handleBiometricSuccess} />
          )}

          {currentStep === 'secret_code' && reservationId && (
            <SecretCodeInput
              reservationId={reservationId}
              onCheckinSuccess={handleCheckinSuccess}
            />
          )}

          {currentStep === 'complete' && doorPin && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="text-4xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  チェックイン完了
                </h2>
                <p className="text-text-secondary">
                  以下のPINコードでドアを解錠してください
                </p>
              </div>

              <div className="border-2 border-foreground rounded-lg p-8 text-center">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">
                  ドア解錠PIN
                </p>
                <p className="text-5xl font-bold font-mono text-foreground tracking-widest">
                  {doorPin}
                </p>
              </div>

              <div className="bg-surface-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary">
                  <strong className="text-foreground">重要:</strong>{' '}
                  このPINコードをスマートロックに入力してドアを解錠してください。
                  PINコードは再度表示されませんので、スクリーンショットを保存することをお勧めします。
                </p>
              </div>

              <button
                onClick={handleStartOver}
                className="text-sm text-text-secondary hover:text-foreground transition-colors"
              >
                ← 最初に戻る
              </button>
            </div>
          )}
        </div>

        {/* Help */}
        {currentStep !== 'complete' && (
          <div className="mt-16 border-t border-border pt-8">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">
              お困りの場合
            </h3>
            <ul className="text-sm text-text-secondary space-y-2 leading-relaxed">
              <li>・ 事前登録したデバイスで認証を行ってください</li>
              <li>・ Secret Codeは大文字・小文字を区別しません</li>
              <li>・ 解決しない場合は施設の緊急連絡先にお問い合わせください</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
