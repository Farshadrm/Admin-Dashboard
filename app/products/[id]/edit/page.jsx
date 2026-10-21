'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import ProductForm from '@/components/ProductForm';
import { sampleProducts } from '@/lib/sample-products';
export default function EditProductPage() { const { id } = useParams(); const [product, setProduct] = useState(null); const [loading, setLoading] = useState(true); useEffect(() => { const demo = sampleProducts.find(p => p._id === id); if (demo) {
    setProduct(demo);
    setLoading(false);
    return;
} fetch(`/api/products/${id}`).then(r => { if (!r.ok)
    throw new Error(); return r.json(); }).then(setProduct).catch(() => setProduct(false)).finally(() => setLoading(false)); }, [id]); return <div><Sidebar /><main className="min-h-screen lg:ml-[220px]"><Topbar /><div className="mx-auto max-w-[1100px] p-4 sm:p-7"><div className="mb-5 text-xs text-slate-400">Products / Edit Product</div>{loading ? <State title="Loading product..." kind="loading"/> : product ? <ProductForm productId={id} demoMode={id.startsWith('p')} initial={product}/> : <State title="Product not found" kind="empty"/>}</div></main></div>; }
function State({ title, kind }) { return <div className="surface flex min-h-64 flex-col items-center justify-center gap-3 text-slate-400">{kind === 'loading' ? '◌' : '▱'}<p>{title}</p></div>; }
