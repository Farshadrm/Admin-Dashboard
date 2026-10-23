"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import Swal from "sweetalert2";
const empty = {
    name: "",
    category: "Electronics",
    price: 0,
    stock: 0,
    status: "Active",
    description: "",
    image: "",
    brand: "",
    sku: "",
};
export default function ProductForm({ initial, productId, demoMode = false }) {
    const [data, setData] = useState({ ...empty, ...initial });
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    const change = (key, value) => setData((p) => ({ ...p, [key]: value }));
    async function submit(e) {
        e.preventDefault();
        if (!data.name.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Product name required",
                text: "Enter a name before saving",
                });
            return;
        }
        setBusy(true);
        try {
            if (demoMode) {
                await Swal.fire({
                    icon: "info",
                    title: "Demo product",
                    text: "This sample product is not stored in MongoDB. Create a new product while MongoDB is connected to test persistent editing.",
                    confirmButtonText: "OK",
                });
                router.push("/products");
                return;
            }
            const res = await fetch(
                productId ? `/api/products/${productId}` : "/api/products",
                {
                    method: productId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                },
            );
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Save failed");
            await Swal.fire({
                icon: "success",
                title: productId ? "Product updated" : "Product created",
                timer: 1300,
                showConfirmButton: false,
            });
            router.push("/products");
            router.refresh();
        } catch (err) {
            await Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: err.message || "Please try again.",
                confirmButtonText: "Try again",
            }
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <form
            onSubmit={submit}
            className="surface mx-auto max-w-4xl p-5 sm:p-7"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold">
                        {productId ? "Edit Product" : "Add Product"}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        {productId
                            ? "Update product details below."
                            : "Fill in the details to add a new product to your store."}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md p-2 text-slate-400 hover:bg-slate-100"
                    aria-label="Close"
                >
                    <X size={17} />
                </button>
            </div>
            <div className="grid gap-5 md:grid-cols-[190px_1fr]">
                <div>
                    <label className="label">Product Image</label>
                    <label className="flex min-h-[155px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-slate-400">
                        <ImagePlus size={25} />
                        <span className="mt-3 text-xs font-semibold">
                            Click to upload or drag and drop
                        </span>
                        <span className="mt-1 text-[10px]">
                            PNG, JPG up to 5MB
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                    if (f.size > 5 * 1024 * 1024) {
                                        Swal.fire(
                                            "Image too large",
                                            "Choose an image smaller than 5MB.",
                                            "warning",
                                        );
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = () =>
                                        change("image", String(reader.result));
                                    reader.readAsDataURL(f);
                                    // console.log("image added")
                                }
                            }}
                        />
                    </label>
                    {data.image && (
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                            Image selected{" "}
                            <button
                                type="button"
                                onClick={() => change("image", "")}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
                <div className="grid content-start gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="label">Product Name *</label>
                        <input
                            className="field"
                            required
                            value={data.name}
                            onChange={(e) => change("name", e.target.value)}
                            placeholder="Enter product name"
                        />
                    </div>
                    <div>
                        <label className="label">Category *</label>
                        <select
                            className="field"
                            value={data.category}
                            onChange={(e) => change("category", e.target.value)}
                        >
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Home & Kitchen</option>
                            <option>Accessories</option>
                            <option>Sports</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Brand</label>
                        <input
                            className="field"
                            value={data.brand}
                            onChange={(e) => change("brand", e.target.value)}
                            placeholder="Brand name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                        <div className="">
                            <label className="label">Price ($) *</label>
                            <input
                                className="field"
                                type="number"
                                min="0"
                                step="0.1"
                                required
                                value={data.price}
                                onChange={(e) =>
                                    change("price", Number(e.target.value))
                                }
                            />
                        </div>
                        <div className="">
                            <label className="label">Stock *</label>
                            <input
                                className="field"
                                type="number"
                                min="0"
                                required
                                value={data.stock}
                                onChange={(e) =>
                                    change("stock", Number(e.target.value))
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">SKU</label>
                        <input
                            className="field"
                            value={data.sku}
                            onChange={(e) => change("sku", e.target.value)}
                            placeholder="e.g. ST-001"
                        />
                    </div>
                    <div>
                        <label className="label">Status</label>
                        <select
                            className="field"
                            value={data.status}
                            onChange={(e) => change("status", e.target.value)}
                        >
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="label">Description</label>
                        <textarea
                            className="field min-h-[105px] resize-y"
                            value={data.description}
                            onChange={(e) =>
                                change("description", e.target.value)
                            }
                            placeholder="Enter product description..."
                        />
                    </div>
                </div>
            </div>
            <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                    type="button"
                    className="secondary"
                    onClick={() => router.back()}
                >
                    Cancel
                </button>
                <button className="primary min-w-32" disabled={busy}>
                    {busy
                        ? "Saving..."
                        : productId
                            ? "Update Product"
                            : "Save Product"}
                </button>
            </div>
        </form>
    );
}
