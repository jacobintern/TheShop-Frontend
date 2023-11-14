'use client'

import React, { useState, Fragment, useEffect } from "react";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import { setLogout } from "@/stroe/userSlice";
import { toggleLoginModal } from "@/stroe/loginSlice"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface topNav {
  name: string;
  href: string;
  current: boolean;
};

interface userNav {
  name: string;
  href: string;
  isLogin: boolean;
};

const navList: topNav[] = [
  { name: 'Home', href: '#', current: false },
  { name: 'All', href: '#', current: false },
  { name: 'Life', href: '#', current: false },
  { name: 'BodyLuv', href: '#', current: false },
  { name: 'Others', href: '#', current: false },
];

const userNav: userNav[] = [
  { name: 'Profile', href: '#', isLogin: true },
  { name: 'Orders', href: '#', isLogin: true },
  { name: 'Sign out', href: '#', isLogin: true },
  { name: 'Sign in/Sign Up', href: '#', isLogin: false },
];

export default function Navigationbar() {
  const userState = useSelector((state: RootState) => state.user);

  const [navigation, setNavigation] = useState<topNav[]>(navList);

  const clickedTopNav = (current: (Boolean)): string => {
    let css = [(current ? 'bg-gray-900 text-white' : 'text-black-300 hover:bg-gray-700 hover:text-white'),
      'rounded-md px-3 py-2 text-sm font-medium'];
    return css.join(' ');
  }

  const clickedTopNavMobile = (current: (Boolean)): string => {
    let css = [(current ? 'bg-gray-900 text-white' : 'text-black-300 hover:bg-gray-700 hover:text-white'),
      'block rounded-md px-3 py-2 text-base font-medium'];
    return css.join(' ');
  }

  const clickedUserNav = (active: (Boolean)): string => {
    let css = [(active ? 'bg-gray-100' : ''), 'block px-4 py-2 text-sm text-gray-700']
    return css.join(' ')
  }

  const btnClick = (index: number) => {
    const updatedNavigation = navigation.map((item, i) => ({
      ...item,
      current: i === index,
    }));

    setNavigation(updatedNavigation);
  }

  const dispatch = useDispatch();

  return (
    <Disclosure as="nav" className='bg-white-800'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0"> flag 位置 </div>
                <div className="hidden md:block">
                  <div className='ml-10 flex items-baseline space-x-4'>
                    {navigation.map((item, index) => (
                      <a key={item.name} href={item.href} className={clickedTopNav(item.current)} onClick={() => btnClick(index)}> {item.name} </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <img className="h-8 w-8 rounded-full" src="/usr.png" alt="" />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">

                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNav
                          .filter(item => item.isLogin == userState.flag)
                          .map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a href={item.href} className={clickedUserNav(active)} onClick={() => dispatch(toggleLoginModal())} > {item.name} </a>
                              )}
                            </Menu.Item>
                          ))
                        }
                      </Menu.Items>

                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open
                    ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={clickedTopNavMobile(item.current)}
                  aria-current={item.current ? 'page' : undefined}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src='/usr.png' alt="" />
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNav
                  .filter(item => item.isLogin == userState.flag)
                  .map((item) => (
                    <Disclosure.Button key={item.name} as="a" href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-black-400 hover:bg-gray-700 hover:text-white">
                      {item.name}
                    </Disclosure.Button>
                  ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )
      }
    </Disclosure >
  )
}
