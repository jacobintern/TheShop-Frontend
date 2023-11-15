'use client'

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProfile, LoginState } from "@/stroe/userSlice";
import { RootState } from "@/app/store";
import { toggleLoginModal } from "@/stroe/loginSlice"

interface loginForm {
    id: string;
    name: string;
    placeholder: string;
    content: string;
    type: string;
};

export default function LoginModal() {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const loginLabelCss = "text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300";
    const loginInputCss = "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white";
    const formList: loginForm[] = [
        { id: "email", name: "email", placeholder: "xxxxxx@gmail.com", content: "Your email", type: "email" },
        { id: "password", name: "password", placeholder: "••••••••", content: "Your password", type: "password" },
    ];
    const loginModalCss = (stauts: Boolean): string => {
        let css = "overflow-x-hidden overflow-y-auto fixed h-modal md:h-full top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center";
        return (stauts) ? `${css} flex` : `${css} hidden`;
    };
    const loginBackgroundCss = (stauts: Boolean): string => {
        let css = "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40";
        return (stauts) ? css : `${css} hidden`;
    }
    const isShow = useSelector((state: RootState) => state.isShow);
    const dispatch = useDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) =>
        // 更新 formData 狀態，使用新的值
        setFormData({
            ...formData,
            [name]: e.target.value,
        });

    // TODO: add Call api and set user profile
    const login = async () => {
        console.log(formData);
        // 登入
        // 先給假資料
        let data: LoginState = {
            name: "jacob",
            email: "sles4511@gmail.com",
            flag: true
        }
        dispatch(setProfile(data));
        dispatch(toggleLoginModal());
    };

    return (
        <>
            <div>
                <div id="login-modal" className={loginModalCss(isShow.isShowModal)}>
                    <div className="relative w-full max-w-md px-4 h-full md:h-auto">
                        {/* Modal content  */}
                        <div className="bg-white rounded-lg shadow relative dark:bg-gray-700">
                            <div className="flex justify-end p-2">
                                <button type="button" onClick={() => dispatch(toggleLoginModal())} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                            <div className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
                                {formList.map((item, index) =>
                                    <div key={index}>
                                        <label htmlFor={item.name} className={loginLabelCss}>{item.content}</label>
                                        <input type={item.type} name={item.name} id={item.id} placeholder={item.placeholder} className={loginInputCss} onChange={(e) => handleInputChange(e, item.name)} required />
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
                                        </div>
                                        <div className="text-sm ml-3">
                                            <label htmlFor="remember" className="font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                                        </div>
                                    </div>
                                    <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot Password?</a>
                                </div>
                                <button type="button" onClick={login} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                    Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={loginBackgroundCss(isShow.isShowModal)}></div>
            </div >
        </>
    )
}