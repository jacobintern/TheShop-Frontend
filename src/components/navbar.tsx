'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/store';
import { isMember, logout } from '@/store/userSlice';
import { openLoginModal } from '@/store/loginSlice';
import { cartCount } from '@/store/cartSlice';

interface NavLink {
  name: string;
  href: string;
}

const topNav: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Cart', href: '/cart' },
  { name: 'Orders', href: '/orders' },
];

const memberNav: NavLink[] = [
  { name: 'Profile', href: '/profile' },
  { name: 'Orders', href: '/orders' },
];

// 手機版主選單已經有 Orders，會員區只列主選單沒有的項目，避免重複
const mobileMemberNav: NavLink[] = memberNav.filter((item) => !topNav.some((top) => top.href === item.href));

function isCurrent(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function topNavCss(current: boolean): string {
  const css = [current ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium'];
  return css.join(' ');
}

function topNavMobileCss(current: boolean): string {
  const css = [current ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium'];
  return css.join(' ');
}

function menuItemCss(active: boolean): string {
  const css = [active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700'];
  return css.join(' ');
}

export default function Navigationbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const member = useAppSelector((state) => isMember(state.user));
  const name = useAppSelector((state) => state.user.name);
  const count = useAppSelector((state) => cartCount(state.cart));

  const signOut = async () => {
    await dispatch(logout());
    router.push('/');
  };

  const openSignIn = () => dispatch(openLoginModal());

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 text-lg font-bold text-gray-900">
                  TheShop
                </Link>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {topNav.map((item) => (
                      <Link key={item.name} href={item.href} className={topNavCss(isCurrent(pathname, item.href))}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/cart" className="relative text-gray-700 hover:text-gray-900" aria-label="Cart">
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 rounded-full bg-blue-600 px-1.5 text-xs text-white">{count}</span>
                  )}
                </Link>

                <div className="hidden md:block">
                  {member ? (
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center gap-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <span className="text-gray-700">{name}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="h-8 w-8 rounded-full" src="/usr.png" alt="" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {memberNav.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link href={item.href} className={menuItemCss(active)}>
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          <Menu.Item>
                            {({ active }) => (
                              <button type="button" className={menuItemCss(active)} onClick={signOut}>
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <button type="button" onClick={openSignIn} className="text-sm font-medium text-blue-700 hover:underline">
                      Sign in / Sign up
                    </button>
                  )}
                </div>

                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {topNav.map((item) => (
                <Disclosure.Button key={item.name} as={Link} href={item.href} className={topNavMobileCss(isCurrent(pathname, item.href))}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4 px-2 space-y-1">
              {member ? (
                <>
                  <div className="px-3 text-sm text-gray-500">Signed in as {name}</div>
                  {mobileMemberNav.map((item) => (
                    <Disclosure.Button key={item.name} as={Link} href={item.href} className={topNavMobileCss(false)}>
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  <Disclosure.Button as="button" className={topNavMobileCss(false)} onClick={signOut}>
                    Sign out
                  </Disclosure.Button>
                </>
              ) : (
                <Disclosure.Button as="button" className={topNavMobileCss(false)} onClick={openSignIn}>
                  Sign in / Sign up
                </Disclosure.Button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
