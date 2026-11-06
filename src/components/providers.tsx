'use client';

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import store, { useAppDispatch, useAppSelector } from '@/store';
import { restoreSession } from '@/store/userSlice';
import { fetchCart } from '@/store/cartSlice';

function SessionBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.user.status);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'member') dispatch(fetchCart());
  }, [dispatch, status]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SessionBootstrap>{children}</SessionBootstrap>
    </Provider>
  );
}
