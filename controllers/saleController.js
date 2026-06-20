import { saleService } from "../services/saleService.js";

export const createSale = async (req, res, next) => {
  try {
    const user_id = (req.user && req.user.userId) ? req.user.userId : req.body.user_id;

    if (!user_id) {
      const err = new Error("User ID is required to process a sale");
      err.status = 400;
      throw err;
    }

    const saleData = { ...req.body, user_id };
    const newSale = await saleService.processSale(saleData);

    return res.status(201).json({
      message: "Sale processed successfully and stock updated",
      data: newSale
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSales = async (req, res, next) => {
  try {
    const sales = await saleService.getAllSales();
    return res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
};