import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ShoppingBag } from 'lucide-react';
export default function Orders() { return <div><Sidebar /><main className="min-h-screen lg:ml-[220px]"><Topbar /><div className="p-7"><h1 className="text-xl font-bold">Orders</h1><div className="surface mt-5 flex min-h-72 flex-col items-center justify-center text-center"><ShoppingBag size={28} className="text-slate-300"/><h2 className="mt-3 font-semibold">No orders yet</h2><p className="mt-1 text-xs text-slate-400">Order management can be connected when checkout is implemented.</p></div></div></main></div>; }
