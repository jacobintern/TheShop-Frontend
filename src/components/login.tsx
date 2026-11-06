'use client';

import React, { FormEvent, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/store';
import { login } from '@/store/userSlice';
import { AuthMode, closeLoginModal, setAuthNotice, switchAuthMode } from '@/store/loginSlice';
import { register } from '@/lib/services/user';
import { errorMessage } from '@/lib/api';
import { RegisterForm } from '@/lib/types';

interface Field {
  name: keyof RegisterForm;
  label: string;
  type: string;
  placeholder: string;
}

const loginFields: Field[] = [
  { name: 'acc', label: 'Account', type: 'text', placeholder: 'your account' },
  { name: 'pswd', label: 'Password', type: 'password', placeholder: '••••••••' },
];

const registerFields: Field[] = [
  ...loginFields,
  { name: 'name', label: 'Name', type: 'text', placeholder: 'your name' },
  { name: 'id', label: 'ID number', type: 'text', placeholder: 'A123456789' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '09xxxxxxxx' },
  { name: 'city', label: 'City', type: 'text', placeholder: 'Taipei' },
  { name: 'live', label: 'Address', type: 'text', placeholder: 'street address' },
];

const emptyForm: RegisterForm = { acc: '', pswd: '', name: '', live: '', city: '', phone: '', id: '' };

const labelCss = 'text-sm font-medium text-gray-900 block mb-1';
const inputCss =
  'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';

function modalCss(isOpen: boolean): string {
  const css = 'fixed inset-0 z-50 overflow-y-auto justify-center items-start pt-10';
  return isOpen ? `${css} flex` : `${css} hidden`;
}

function backdropCss(isOpen: boolean): string {
  const css = 'bg-gray-900 bg-opacity-50 fixed inset-0 z-40';
  return isOpen ? css : `${css} hidden`;
}

function tabCss(active: boolean): string {
  const base = 'flex-1 py-2 text-sm font-medium border-b-2';
  return active ? `${base} border-blue-600 text-blue-700` : `${base} border-transparent text-gray-500 hover:text-gray-700`;
}

function noticeCss(isError: boolean): string {
  const base = 'text-sm rounded-lg px-3 py-2';
  return isError ? `${base} bg-red-50 text-red-700` : `${base} bg-blue-50 text-blue-700`;
}

export default function LoginModal() {
  const dispatch = useAppDispatch();
  const { isOpen, mode, notice } = useAppSelector((state) => state.loginModal);
  const [form, setForm] = useState<RegisterForm>(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fields = mode === 'login' ? loginFields : registerFields;
  const isLogin = mode === 'login';

  const updateField = (name: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [name]: e.target.value });

  const changeMode = (next: AuthMode) => {
    setError('');
    dispatch(switchAuthMode(next));
  };

  const close = () => {
    setError('');
    setForm(emptyForm);
    dispatch(closeLoginModal());
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        await dispatch(login({ acc: form.acc, pswd: form.pswd })).unwrap();
        close();
      } else {
        await register(form);
        setForm({ ...emptyForm, acc: form.acc });
        dispatch(switchAuthMode('login'));
        dispatch(setAuthNotice('Account created, please sign in.'));
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={modalCss(isOpen)}>
        <div className="relative w-full max-w-md px-4">
          <form onSubmit={submit} className="bg-white rounded-lg shadow relative">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={close}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 inline-flex items-center"
              >
                <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="space-y-4 px-6 pb-6">
              <div className="flex">
                <button type="button" className={tabCss(isLogin)} onClick={() => changeMode('login')}>
                  Sign in
                </button>
                <button type="button" className={tabCss(!isLogin)} onClick={() => changeMode('register')}>
                  Create account
                </button>
              </div>
              {notice && <p className={noticeCss(false)}>{notice}</p>}
              {error && <p className={noticeCss(true)}>{error}</p>}
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={`auth-${field.name}`} className={labelCss}>
                    {field.label}
                  </label>
                  <input
                    id={`auth-${field.name}`}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={inputCss}
                    value={form[field.name]}
                    onChange={updateField(field.name)}
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={submitting}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={backdropCss(isOpen)} onClick={close}></div>
    </>
  );
}
