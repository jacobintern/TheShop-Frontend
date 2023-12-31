'use client'

import LoginModal from "@/components/login";
import { Provider } from 'react-redux';
import store from '@/app/store';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Provider store={store}>
        <LoginModal />
      </Provider>
    </main>
  )
}
