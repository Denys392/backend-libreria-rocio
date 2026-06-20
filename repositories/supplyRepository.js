import { SupplyOrder, SupplyDetail, Product } from "../models/model.index.js";
import { productRepository } from "./productRepository.js";
import sequelize from "../models/sequelize.js";

export const supplyRepository = {
  async createSupplyOrder(orderData, itemsData) {
    const transaction = await sequelize.transaction();

    try {
      const order = await SupplyOrder.create(orderData, { transaction });

      for (const item of itemsData) {
        await SupplyDetail.create(
          {
            supply_order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            purchase_price: item.purchase_price,
          },
          { transaction },
        );

        await productRepository.incrementStock(
          item.product_id,
          parseInt(item.quantity),
          transaction,
        );

        const product = await Product.findByPk(item.product_id, {
          transaction,
        });
        if (product && !product.provider_id) {
          await product.update(
            { provider_id: orderData.provider_id },
            { transaction },
          );
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
      include: ["provider", "details"],
      ...options,
    });
  },
};
