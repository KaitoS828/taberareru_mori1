import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Smart Check-in
        </span>
        <Link
          href="/admin"
          className="text-sm text-text-secondary hover:text-foreground transition-colors"
        >
          管理者
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
            鍵の受け渡しを、
            <br />
            なくす。
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-xl mb-12">
            生体認証とSecret Codeによる二段階認証で、
            無人施設でも安全なセルフチェックインを実現します。
            フロント対応も、鍵の郵送も、もう必要ありません。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/checkin"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              チェックインする
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface-secondary transition-colors"
            >
              管理画面を開く
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-12">
          使い方
        </h2>
        <div className="space-y-16">
          <div className="flex gap-8">
            <div className="flex-shrink-0 w-8 text-right">
              <span className="text-2xl font-light text-text-muted">1</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">事前登録</h3>
              <p className="text-text-secondary leading-relaxed">
                予約後に届くURLから、宿泊者情報と生体認証デバイスを登録します。
                Touch ID・Face ID・Windows Helloなど、お使いのデバイスの認証機能がそのまま使えます。
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-shrink-0 w-8 text-right">
              <span className="text-2xl font-light text-text-muted">2</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">生体認証でチェックイン</h3>
              <p className="text-text-secondary leading-relaxed">
                当日は登録したデバイスで生体認証を行い、事前に受け取ったSecret Codeを入力します。
                ユーザー名やパスワードの入力は一切不要です。
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-shrink-0 w-8 text-right">
              <span className="text-2xl font-light text-text-muted">3</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">ドア解錠PINの取得</h3>
              <p className="text-text-secondary leading-relaxed">
                認証が完了すると、スマートロックの解錠PINが画面に表示されます。
                このPINを入力するだけで入室できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* Security */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-12">
          セキュリティ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            {
              title: 'FIDO2/WebAuthn準拠',
              desc: 'フィッシングに強いパスキー認証を採用。認証情報はデバイス外に送信されません。',
            },
            {
              title: '二段階認証',
              desc: '生体認証とSecret Codeの二要素で、なりすましや不正アクセスを防止します。',
            },
            {
              title: 'パスワードレス',
              desc: 'パスワードの記憶も管理も不要。生体情報で本人確認するため、漏洩リスクがありません。',
            },
            {
              title: 'ワンタイム利用',
              desc: 'Secret CodeとPINは予約ごとに発行。使い回しによるセキュリティリスクを排除します。',
            },
          ].map((item, i) => (
            <div key={i} className="py-1">
              <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-sm font-medium text-text-muted">Smart Check-in</span>
          <span className="text-sm text-text-muted">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
