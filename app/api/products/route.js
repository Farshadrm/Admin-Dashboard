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
            //* Managing other errors //

        //     console.error("GET /api/products error:", e);

        // // MongoDB connection or network errors
        // if (
        //     [
        //         "MongoServerSelectionError",
        //         "MongooseServerSelectionError",
        //         "MongoNetworkError",
        //     ].includes(e?.name)
        // ) {
        //     return NextResponse.json(
        //         { message: "Database unavailable. Please try again later." },
        //         { status: 503 },
        //     );
        // }

        // // Invalid MongoDB connection string or configuration
        // if (e?.name === "MongoParseError") {
        //     return NextResponse.json(
        //         { message: "Database configuration error." },
        //         { status: 500 },
        //     );
        // }

        // // Any unexpected server error
        // return NextResponse.json(
        //     { message: "Internal server error." },
        //     { status: 500 },
        // );
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

        //* Managing other errors //
    //     if (e.code === 11000) {
    //         return NextResponse.json(
    //             { message: "Product already exists" },
    //             { status: 409 },
    //         );
    //     }
    // }

    // if (e.name === "ValidationError") {
    //         return NextResponse.json(
    //             { message: "Invalid product data" },
    //             { status: 400 },
    //         );
    //     }

    // if (e.name === "MongoServerSelectionError") {
    //         return NextResponse.json(
    //             { message: "Database unavailable" },
    //             { status: 503 },
    //         );
    //     }  
        
    //     return NextResponse.json(
    //         { message: "Internal server error" },
    //         { status: 500 },
    //     );
    }
}
