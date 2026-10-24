"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Pencil,
    CalendarDays,
    Barcode,
    Package,
    Trash2,
    ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { sampleProducts } from "@/lib/sample-products";
import { confirmDelete } from "@/utils/notifications";

function Meta({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 text-xs">
            <span className="text-slate-400">{icon}</span>
            <div>
                <p className="text-slate-400">{label}</p>
                <p className="mt-1 font-medium">{value}</p>
            </div>
        </div>
    );
}
function State({ title }) {
    return (
        <div className="surface flex min-h-64 flex-col items-center justify-center gap-3 text-slate-400">
            <Package size={25} />
            <p>{title}</p>
            <Link href="/products" className="primary mt-2">
                Back to products
            </Link>
        </div>
    );
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [p, setP] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const demo = sampleProducts.find((x) => x._id === id);
        if (demo){
            setP(demo);
            setLoading(false);
            return;
        }
        fetch(`/api/products/${id}`)
            .then((r) => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then(setP)
            .catch(() => setP(false))
            .finally(() => setLoading(false));
    }, [id]);
    async function del() {
        const a = await confirmDelete();
        if (!a.isConfirmed) return;
        try {
            const r = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (!r.ok) throw new Error();
            await Swal.fire("Deleted", "Product was deleted.", "success");
            router.push("/products");
        } catch {
            Swal.fire(
                "Delete failed",
                "Demo products cannot be deleted from the database. Connect MongoDB and add a real product first.",
                "error",
            );
        }
    }
    return (
        <div>
            <Sidebar />
            <main className="min-h-screen lg:ml-[220px]">
                <Topbar />
                <div className="mx-auto max-w-[1150px] p-4 sm:p-7">
                    <div className="mb-5 flex items-center justify-between">
                        <Link
                            href="/products"
                            className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-600"
                        >
                            <ArrowLeft size={15} /> Back to Products
                        </Link>
                        {p && (
                            <div className="flex gap-2">
                                <button
                                    className="secondary flex items-center gap-2"
                                    onClick={del}
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                                <Link
                                    className="primary"
                                    href={`/products/${id}/edit`}
                                >
                                    <Pencil size={14} /> Edit
                                </Link>
                            </div>
                        )}
                    </div>
                    {loading ? (
                        <State title="Loading product details..." />
                    ) : !p ? (
                        <State title="Product not found" />
                    ) : (
                        <>
                            <div className="surface p-5 sm:p-7">
                                <div className="flex flex-col gap-6 md:flex-row">
                                    <div className="grid min-h-52 w-full max-w-[260px] place-items-center rounded-xl bg-slate-50 text-7xl">
                                        {p.image?.startsWith("data:") ||
                                        p.image?.startsWith("http") ||
                                        p.image?.startsWith("/uploads") ? (
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="h-full max-h-60 w-full rounded-xl object-contain"
                                            />
                                        ) : (
                                            p.image || ""
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h1 className="text-2xl font-bold">
                                                {p.name}
                                            </h1>
                                            <span
                                                className={`status ${p.status === "Active" && p.stock ? "status-active" : "status-inactive"}`}
                                            >
                                                {p.stock
                                                    ? p.status
                                                    : "Out of Stock"}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-2xl font-bold">
                                            ${Number(p.price).toFixed(2)}
                                        </p>
                                        <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] text-blue-600">
                                            {p.category}
                                        </span>
                                        <p
                                            className={`mt-4 text-xs ${p.stock ? "text-emerald-600" : "text-red-500"}`}
                                        >
                                            ●{" "}
                                            {p.stock
                                                ? `In Stock (${p.stock})`
                                                : "Out of Stock"}
                                        </p>
                                        <p className="mt-4 max-w-2xl leading-6 text-slate-500">
                                            {p.description ||
                                                "No description has been added for this product yet."}
                                        </p>
                                    </div>
                                </div>
                                <div className="my-7 grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
                                    <Meta
                                        icon={<Package size={15} />}
                                        label="Brand"
                                        value={p.brand || "—"}
                                    />
                                    <Meta
                                        icon={<Barcode size={15} />}
                                        label="SKU"
                                        value={p.sku || "—"}
                                    />
                                    <Meta
                                        icon={<CalendarDays size={15} />}
                                        label="Created At"
                                        value={
                                            p.createdAt
                                                ? new Date(
                                                      p.createdAt,
                                                  ).toLocaleDateString()
                                                : "Apr 12, 2025"
                                        }
                                    />
                                    <Meta
                                        icon={<CalendarDays size={15} />}
                                        label="Updated At"
                                        value={
                                            p.updatedAt
                                                ? new Date(
                                                      p.updatedAt,
                                                  ).toLocaleDateString()
                                                : "May 1, 2025"
                                        }
                                    />
                                </div>
                                <h2 className="mb-3 font-bold">
                                    Specifications
                                </h2>
                                <div className="overflow-hidden rounded-lg border border-slate-100">
                                    {[
                                        ["Color", "Black"],
                                        ["Connectivity", "Bluetooth 5.0"],
                                        ["Battery Life", "Up to 30 hours"],
                                        ["Weight", "250 g"],
                                    ].map(([k, v]) => (
                                        <div
                                            key={k}
                                            className="grid grid-cols-2 border-b border-slate-100 px-4 py-3 text-xs last:border-0"
                                        >
                                            <span className="text-slate-400">
                                                {k}
                                            </span>
                                            <span>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <h2 className="mb-3 mt-7 font-bold">
                                Related Products
                            </h2>

                            <div className="grid gap-3 grid-cols-3">
                                {sampleProducts
                                    .filter((x) => x._id !== id)
                                    .slice(0, 3)
                                    .map((x) => (
                                        <Link
                                            key={x._id}
                                            href={`/products/${x._id}`}
                                            className="surface items-center gap-3 p-3 hover:border-blue-200 sm:flex"
                                        >
                                            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-50">
                                                {x.image ? (
                                                    <img
                                                        src={x.image}
                                                        alt={x.name}
                                                        className="h-full w-full object-contain"
                                                        onError={(e) => {
                                                            console.error(
                                                                "Failed to load image:",
                                                                x.image,
                                                            );
                                                        }}
                                                    />
                                                ) : (
                                                    <Package
                                                        size={22}
                                                        className="text-slate-300"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <b className="block truncate text-xs">
                                                    {x.name}
                                                </b>

                                                <span className="mt-1 block text-xs text-slate-500">
                                                    $
                                                    {Number(x.price).toFixed(2)}
                                                </span>
                                            </div>

                                            <ChevronRight
                                                className="ml-auto shrink-0 text-slate-300"
                                                size={15}
                                            />
                                        </Link>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
