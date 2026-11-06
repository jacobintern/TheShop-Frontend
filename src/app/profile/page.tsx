'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/services/user';
import { errorMessage } from '@/lib/api';
import { UserProfile } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { useMemberGuard, useRequireSignIn } from '@/lib/useMemberGuard';
import { useAppDispatch } from '@/store';
import { openLoginModal } from '@/store/loginSlice';
import Notice from '@/components/notice';

const rows: { label: string; key: keyof UserProfile }[] = [
  { label: 'Account', key: 'acc' },
  { label: 'Name', key: 'name' },
  { label: 'ID number', key: 'id' },
  { label: 'Phone', key: 'phone' },
  { label: 'City', key: 'city' },
  { label: 'Address', key: 'live' },
];

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const status = useRequireSignIn('Please sign in to view your profile.');
  const { member, handleUnauthorized } = useMemberGuard();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!member) return;
    let cancelled = false;
    getProfile()
      .then((result) => {
        if (!cancelled) setProfile(result);
      })
      .catch((err) => {
        if (!cancelled && !handleUnauthorized(err)) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [member, handleUnauthorized]);

  if (status === 'unknown') return <p className="text-gray-500">Loading…</p>;

  if (!member) {
    return (
      <p className="text-gray-600">
        Please{' '}
        <button type="button" className="text-blue-700 hover:underline" onClick={() => dispatch(openLoginModal())}>
          sign in
        </button>{' '}
        to see your profile.
      </p>
    );
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      {error && (
        <div className="mt-4">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {profile && (
        <dl className="mt-6 divide-y divide-gray-200 text-sm">
          {rows.map((row) => (
            <div key={row.key} className="grid grid-cols-3 py-3">
              <dt className="text-gray-500">{row.label}</dt>
              <dd className="col-span-2 text-gray-900">{profile[row.key] || '—'}</dd>
            </div>
          ))}
          <div className="grid grid-cols-3 py-3">
            <dt className="text-gray-500">Member since</dt>
            <dd className="col-span-2 text-gray-900">{formatDateTime(profile.createTime)}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
