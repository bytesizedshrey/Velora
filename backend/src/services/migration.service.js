import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

/**
 * Automatic Database Migration for Product Variants & Cart Cleanup
 * 1. Unsets and removes legacy misspelled field `varients` from all documents in MongoDB.
 * 2. Rewrites all product documents to contain 3 distinct variant objects in `variants` array.
 * 3. Migrates stale cart item variant IDs to point to valid active variant IDs in products collection.
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
      const docImages = doc.images || [];

      // Always populate multi-variant array if <= 1 variant or if images exist
      if (docImages.length > 1 || !doc.variants || doc.variants.length <= 1) {
        const newVariants = docImages.map((imgObj, i) => {
          const urlStr = String(imgObj?.url || imgObj || '').toLowerCase();
          const altStr = String(imgObj?.alt || '').toLowerCase();

          let title = `Variant ${i + 1}`;
          let color = i % 2 === 0 ? "Black" : "White";

          if (urlStr.includes("white") || altStr.includes("white") || urlStr.includes("02") || urlStr.includes("g2")) {
            title = "White T-Shirt";
            color = "White";
          } else if (urlStr.includes("hoodie") || altStr.includes("hoodie") || i === 0) {
            title = "Black Hoodie";
            color = "Black";
          } else if (urlStr.includes("boxy") || altStr.includes("boxy") || i === 2) {
            title = "Black Boxy Tee";
            color = "Black";
          }

          const baseAmount = Number(doc.price?.amount || 200);
          const priceAmount = i === 1 ? Math.max(10, baseAmount - 10) : i === 2 ? Math.max(10, baseAmount - 20) : baseAmount;

          return {
            _id: new mongoose.Types.ObjectId(),
            title,
            images: [imgObj],
            stock: 100 - (i * 15),
            attributes: {
              Color: color,
              Style: title
            },
            price: {
              amount: priceAmount,
              currency: doc.price?.currency || "USD"
            },
            createdAt: new Date(),
            updatedAt: new Date()
          };
        });

        await collection.updateOne(
          { _id: doc._id },
          { 
            $set: { variants: newVariants },
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
      console.log(`✅ Migration complete: ${migratedCount} product(s) and ${updatedCartCount} cart(s) updated in MongoDB.`);
    } else {
      console.log("✨ All products and carts in MongoDB are clean and synchronized.");
    }
  } catch (error) {
    console.error("⚠️ Error running product auto-migration:", error.message);
  }
};
