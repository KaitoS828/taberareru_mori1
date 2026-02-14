'use client';

import { Reservation } from '@/lib/supabase/types';

interface ReservationListProps {
  reservations: Reservation[];
}

export default function ReservationList({ reservations }: ReservationListProps) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary text-sm">
        予約がまだありません。新規予約を作成してください。
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
              予約ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
              宿泊者名
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
              Secret Code
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
              Door PIN
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
              状態
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
              作成日時
            </th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b border-border last:border-b-0">
              <td className="px-4 py-3 text-sm font-mono text-foreground">
                {reservation.id.slice(0, 8)}...
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                {reservation.guest_name || (
                  <span className="text-text-muted">未登録</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm font-mono font-semibold text-foreground">
                {reservation.secret_code}
              </td>
              <td className="px-4 py-3 text-sm font-mono text-foreground">
                {reservation.door_pin}
              </td>
              <td className="px-4 py-3">
                {reservation.is_checked_in ? (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-success/10 text-success">
                    チェックイン済み
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-warning/10 text-warning">
                    未チェックイン
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-text-secondary">
                {new Date(reservation.created_at).toLocaleString('ja-JP')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
