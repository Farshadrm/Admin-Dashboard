import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { Users } from 'lucide-react';
export default function Customers() { return <div><Sidebar /><main className="min-h-screen lg:ml-[220px]"><Topbar /><div className="p-7"><h1 className="text-xl font-bold">Customers</h1><div className="surface mt-5 flex min-h-72 flex-col items-center justify-center"><Users size={28} className="text-slate-300"/><h2 className="mt-3 font-semibold">Customer management</h2><p className="mt-1 text-xs text-slate-400">Customer records will appear here.</p></div></div></main></div>; }
