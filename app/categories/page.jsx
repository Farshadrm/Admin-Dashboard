import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { Tags } from 'lucide-react';
export default function Categories() { return <div><Sidebar /><main className="min-h-screen lg:ml-[220px]"><Topbar /><div className="p-7"><h1 className="text-xl font-bold">Categories</h1><div className="surface mt-5 flex min-h-72 flex-col items-center justify-center"><Tags size={28} className="text-slate-300"/><h2 className="mt-3 font-semibold">Product categories</h2><p className="mt-1 text-xs text-slate-400">Categories are currently managed in the product form.</p></div></div></main></div>; }
