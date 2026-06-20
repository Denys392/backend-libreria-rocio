import { Sale, SaleDetail, Product } from "../models/model.index.js";
import sequelize from "../models/sequelize.js";

export const saleRepository = {
  async createSale(saleData, itemsData) {
    const transaction = await sequelize.transaction();

    try {
      const sale = await Sale.create(saleData, { transaction });

      for (const item of itemsData) {
        await SaleDetail.create({
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_per_unit: item.price_per_unit
        }, { transaction });

        const product = await Product.findByPk(item.product_id, { transaction });
        if (product) {
          await product.update({
            stock: product.stock - parseInt(item.quantity)
          }, { transaction });
        }
      }

      await transaction.commit();
      return sale;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async findAllSales(options = {}) {
    return await Sale.findAll({
      include: ["user", "details"],
      ...options
    });
  }
};