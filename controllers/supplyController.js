import { supplyService } from "../services/supplyService.js";

export const createSupplyOrder = async (req, res, next) => {
  try {
    const user_id = req.user ? req.user.id : null;

    const purchaseData = { ...req.body, user_id };

    const newOrder = await supplyService.registerPurchase(purchaseData);

    return res.status(201).json({
      message:
        "Orden de suministro procesada e inventario actualizado con éxito",
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSupplyOrders = async (req, res, next) => {
  try {
    const orders = await supplyService.getAllSupplyOrders();
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
