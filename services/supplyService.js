import { authRepository } from "../repositories/authRepository.js";
import { supplyRepository } from "../repositories/supplyRepository.js";
import { productRepository } from "../repositories/productRepository.js";

export const supplyService = {
  async registerPurchase(purchaseData) {
    const { provider_id, user_id, items } = purchaseData;

    if (user_id) {
      const userExists = await authRepository.findUserById(user_id);
      if (!userExists) {
        const err = new Error(
          `Operación inválida: El usuario administrativo con ID ${user_id} no existe en el sistema.`,
        );
        err.status = 401;
        throw err;
      }
    }

    if (!provider_id || isNaN(parseInt(provider_id))) {
      const err = new Error("A valid provider_id is required");
      err.status = 400;
      throw err;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      const err = new Error("Purchase must include at least one product item");
      err.status = 400;
      throw err;
    }

    let calculatedTotalInvoice = 0;

    for (const item of items) {
      if (!item.product_id || isNaN(parseInt(item.product_id))) {
        const err = new Error("Each item must have a valid product_id");
        err.status = 400;
        throw err;
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        const err = new Error("Quantity must be greater than 0");
        err.status = 400;
        throw err;
      }
      if (
        item.purchase_price === undefined ||
        parseFloat(item.purchase_price) < 0
      ) {
        const err = new Error("Purchase price cannot be negative");
        err.status = 400;
        throw err;
      }

      const productExists = await productRepository.findById(item.product_id);
      if (!productExists) {
        const err = new Error(
          `Product with ID ${item.product_id} does not exist`,
        );
        err.status = 404;
        throw err;
      }

      calculatedTotalInvoice +=
        parseInt(item.quantity) * parseFloat(item.purchase_price);
    }

    const orderData = {
      provider_id: parseInt(provider_id),
      user_id: user_id ? parseInt(user_id) : null,
      total_invoice: parseFloat(calculatedTotalInvoice.toFixed(2)),
      order_date: new Date(),
    };

    return await supplyRepository.createSupplyOrder(orderData, items);
  },

  async getAllSupplyOrders() {
    return await supplyRepository.findAllOrders();
  },
};
