import { saleRepository } from "../repositories/saleRepository.js";
import { productRepository } from "../repositories/productRepository.js";

const validDocuments = [
  "BOLETA",
  "FACTURA",
  "TICKET",
  "BOLETA_WEB",
  "FACTURA_WEB",
];

export const saleService = {
  async processSale(saleData) {
    const { user_id, document_type, items } = saleData;

    if (
      !document_type ||
      !validDocuments.includes(document_type.toUpperCase())
    ) {
      const err = new Error("Invalid document type");
      err.status = 400;
      throw err;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      const err = new Error("Sale must include at least one product item");
      err.status = 400;
      throw err;
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await productRepository.findById(item.product_id);

      if (!product) {
        const err = new Error(
          `Product with ID ${item.product_id} does not exist`,
        );
        err.status = 404;
        throw err;
      }

      if (product.price === null) {
        const err = new Error(
          `Product '${product.name}' is a base model and cannot be sold without a set public price`,
        );
        err.status = 400;
        throw err;
      }

      if (product.stock < parseInt(item.quantity)) {
        const err = new Error(
          `Insufficient stock for '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
        err.status = 400;
        throw err;
      }

      const itemPrice = parseFloat(product.price);
      calculatedTotal += parseInt(item.quantity) * itemPrice;

      validatedItems.push({
        product_id: product.id,
        quantity: parseInt(item.quantity),
        price_per_unit: itemPrice,
      });
    }

    const finalSaleData = {
      user_id: user_id ? parseInt(user_id) : null,
      total: parseFloat(calculatedTotal.toFixed(2)),
      created_at: new Date(),
    };

    return await saleRepository.createSale(finalSaleData, validatedItems);
  },

  async getAllSales() {
    return await saleRepository.findAllSales();
  },
};
