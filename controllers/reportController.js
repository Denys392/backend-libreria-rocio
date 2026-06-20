import { reportService } from "../services/reportService.js";

export const getDashboardReport = async (req, res, next) => {
  try {
    const dashboardData = await reportService.getDashboardData(req.query);
    return res.status(200).json(dashboardData);
  } catch (error) {
    next(error);
  }
};

export const getLowStockReport = async (req, res, next) => {
  try {
    const { threshold } = req.query;
    const lowStockProducts = await reportService.getLowStockAlerts(threshold);
    return res.status(200).json({
      alert_count: lowStockProducts.length,
      products: lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesByDocument = async (req, res, next) => {
  try {
    const report = await reportService.getSalesByDocumentReport(req.query);
    return res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

export const getTopCustomers = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const report = await reportService.getTopCustomersReport(limit);
    return res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

export const getCategoryPerformance = async (req, res, next) => {
  try {
    const report = await reportService.getCategoryPerformanceReport();
    return res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};