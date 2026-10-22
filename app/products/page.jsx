"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Loader,
    Trash,
    SquarePen,
    PackageSearch,
    FolderClosed,
    Plus,
    Search,
    SlidersHorizontal,
    LayoutGrid,
    List,
    MoreVertical,
    Pencil,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Package,
    CircleDollarSign,
    X,
    Check,
    LoaderCircle,
    AlertCircle,
    ShoppingBag,
} from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { confirmDelete } from "@/utils/notifications";
import { sampleProducts } from "@/lib/sample-products";
const money = (n) => "$" + Number(n).toFixed(2);

function Stat({ title, value, icon, tone }) {
    const styles = {
        green: "bg-emerald-50 text-emerald-600",
        red: "bg-red-50 text-red-500",
        purple: "bg-violet-50 text-violet-600",
    };
    return (
        <div className="hidden surface items-center justify-start gap-5 px-4 py-4 sm:flex lg:flex">
            <div
                className={`grid h-8 w-10 place-items-center rounded ${styles[tone]} sm:rounded-full sm:h-10 sm:w-10`}
            >
                {icon}
            </div>
            <div>
                <p className="text-[11px] text-slate-400">{title}</p>
                <p className="mt-1 text-sm font-bold sm:text-xl">{value}</p>
            </div>
        </div>
    );
}

function ProductImage({ p }) {
    return (
        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 text-2xl">
            {p.image?.startsWith("data:") ||
            p.image?.startsWith("http") ||
            p.image?.startsWith("/uploads/") ? (
                <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
            ) : (
                p.image || ""
            )}
        </div>
    );
}

