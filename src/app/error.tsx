'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="text-5xl mb-6">⚠</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          エラーが発生しました
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          {error.message || '予期しないエラーが発生しました。もう一度お試しください。'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            もう一度試す
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface-secondary transition-colors"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
