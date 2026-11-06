'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { isMember, sessionExpired } from '@/store/userSlice';
import { openLoginModal } from '@/store/loginSlice';
import { isUnauthorized } from '@/lib/api';

const LOGIN_REQUIRED = 'Please sign in to continue.';

// 需要登入的操作統一走這裡：未登入就彈登入；打 API 回 401 就視為過期、清掉身分再彈登入
export function useMemberGuard() {
  const dispatch = useAppDispatch();
  const member = useAppSelector((state) => isMember(state.user));

  const requireMember = useCallback(
    (action: () => void | Promise<void>): void => {
      if (!member) {
        dispatch(openLoginModal(LOGIN_REQUIRED));
        return;
      }
      void action();
    },
    [dispatch, member],
  );

  const handleUnauthorized = useCallback(
    (err: unknown): boolean => {
      if (isUnauthorized(err)) {
        dispatch(sessionExpired());
        dispatch(openLoginModal('Your session has expired, please sign in again.'));
        return true;
      }
      return false;
    },
    [dispatch],
  );

  return { member, requireMember, handleUnauthorized };
}

// 受保護頁面初次載入發現未登入就彈登入；登出造成的 member → guest 不再彈，避免登出後多跳一次
export function useRequireSignIn(notice: string) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.user.status);
  const previous = useRef(status);

  useEffect(() => {
    if (status === 'guest' && previous.current === 'unknown') dispatch(openLoginModal(notice));
    previous.current = status;
  }, [dispatch, status, notice]);

  return status;
}
