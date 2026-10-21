import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { Settings } from 'lucide-react';
export default function SettingsPage() { return <div><Sidebar /><main className="min-h-screen lg:ml-[220px]"><Topbar /><div className="p-7"><h1 className="text-xl font-bold">Settings</h1><div className="surface mt-5 flex min-h-72 flex-col items-center justify-center"><Settings size={28} className="text-slate-300"/><h2 className="mt-3 font-semibold">Store settings</h2><p className="mt-1 text-xs text-slate-400">Store configuration options can be added here.</p></div></div></main></div>; }
