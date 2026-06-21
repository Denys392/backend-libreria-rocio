import { saleService } from "../services/saleService.js";
import { ROLES } from "../utils/roles.js";

export const createSale = async (req, res, next) => {
  try {
    const user_id =
      req.user && req.user.userId ? req.user.userId : req.body.user_id;
    if (!user_id) {
      const err = new Error(
        "El ID de usuario es obligatorio para procesar la venta.",
      );
      err.status = 400;
      throw err;
    }
    const saleData = { ...req.body, user_id };
    const newSale = await saleService.processSale(saleData);

    return res.status(201).json({
      message: "Venta procesada exitosamente",
      data: newSale,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSales = async (req, res, next) => {
  try {
    const result = await saleService.getAllSalesPaginated(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyPurchases = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const result = await saleService.getMyPurchasesPaginated(userId, req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actorId = req.user?.userId;
    const actorRole = req.user?.role;

    const sale = await saleService.getSaleDetails(id);

    const isStaff = [
      ROLES.OWNER,
      ROLES.ADMIN,
      ROLES.DEV,
      ROLES.SELLER,
    ].includes(actorRole);
    const isOwnerOfSale = parseInt(sale.user_id) === parseInt(actorId);

    if (!isStaff && !isOwnerOfSale) {
      const err = new Error(
        "Acceso denegado: No tienes autorización para visualizar los detalles de esta transacción.",
      );
      err.status = 403;
      throw err;
    }

    return res.status(200).json(sale);
  } catch (error) {
    next(error);
  }
};
