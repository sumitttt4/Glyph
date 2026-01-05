"use client";

import { BrandIdentity } from '@/lib/data';

interface MockupIPhoneHomeProps {
    brand: BrandIdentity;
    isDark?: boolean;
}

export function MockupIPhoneHome({ brand, isDark = false }: MockupIPhoneHomeProps) {
    const tokens = brand.theme.tokens[isDark ? 'dark' : 'light'];

    return (
        <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: tokens.primary }}
        >
            {/* iPhone Frame - Tilted perspective */}
            <div className="relative transform -rotate-12 translate-x-8 translate-y-4 scale-110">
                {/* Phone body */}
                <div
                    className="relative w-[280px] h-[560px] rounded-[50px] border-[12px] border-stone-800 bg-black shadow-2xl overflow-hidden"
                    style={{ boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }}
                >
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-20" />

                    {/* Screen content */}
                    <div className="absolute inset-0 bg-black pt-14">
                        {/* Status bar */}
                        <div className="flex justify-between items-center px-8 pb-4">
                            <span className="text-white text-sm font-semibold">9:41</span>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3" />
                                </svg>
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                                </svg>
                                <div className="w-6 h-3 bg-white rounded-sm ml-1">
                                    <div className="w-4 h-full bg-green-500 rounded-sm" />
                                </div>
                            </div>
                        </div>

                        {/* App icons grid */}
                        <div className="px-6 pt-8">
                            <div className="grid grid-cols-4 gap-4">
                                {/* Generated Brand App Icon - Featured */}
                                <div className="flex flex-col items-center gap-1">
                                    <div
                                        className="w-14 h-14 rounded-[14px] flex items-center justify-center bg-white shadow-lg"
                                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                                    >
                                        <svg
                                            viewBox={brand.shape.viewBox || "0 0 24 24"}
                                            className="w-8 h-8"
                                            fill={tokens.primary}
                                        >
                                            <path d={brand.shape.path} />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[10px] font-medium truncate w-14 text-center">
                                        {brand.name.length > 8 ? brand.name.slice(0, 8) : brand.name}
                                    </span>
                                </div>

                                {/* Calendar */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-14 h-14 rounded-[14px] bg-white flex flex-col items-center justify-center">
                                        <span className="text-red-500 text-[8px] font-bold">MON</span>
                                        <span className="text-black text-lg font-light">6</span>
                                    </div>
                                    <span className="text-white text-[10px]">Calendar</span>
                                </div>

                                {/* Photos */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[10px]">Photos</span>
                                </div>

                                {/* Camera */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-14 h-14 rounded-[14px] bg-stone-800 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[10px]">Camera</span>
                                </div>
                            </div>

                            {/* Second row */}
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {/* Mail */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-14 h-14 rounded-[14px] bg-blue-500 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[10px]">Mail</span>
                                </div>

                                {/* Notes */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-14 h-14 rounded-[14px] bg-yellow-400 flex items-center justify-center">
                                        <svg className="w-7 h-7 text-yellow-700" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[10px]">Notes</span>
                                </div>

                                {/* Settings */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-14 h-14 rounded-[14px] bg-stone-600 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[10px]">Settings</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side buttons */}
                    <div className="absolute -left-[14px] top-28 w-[3px] h-8 bg-stone-700 rounded-l" />
                    <div className="absolute -left-[14px] top-40 w-[3px] h-12 bg-stone-700 rounded-l" />
                    <div className="absolute -left-[14px] top-56 w-[3px] h-12 bg-stone-700 rounded-l" />
                    <div className="absolute -right-[14px] top-36 w-[3px] h-16 bg-stone-700 rounded-r" />
                </div>
            </div>
        </div>
    );
}
