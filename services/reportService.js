import { reportRepository } from "../repositories/reportRepository.js";

export const reportService = {
  async getDashboardData(queryData) {
    let { startDate, endDate, topLimit, groupBy } = queryData;

    // 1. Configuración de fechas por defecto (últimos 30 días)
    if (!startDate || !endDate) {
      const today = new Date();
      const pastMonth = new Date();
      pastMonth.setDate(today.getDate() - 30);

      startDate =
        startDate || pastMonth.toISOString().split("T")[0] + " 00:00:00";
      endDate = endDate || today.toISOString().split("T")[0] + " 23:59:59";
    } else {
      startDate = `${startDate} 00:00:00`;
      endDate = `${endDate} 23:59:59`;
    }

    const limit = topLimit ? parseInt(topLimit) : 5;
    // Validamos que el parámetro sea uno de los permitidos, si no, cae en 'day'
    const periodGroup = ["day", "week", "month"].includes(groupBy)
      ? groupBy
      : "day";

    // 2. Ejecución de consultas analíticas en paralelo (¡Ahora son 3!)
    const [topProducts, financialSummary, salesTrends] = await Promise.all([
      reportRepository.getTopSellingProducts(limit),
      reportRepository.getFinancialSummary(startDate, endDate),
      reportRepository.getSalesTrends(startDate, endDate, periodGroup), // 👈 Nueva consulta
    ]);

    return {
      date_range: { start: startDate, end: endDate },
      grouped_by: periodGroup,
      financial_summary: financialSummary,
      top_selling_products: topProducts,
      sales_trends: salesTrends,
    };
  },

  async getLowStockAlerts(threshold) {
    const limitThreshold = threshold !== undefined ? parseInt(threshold) : 10;
    return await reportRepository.getLowStockProducts(limitThreshold);
  },

  async getSalesByDocumentReport(queryData) {
    let { startDate, endDate } = queryData;
    // Configuración de rango de fechas por defecto (últimos 30 días)
    if (!startDate || !endDate) {
      const today = new Date();
      const pastMonth = new Date();
      pastMonth.setDate(today.getDate() - 30);
      startDate = pastMonth.toISOString().split('T')[0] + " 00:00:00";
      endDate = today.toISOString().split('T')[0] + " 23:59:59";
    } else {
      startDate = `${startDate} 00:00:00`;
      endDate = `${endDate} 23:59:59`;
    }
    return await reportRepository.getSalesByDocumentType(startDate, endDate);
  },

  async getTopCustomersReport(limit) {
    const topLimit = limit ? parseInt(limit) : 5;
    return await reportRepository.getTopCustomers(topLimit);
  },

  async getCategoryPerformanceReport() {
    return await reportRepository.getCategoryPerformance();
  }
};
