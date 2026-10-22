import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
export async function GET(_req, { params }) {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
        return NextResponse.json(
            { message: "Invalid product id" },
            { status: 400 },
        );
    try {
        await connectDB();
        const p = await Product.findById(id).lean();
        return p
            ? NextResponse.json(p)
            : NextResponse.json(
                  { message: "Product not found" },
                  { status: 404 },
              );
    } catch {
        return NextResponse.json(
            { message: "Database unavailable" },
            { status: 503 },
        );

        //* Managing other errors //
        // .
        // .
        // .
        // .
    }
}
export async function PUT(req, { params }) {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
        return NextResponse.json(
            { message: "Invalid product id" },
            { status: 400 },
        );
    try {
        await connectDB();
        const p = await Product.findByIdAndUpdate(id, await req.json(), {
            new: true,
            runValidators: true,
        });
        return p
            ? NextResponse.json(p)
            : NextResponse.json(
                  { message: "Product not found" },
                  { status: 404 },
              );
    } catch (e) {
        return NextResponse.json(
            { message: e?.message || "Could not update product" },
            { status: 400 },
        );

        //* Managing other errors //
        // .
        // .
        // .
        // .
    }
}
export async function DELETE(_req, { params }) {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
        return NextResponse.json(
            { message: "Invalid product id" },
            { status: 400 },
        );
    try {
        await connectDB();
        const p = await Product.findByIdAndDelete(id);
        return p
            ? NextResponse.json({ success: true })
            : NextResponse.json(
                  { message: "Product not found" },
                  { status: 404 },
              );
    } catch {
        return NextResponse.json(
            { message: "Could not delete product" },
            { status: 503 },
        );
        //* Managing other errors //
        // .
        // .
        // .
        // .
    }
}
