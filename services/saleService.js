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
      const err = new Error("El tipo de comprobante no es válido.");
      err.status = 400;
      throw err;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      const err = new Error(
        "La venta debe incluir al menos un artículo o producto.",
      );
      err.status = 400;
      throw err;
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await productRepository.findById(item.product_id);

      if (!product) {
        const err = new Error(
          `El producto con el ID ${item.product_id} no existe.`,
        );
        err.status = 404;
        throw err;
      }

      if (product.price === null) {
        const err = new Error(
          `El producto '${product.name}' es un modelo base y no se puede vender sin un precio público establecido.`,
        );
        err.status = 400;
        throw err;
      }

      if (product.stock < parseInt(item.quantity)) {
        const err = new Error(
          `Stock insuficiente para '${product.name}'. Disponible: ${product.stock}, Solicitado: ${item.quantity}`,
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
      document_type: document_type.toUpperCase(),
      total: parseFloat(calculatedTotal.toFixed(2)),
      created_at: new Date(),
    };

    return await saleRepository.createSale(finalSaleData, validatedItems);
  },

  async getAllSales() {
    return await saleRepository.findAllSales();
  },

  async getAllSalesPaginated(queryParams) {
    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await saleRepository.findAndCountAllSales({
      limit,
      offset,
    });

    return {
      total_items: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      sales: rows,
    };
  },

  async getMyPurchasesPaginated(userId, queryParams) {
    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await saleRepository.findAndCountPurchasesByUserId(
      userId,
      { limit, offset },
    );

    return {
      total_items: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      purchases: rows,
    };
  },

  async getSaleDetails(saleId) {
    const sale = await saleRepository.findSaleByIdComplete(saleId);
    if (!sale) {
      const err = new Error("La venta solicitada no existe.");
      err.status = 404;
      throw err;
    }
    return sale;
  },
};
