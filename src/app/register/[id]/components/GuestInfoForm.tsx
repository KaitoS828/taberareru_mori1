'use client';

import { useState } from 'react';
import { Reservation } from '@/lib/supabase/types';

interface GuestInfoFormProps {
  reservation: Reservation;
  onGuestInfoSubmitted: (updatedReservation: Reservation) => void;
}

export default function GuestInfoForm({
  reservation,
  onGuestInfoSubmitted,
}: GuestInfoFormProps) {
  const [guestName, setGuestName] = useState(reservation.guest_name || '');
  const [guestAddress, setGuestAddress] = useState(reservation.guest_address || '');
  const [guestContact, setGuestContact] = useState(reservation.guest_contact || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isAlreadySubmitted = Boolean(reservation.guest_name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: guestName,
          guest_address: guestAddress,
          guest_contact: guestContact,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update guest information');
      }

      onGuestInfoSubmitted(data.reservation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">宿泊者名簿</h2>
      </div>

      {isAlreadySubmitted && (
        <div className="bg-success/5 border border-success/20 rounded-lg p-3">
          <p className="text-sm text-success font-medium">✓ 宿泊者情報は既に登録されています</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="guest_name" className="block text-sm font-medium text-foreground mb-1.5">
            お名前 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="guest_name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="block w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40"
            placeholder="山田 太郎"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="guest_address" className="block text-sm font-medium text-foreground mb-1.5">
            ご住所 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="guest_address"
            value={guestAddress}
            onChange={(e) => setGuestAddress(e.target.value)}
            className="block w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40"
            placeholder="東京都渋谷区..."
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="guest_contact" className="block text-sm font-medium text-foreground mb-1.5">
            連絡先（電話番号） <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            id="guest_contact"
            value={guestContact}
            onChange={(e) => setGuestContact(e.target.value)}
            className="block w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40"
            placeholder="090-1234-5678"
            required
            disabled={isLoading}
          />
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
          {isLoading ? '送信中...' : isAlreadySubmitted ? '情報を更新' : '宿泊者情報を送信'}
        </button>
      </form>
    </div>
  );
}
