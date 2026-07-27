import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

/**
 * Aggregation pipeline for fetching user cart with populated products and unwound/matched variants.
 * Supports $unwind and $match for exact variant matching by ObjectId or string comparison.
 */
export const getCartAggregation = async (userId) => {
  const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  const result = await cartModel.aggregate([
    // Stage 1: Match user cart
    { $match: { user: userObjectId } },

    // Stage 2: Unwind items array
    { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },

    // Stage 3: Lookup product document from products collection
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.product"
      }
    },

    // Stage 4: Unwind items.product array
    { $unwind: { path: "$items.product", preserveNullAndEmptyArrays: true } },

    // Stage 5: Unwind items.product.variants with preserveNullAndEmptyArrays
    { $unwind: { path: "$items.product.variants", preserveNullAndEmptyArrays: true } },

    // Stage 6: Match variant._id to stored items.variant ID (supporting variant & legacy varient fields)
    {
      $match: {
        $or: [
          { "items.product.variants": { $exists: false } },
          { "items.product.variants": null },
          { $expr: { $eq: ["$items.product.variants._id", "$items.variant"] } },
          { $expr: { $eq: [{ $toString: "$items.product.variants._id" }, { $toString: "$items.variant" }] } },
          { $expr: { $eq: [{ $toString: "$items.product.variants._id" }, { $toString: "$items.varient" }] } }
        ]
      }
    },

    // Stage 7: Re-group items back into cart
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        items: { $push: "$items" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" }
      }
    }
  ]);

  return result[0] || null;
};
