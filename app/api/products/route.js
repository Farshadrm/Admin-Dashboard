import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
export async function GET() {
    try {
        await connectDB();
        const products = await Product.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(products);
    } catch {
        return NextResponse.json(
            {
                message:
                    "Database unavailable. Check MONGODB_URI and make sure MongoDB is running.",
            },
            { status: 503 },
        );
    }
}
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (e) {
        return NextResponse.json(
            { message: e?.message || "Could not create product" },
            { status: 400 },
        );
    }
}
