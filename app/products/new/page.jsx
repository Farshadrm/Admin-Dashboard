import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProductForm from "@/components/ProductForm";
export default function NewProductPage() {
    return (
        <div>
            <Sidebar />
            <main className="min-h-screen lg:ml-[220px]">
                <Topbar />
                <div className="mx-auto max-w-[1100px] p-4 sm:p-7">
                    <div className="mb-5 text-xs text-slate-400">
                        Products /{" "}
                        <span className="text-slate-700">Add Product</span>
                    </div>
                    <ProductForm />
                </div>
            </main>
        </div>
    );
}
