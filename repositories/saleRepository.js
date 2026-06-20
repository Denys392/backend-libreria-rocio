import { Sale, SaleDetail, Product, User, UserProfile } from "../models/model.index.js";
import sequelize from "../models/sequelize.js";

export const saleRepository = {
  async createSale(saleData, itemsData) {
    const transaction = await sequelize.transaction();

    try {
      const sale = await Sale.create(saleData, { transaction });

      for (const item of itemsData) {
        await SaleDetail.create(
          {
            sale_id: sale.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_per_unit: item.price_per_unit,
          },
          { transaction },
        );

        const product = await Product.findByPk(item.product_id, {
          transaction,
        });
        if (product) {
          await product.update(
            {
              stock: product.stock - parseInt(item.quantity),
            },
            { transaction },
          );
        }
      }

      await transaction.commit();
      return sale;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async findAndCountAllSales({ limit = 10, offset = 0 }) {
    return await Sale.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            { model: UserProfile, as: "profile", attributes: ["nombre"] },
          ],
        },
      ],
    });
  },

  async findAndCountPurchasesByUserId(userId, { limit = 10, offset = 0 }) {
    return await Sale.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [["id", "DESC"]],
    });
  },

  async findSaleByIdComplete(saleId) {
    return await Sale.findByPk(saleId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
        {
          model: SaleDetail,
          as: "details",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });
  },
};
