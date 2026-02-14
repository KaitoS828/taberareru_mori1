'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reservation } from '@/lib/supabase/types';
import ReservationList from './components/ReservationList';
import CreateReservationForm from './components/CreateReservationForm';

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reservations');
      }

      setReservations(data.reservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleReservationCreated = (newReservation: Reservation) => {
    setReservations((prev) => [newReservation, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          Smart Check-in
        </Link>
        <span className="text-xs font-medium text-text-muted uppercase tracking-widest">
          Admin
        </span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          管理ダッシュボード
        </h1>
        <p className="text-text-secondary mb-10">
          予約の作成と管理
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Reservation Form */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                新規予約作成
              </h2>
              <CreateReservationForm
                onReservationCreated={handleReservationCreated}
              />
            </div>
          </div>

          {/* Reservations List */}
          <div className="lg:col-span-2">
            <div className="border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  予約一覧
                </h2>
                <button
                  onClick={fetchReservations}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-surface-secondary transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? '読込中...' : '更新'}
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-danger/5 border border-danger/20 p-4">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
                  <p className="mt-3 text-sm text-text-secondary">読込中...</p>
                </div>
              ) : (
                <ReservationList reservations={reservations} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
