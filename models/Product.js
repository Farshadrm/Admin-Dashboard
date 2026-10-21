import { Schema, models, model } from "mongoose";
const ProductSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, default: 0 },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
        brand: { type: String, default: "Store brand" },
        sku: { type: String, default: "" },
        specifications: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true },
);
export default models.Product || model("Product", ProductSchema);
