"use client";
import { Bell, Search, ChevronDown } from "lucide-react";
export default function Topbar() {
    return (
        <header className="sticky top-0 z-20 flex h-[62px] items-center justify-between border-b border-[#e9edf4] bg-white/90 px-5 pl-14 backdrop-blur lg:px-7">
            <div className="flex w-full max-w-[380px] items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-slate-400">
                <Search size={14} />
                {/* Search input still unavailable*/}
                <input
                    className="w-full bg-transparent text-xs outline-none"
                    placeholder="Search products..."
                />
            </div>
            <div className="ml-4 flex items-center gap-4">
                <button className="text-slate-500" aria-label="Notifications">
                    <Bell size={17} />
                </button>
                {/* Authorization and users database still unavailable*/}

                <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800">
                        FR
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-[11px] font-semibold">
                            Farshad Ramezani
                        </div>
                        <div className="text-[10px] text-slate-400">Admin</div>
                    </div>
                    <ChevronDown size={13} className="text-slate-400" />
                </div>
            </div>
        </header>
    );
}
