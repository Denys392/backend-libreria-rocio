import { SupplyOrder, SupplyDetail, Product } from "../models/model.index.js";
import sequelize from "../models/sequelize.js";

export const supplyRepository = {
    async createSupplyOrder(orderData, itemsData) {
    const transaction = await sequelize.transaction();

    try {
      const order = await SupplyOrder.create(orderData, { transaction });

      for (const item of itemsData) {
        await SupplyDetail.create({
          supply_order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          purchase_price: item.purchase_price
        }, { transaction });

        const product = await Product.findByPk(item.product_id, { transaction });
        if (product) {
          const updatedFields = {
            stock: product.stock + parseInt(item.quantity)
          };

          if (!product.provider_id) {
            updatedFields.provider_id = orderData.provider_id;
          }

          await product.update(updatedFields, { transaction });
        }
      }

      await transaction.commit();
      return order;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async findAllOrders(options = {}) {
    return await SupplyOrder.findAll({
      include: ["provider", "details"], // Si tienes configuradas las asociaciones
      ...options
    });
  }
};