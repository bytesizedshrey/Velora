import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

/**
 * Automatic Database Migration for Product Variants & Cart Cleanup
 * 1. Unsets legacy misspelled field `varients` from all documents in MongoDB.
 * 2. Ensures existing products have a valid `variants` array matching real seller data without injecting static/mock attributes.
 */
export const runAutoMigration = async () => {
  try {
    console.log("🔄 Running product variants auto-migration & DB cleanup...");

    const collection = productModel.collection;
    const cartCollection = cartModel.collection;

    // 1. Completely remove legacy misspelled field `varients` from all MongoDB documents
    await collection.updateMany({}, { $unset: { varients: 1 } });

    // 2. Fetch all raw documents from products collection
    const rawProducts = await collection.find({}).toArray();
    let migratedCount = 0;

    for (const doc of rawProducts) {
      // Clean up any mock static values injected in earlier iterations ("White T-Shirt", "Black Hoodie", fake Color attributes)
      if (doc.variants && doc.variants.length > 0) {
        let cleaned = false;
        const cleanedVariants = doc.variants.map((v, i) => {
          const vAttr = v.attributes || {};
          if (vAttr.Color === "White" || vAttr.Color === "Black" || v.title === "White T-Shirt" || v.title === "Black Hoodie" || v.title === "Black Boxy Tee") {
            cleaned = true;
            return {
              ...v,
              title: (v.title === "White T-Shirt" || v.title === "Black Hoodie" || v.title === "Black Boxy Tee") ? (doc.title || `Style ${i + 1}`) : v.title,
              attributes: {}
            };
          }
          return v;
        });

        if (cleaned) {
          await collection.updateOne(
            { _id: doc._id },
            { $set: { variants: cleanedVariants } }
          );
          migratedCount++;
        }
      } else {
        const defaultImages = (doc.images && doc.images.length > 0)
          ? doc.images
          : [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", alt: doc.title || "Product Image" }];

        const defaultVariant = {
          _id: doc._id || new mongoose.Types.ObjectId(),
          title: doc.title || "Standard",
          images: defaultImages,
          stock: doc.stock || 100,
          attributes: {},
          price: doc.price || { amount: 200, currency: "USD" }
        };

        await collection.updateOne(
          { _id: doc._id },
          { 
            $set: { variants: [defaultVariant] },
            $unset: { varients: 1 }
          }
        );
        migratedCount++;
      }
    }

    // 3. Migrate stale cart item variant references
    const updatedProducts = await collection.find({}).toArray();
    const productMap = new Map();
    updatedProducts.forEach(p => productMap.set(p._id.toString(), p));

    const rawCarts = await cartCollection.find({}).toArray();
    let updatedCartCount = 0;

    for (const cart of rawCarts) {
      let modified = false;
      const newItems = cart.items.map(item => {
        const prodId = item.product?.toString();
        const p = productMap.get(prodId);
        if (!p || !p.variants || p.variants.length === 0) return item;

        const validVariantIds = p.variants.map(v => v._id.toString());
        const currentVarId = item.variant?.toString();

        if (!validVariantIds.includes(currentVarId)) {
          modified = true;
          return {
            ...item,
            variant: p.variants[0]._id
          };
        }
        return item;
      });

      if (modified) {
        await cartCollection.updateOne({ _id: cart._id }, { $set: { items: newItems } });
        updatedCartCount++;
      }
    }

    if (migratedCount > 0 || updatedCartCount > 0) {
      console.log(`✅ Cleaned static values: ${migratedCount} product(s) and ${updatedCartCount} cart(s) updated in MongoDB.`);
    } else {
      console.log("✨ All products and carts in MongoDB are clean and synchronized.");
    }
  } catch (error) {
    console.error("⚠️ Error running product auto-migration:", error.message);
  }
};
