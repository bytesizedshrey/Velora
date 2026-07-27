import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

/**
 * Aggregation pipeline for fetching user cart with populated products and matched variant details.
 * Preserves full product.variants array while attaching matched variant object to `items.variantDetails` and `items.selectedVariant`.
 */
export const getCartAggregation = async (userId) => {
  const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  console.log("📊 [Cart Aggregation Pipeline] Starting aggregation for userId:", userObjectId.toString());

  // Check if cart is empty before aggregation to avoid unwind producing ghost empty item documents
  const rawCart = await cartModel.findOne({ user: userObjectId });
  if (!rawCart || !rawCart.items || rawCart.items.length === 0) {
    console.log("🛒 [Cart Aggregation] Cart is completely empty for user:", userObjectId.toString());
    return {
      _id: rawCart?._id || null,
      user: userObjectId,
      items: [],
      totalPrice: 0,
      currency: "USD",
    };
  }

  const result = await cartModel.aggregate([
    // Stage 1: Match user cart
    { $match: { user: userObjectId } },

    // Stage 2: Unwind items array (only when items are present)
    { $unwind: { path: "$items", preserveNullAndEmptyArrays: false } },

    // Stage 3: Lookup product document from products collection
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.product"
      }
    },

    // Stage 4: Unwind items.product array safely (preserving product.variants array)
    { $unwind: { path: "$items.product", preserveNullAndEmptyArrays: true } },

    // Stage 5: Find matching variant object from items.product.variants using $filter
    {
      $addFields: {
        "items.selectedVariant": {
          $arrayElemAt: [
            {
              $filter: {
                input: { $ifNull: ["$items.product.variants", []] },
                as: "v",
                cond: {
                  $or: [
                    { $eq: ["$$v._id", "$items.variant"] },
                    { $eq: [{ $toString: "$$v._id" }, { $toString: "$items.variant" }] },
                    { $eq: [{ $toString: "$$v._id" }, { $toString: "$items.varient" }] }
                  ]
                }
              }
            },
            0
          ]
        }
      }
    },

    // Stage 6: Set variantDetails and price dynamically from matched selectedVariant
    {
      $addFields: {
        "items.variantDetails": "$items.selectedVariant",
        "items.price": {
          $cond: {
            if: { $gt: ["$items.selectedVariant.price.amount", 0] },
            then: "$items.selectedVariant.price",
            else: {
              $cond: {
                if: { $gt: ["$items.price.amount", 0] },
                then: "$items.price",
                else: "$items.product.price"
              }
            }
          }
        }
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
    },

    // Stage 8: Calculate totalPrice and currency dynamically
    {
      $addFields: {
        totalPrice: {
          $reduce: {
            input: "$items",
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $multiply: [
                    { $ifNull: ["$$this.quantity", 1] },
                    { $ifNull: ["$$this.price.amount", "$$this.product.price.amount", 0] }
                  ]
                }
              ]
            }
          }
        },
        currency: {
          $ifNull: [
            { $arrayElemAt: ["$items.price.currency", 0] },
            { $arrayElemAt: ["$items.product.price.currency", 0] },
            "USD"
          ]
        }
      }
    }
  ]);

  const finalCart = result[0] || { _id: rawCart?._id, user: userObjectId, items: [], totalPrice: 0, currency: "USD" };

  if (finalCart && Array.isArray(finalCart.items)) {
    finalCart.items = finalCart.items.filter(item => item && (item.product?._id || item.product || item.variant));
  }

  console.log("✨ [Cart Aggregation] Final Response Payload:", JSON.stringify(finalCart, null, 2));
  return finalCart;
};