export default function ProductsPage() {
    const [products, setProducts] = useState(sampleProducts);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [status, setStatus] = useState("All Status");
    const [sort, setSort] = useState("Newest");
    const [page, setPage] = useState(1);
    // const [filterOpen, setFilterOpen] = useState(false);
    const [view, setView] = useState("table");
    const [menu, setMenu] = useState("");
    const perPage = 7;
    useEffect(() => {
        fetch("/api/products")
            .then(async (r) => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then((d) => {
                setProducts(d.map((p) => ({ ...p, image: p.image || "" })));
                setError(false);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);
    const filtered = useMemo(() => {
        let a = products.filter(
            (p) =>
                p.name.toLowerCase().includes(query.toLowerCase()) &&
                (category === "All Categories" || p.category === category) &&
                (status === "All Status" ||
                    (status === "Out of Stock"
                        ? p.stock === 0
                        : p.status === status)),
        );
        if (sort === "Price: Low to High") a.sort((x, y) => x.price - y.price);
        else if (sort === "Price: High to Low")
            a.sort((x, y) => y.price - x.price);
        else if (sort === "Name A-Z")
            a.sort((x, y) => x.name.localeCompare(y.name));
        return a;
    }, [products, query, category, status, sort]);
    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    const visible = filtered.slice((page - 1) * perPage, page * perPage);
    const categories = Array.from(new Set(products.map((p) => p.category)));
    async function remove(p) {
        setMenu("");
        const result = await confirmDelete();
        if (!result.isConfirmed) return;
        try {
            if (!p._id.startsWith("p")) {
                const r = await fetch(`/api/products/${p._id}`, {
                    method: "DELETE",
                });
                if (!r.ok) throw new Error("Delete request failed");
            }
            setProducts((old) => old.filter((x) => x._id !== p._id));
            await Swal.fire({
                icon: "success",
                title: "Product deleted",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire(
                "Could not delete",
                "Check the database connection and try again.",
                "error",
            );
        }
    }
    return (
        <div>
            <Sidebar />
            <main className="min-h-screen lg:ml-[220px]">
                <Topbar />
                <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-7">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-bold">Products</h1>
                            <p className="mt-1 text-xs text-slate-400">
                                Manage your store products
                            </p>
                        </div>
                        <Link href="/products/new" className="primary">
                            <Plus size={15} /> Add Product
                        </Link>
                    </div>
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            <AlertCircle size={16} /> Showing demo products
                            because MongoDB is not connected. Configure{" "}
                            <code>.env.local</code> and start MongoDB to use
                            persistent data.
                        </div>
                    )}
                    <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <Stat
                            title="Total Products"
                            value={products.length}
                            icon={<Package size={18} />}
                            tone="green"
                        />
                        <Stat
                            title="Out of Stock"
                            value={products.filter((p) => p.stock === 0).length}
                            icon={<PackageSearch size={18} />}
                            tone="red"
                        />
                        <Stat
                            title="Categories"
                            value={categories.length}
                            icon={<FolderClosed size={18} />}
                            tone="purple"
                        />
                    </div>
                    <section className="surface overflow-hidden">
                        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center">
                            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                                <Search
                                    size={15}
                                    className="shrink-0 text-slate-400"
                                />
                                <input
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full min-w-0 text-xs outline-none"
                                    placeholder="Search by product name..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex">
                                <select
                                    className="field min-w-0 py-2 text-xs xl:w-36"
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option>All Categories</option>
                                    {categories.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                <select
                                    className="field min-w-0 py-2 text-xs xl:w-32"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option>All Status</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Out of Stock</option>
                                </select>
                                <select
                                    className="field col-span-2 py-2 text-xs sm:col-span-1 xl:w-40"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="Newest">
                                        Sort by Newest
                                    </option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Name A-Z</option>
                                </select>
                                {/* <button
                                    className="secondary flex items-center justify-center gap-2"
                                    onClick={() => setFilterOpen(true)}
                                >
                                    <SlidersHorizontal size={14} /> Filters
                                </button> */}
                                <div className="hidden items-center rounded-lg border border-slate-200 p-1 md:flex">
                                    <button
                                        onClick={() => setView("table")}
                                        className={`rounded p-1.5 ${view === "table" ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}
                                    >
                                        <List size={15} />
                                    </button>
                                    <button
                                        onClick={() => setView("grid")}
                                        className={`rounded p-1.5 ${view === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}
                                    >
                                        <LayoutGrid size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {loading ? (
                            <div className="flex min-h-64 flex-col items-center justify-center text-slate-400">
                                <Loader className="animate-spin" size={24} />
                                <p className="mt-3 text-lg font-bold text-black">
                                    Loading products...
                                </p>
                                <p className="mt-3 text-xs">
                                    Please wait a few moments...
                                </p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
                                <div className="mb-1 p-2 text-blue-500">
                                    <Package size={37} />
                                </div>
                                <h3 className="font-semibold">
                                    No products found
                                </h3>
                                <p className="mt-1 text-xs text-slate-400">
                                    Try adjusting your search or filters.
                                </p>
                                <button
                                    className="secondary mt-4"
                                    onClick={() => {
                                        setQuery("");
                                        setCategory("All Categories");
                                        setStatus("All Status");
                                    }}
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : view === "table" ? (
                            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600 scroll-smooth">
                                <table className="w-full min-w-[800px] text-left ">
                                    <thead className="bg-slate-50/80 text-[10px] uppercase tracking-wide text-slate-700">
                                        <tr>
                                            {[
                                                "",
                                                "Image",
                                                "Name",
                                                "Category",
                                                "Price",
                                                "Stock",
                                                "Status",
                                                "Actions",
                                            ].map((x, i) => (
                                                <th
                                                    key={i}
                                                    className="px-3 py-3 font-semibold first:w-8"
                                                >
                                                    {x}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visible.map((p) => (
                                            <tr
                                                key={p._id}
                                                className="border-t border-slate-100 hover:bg-slate-50/60 "
                                            >
                                                <td className="px-3 py-3">
                                                    <input
                                                        type="checkbox"
                                                        aria-label={`Select ${p.name}`}
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <ProductImage p={p} />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <Link
                                                        href={`/products/${p._id}`}
                                                        className="font-semibold hover:text-blue-600"
                                                    >
                                                        {p.name}
                                                    </Link>
                                                    <div className="mt-1 text-[10px] text-slate-400">
                                                        {p.brand ||
                                                            "Store brand"}
                                                        {p.sku
                                                            ? ` · ${p.sku}`
                                                            : ""}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span
                                                        className={`rounded-full ${
                                                            p.category ===
                                                            "Electronics"
                                                                ? "bg-blue-100 text-blue-600"
                                                                : p.category ===
                                                                    "Fashion"
                                                                  ? "bg-orange-100 text-orange-600"
                                                                  : p.category ===
                                                                      "Home & Kitchen"
                                                                    ? "bg-purple-100 text-purple-600"
                                                                    : "bg-gray-100 text-gray-600"
                                                        } px-2 py-1 text-[10px] text-blue-600`}
                                                    >
                                                        {p.category}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 font-medium">
                                                    {money(p.price)}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span
                                                        className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${p.stock ? "bg-emerald-500" : "bg-red-500"}`}
                                                    />
                                                    <span
                                                        className={`text-[11px] ${p.stock ? "text-slate-500" : "text-red-500"}`}
                                                    >
                                                        {p.stock
                                                            ? `In Stock (${p.stock})`
                                                            : "Out of Stock (0)"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span
                                                        className={`status ${p.status === "Active" && p.stock > 0 ? "status-active" : "status-inactive"}`}
                                                    >
                                                        {p.stock === 0
                                                            ? "Inactive"
                                                            : p.status}
                                                    </span>
                                                </td>
                                                <td className="relative px-3 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            title="Edit"
                                                            href={`/products/${p._id}/edit`}
                                                            className="rounded p-1.5 bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                                        >
                                                            <SquarePen
                                                                size={14}
                                                            />
                                                        </Link>
                                                        <button
                                                            title="More actions"
                                                            onClick={() =>
                                                                setMenu(
                                                                    menu ===
                                                                        p._id
                                                                        ? ""
                                                                        : p._id,
                                                                )
                                                            }
                                                            className="rounded p-1.5 text-slate-400 hover:bg-slate-100"
                                                        >
                                                            <MoreVertical
                                                                size={14}
                                                            />
                                                        </button>
                                                        {menu === p._id && (
                                                            <div className="absolute right-6 top-10 z-10 w-36 rounded-lg border border-slate-100 bg-white p-1 shadow-xl">
                                                                <Link
                                                                    href={`/products/${p._id}`}
                                                                    className="flex items-center gap-2 rounded px-3 py-2 text-xs hover:bg-slate-50"
                                                                >
                                                                    <Eye
                                                                        size={
                                                                            13
                                                                        }
                                                                    />{" "}
                                                                    View details
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        remove(
                                                                            p,
                                                                        )
                                                                    }
                                                                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            13
                                                                        }
                                                                    />{" "}
                                                                    Delete
                                                                    product
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                                {visible.map((p) => (
                                    <div
                                        key={p._id}
                                        className="rounded-xl border border-slate-100 p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <ProductImage p={p} />
                                            <span
                                                className={`status ${p.status === "Active" && p.stock ? "status-active" : "status-inactive"}`}
                                            >
                                                {p.stock
                                                    ? p.status
                                                    : "Out of Stock"}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/products/${p._id}`}
                                            className="mt-3 block font-semibold"
                                        >
                                            {p.name}
                                        </Link>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {p.category}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <b>{money(p.price)}</b>
                                            <div className="flex gap-2">
                                                <Link
                                                    className="secondary p-2"
                                                    href={`/products/${p._id}`}
                                                >
                                                    <Eye size={14} />
                                                </Link>
                                                <Link
                                                    className="secondary p-2"
                                                    href={`/products/${p._id}/edit`}
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                            <span className="text-[11px] text-slate-400">
                                Showing{" "}
                                {filtered.length ? (page - 1) * perPage + 1 : 0}
                                –{Math.min(page * perPage, filtered.length)} of{" "}
                                {filtered.length} products
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    <ChevronLeft size={15} />
                                </button>
                                {Array.from({ length: pages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`h-7 min-w-7 rounded px-2 text-[11px] ${page === i + 1 ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                                    disabled={page === pages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            {/* {filterOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-end bg-slate-900/30"
                    onClick={() => setFilterOpen(false)}
                >
                    <div
                        className="h-full w-full max-w-sm bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-7 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                Filter Products
                            </h2>
                            <button onClick={() => setFilterOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <label className="label">Category</label>
                        <select
                            className="field mb-6"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>All Categories</option>
                            {categories.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                        <label className="label">Stock Status</label>
                        <select
                            className="field mb-7"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Out of Stock</option>
                        </select>
                        <div className="absolute bottom-0 right-0 flex w-full max-w-sm gap-3 border-t bg-white p-5">
                            <button
                                className="secondary flex-1"
                                onClick={() => {
                                    setCategory("All Categories");
                                    setStatus("All Status");
                                }}
                            >
                                Reset
                            </button>
                            <button
                                className="primary flex-1"
                                onClick={() => {
                                    setPage(1);
                                    setFilterOpen(false);
                                }}
                            >
                                <Check size={14} /> Apply
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}
