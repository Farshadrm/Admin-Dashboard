"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BriefcaseBusiness,
    House,
    ShoppingBag,
    Users,
    Tags,
    Settings,
    Diamond,
    Moon,
    MoreHorizontal,
    X,
} from "lucide-react";
import { useState } from "react";

const nav = [
    { label: "Dashboard", href: "/", Icon: House },
    { label: "Products", href: "/products", Icon: ShoppingBag },
    { label: "Orders", href: "/orders", Icon: BriefcaseBusiness },
    { label: "Customers", href: "/customers", Icon: Users },
    { label: "Categories", href: "/categories", Icon: Tags },
    { label: "Settings", href: "/settings", Icon: Settings },
];

const mobileNav = nav.slice(0, 3);
const moreNav = nav.slice(3);

export default function Sidebar() {
    const path = usePathname();
    const [moreOpen, setMoreOpen] = useState(false);

    const isActive = (href) => {
        if (href === "/") return path === "/";
        return path === href || path.startsWith(`${href}/`);
    };

    const moreActive = moreNav.some((item) => isActive(item.href));

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[220px] flex-col border-r border-[#e9edf4] bg-white px-4 py-5 lg:flex">
                <Link
                    href="/products"
                    className="mb-7 flex items-center gap-2 px-2 text-[15px] font-bold"
                >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white">
                        <Diamond size={16} />
                    </span>
                    StoreAdmin
                </Link>

                <nav className="flex flex-col gap-1">
                    {nav.map(({ label, href, Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium transition-colors ${
                                isActive(href)
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-800 hover:bg-slate-50"
                            }`}
                        >
                            <Icon size={15} />
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto flex items-center gap-3 border-t border-slate-100 px-2 pt-4 text-xs text-slate-500">
                    <Moon size={15} />
                    Light Mode
                </div>
            </aside>

            {/* Mobile More Menu Overlay */}
            {moreOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                        onClick={() => setMoreOpen(false)}
                    />

                    <div className="fixed bottom-[76px] right-3 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl lg:hidden">
                        <div className="mb-1 flex items-center justify-between px-2 py-2">
                            <span className="text-sm font-semibold text-slate-700">
                                More options
                            </span>

                            <button
                                type="button"
                                onClick={() => setMoreOpen(false)}
                                aria-label="Close more menu"
                                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {moreNav.map(({ label, href, Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setMoreOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                    isActive(href)
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <Icon size={17} />
                                {label}
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 z-40 grid w-full grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden">
                {mobileNav.map(({ label, href, Icon }) => (
                    <Link
                        key={label}
                        href={href}
                        className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors ${
                            isActive(href)
                                ? "text-blue-600"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <Icon size={21} strokeWidth={isActive(href) ? 2.4 : 1.8} />
                        <span>{label}</span>
                    </Link>
                ))}

                <button
                    type="button"
                    onClick={() => setMoreOpen(!moreOpen)}
                    aria-expanded={moreOpen}
                    aria-label="More navigation options"
                    className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors ${
                        moreOpen || moreActive
                            ? "text-blue-600"
                            : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                    {moreOpen ? (
                        <X size={21} />
                    ) : (
                        <MoreHorizontal size={21} />
                    )}
                    <span>More</span>
                </button>
            </nav>
        </>
    );
}
