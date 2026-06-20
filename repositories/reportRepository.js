import sequelize from "../models/sequelize.js";
import { QueryTypes } from "sequelize";

export const reportRepository = {
  //Productos más vendidos
  async getTopSellingProducts(limit = 5) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.price,
        SUM(sd.quantity) AS total_units_sold,
        SUM(sd.quantity * sd.price_per_unit) AS total_revenue
      FROM sale_details sd
      INNER JOIN products p ON sd.product_id = p.id
      GROUP BY p.id, p.name, p.price
      ORDER BY total_units_sold DESC
      LIMIT :limit;
    `;
    
    return await sequelize.query(query, {
      replacements: { limit: parseInt(limit) },
      type: QueryTypes.SELECT
    });
  },

  // Resumen financiero de Ventas vs Compras en un rango de fechas
  async getFinancialSummary(startDate, endDate) {
    // Consulta para el total recaudado en Ventas
    const salesQuery = `
      SELECT COALESCE(SUM(total), 0) AS total_sales, COUNT(id) AS total_sales_count
      FROM sales
      WHERE created_at BETWEEN :startDate AND :endDate;
    `;

    // Consulta para el total invertido en Compras de suministros
    const suppliesQuery = `
      SELECT COALESCE(SUM(total_invoice), 0) AS total_purchases, COUNT(id) AS total_purchase_orders_count
      FROM supply_orders
      WHERE created_at BETWEEN :startDate AND :endDate;
    `;

    const [salesResult] = await sequelize.query(salesQuery, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT
    });

    const [suppliesResult] = await sequelize.query(suppliesQuery, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT
    });

    return {
      sales: salesResult,
      purchases: suppliesResult,
      net_profit: parseFloat(salesResult.total_sales) - parseFloat(suppliesResult.total_purchases)
    };
  },

  async getLowStockProducts(limitThreshold = 10) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.stock, 
        p.price,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock <= :limitThreshold
      ORDER BY p.stock ASC;
    `;

    return await sequelize.query(query, {
      replacements: { limitThreshold: parseInt(limitThreshold) },
      type: QueryTypes.SELECT
    });
  },

  async getSalesTrends(startDate, endDate, groupBy = 'day') {
    let dateGroupExpression = "DATE(created_at)";

    if (groupBy.toLowerCase() === 'week') {
      // Agrupa por Año y Semana
      dateGroupExpression = "DATE_FORMAT(created_at, '%Y-W%v')"; 
    } else if (groupBy.toLowerCase() === 'month') {
      // Agrupa por Año y Mes
      dateGroupExpression = "DATE_FORMAT(created_at, '%Y-%m')";
    }

    const query = `
      SELECT 
        ${dateGroupExpression} AS period,
        COUNT(id) AS total_orders,
        COALESCE(SUM(total), 0) AS total_revenue,
        ROUND(AVG(total), 2) AS average_ticket
      FROM sales
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY period
      ORDER BY period ASC;
    `;

    return await sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT
    });
  },

  // Ventas totales agrupadas por Tipo de Documento
  async getSalesByDocumentType(startDate, endDate) {
    const query = `
      SELECT 
        COALESCE(document_type, 'MOSTRADOR / ANÓNIMO') AS document_type,
        COUNT(id) AS total_orders,
        SUM(total) AS total_revenue
      FROM sales
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY document_type
      ORDER BY total_revenue DESC;
    `;
    return await sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT
    });
  },

  // Clientes estrella (Los que más compran)
  async getTopCustomers(limit = 5) {
    const query = `
      SELECT 
        u.id AS user_id,
        u.email,
        up.nombre AS customer_name,
        COUNT(s.id) AS total_purchases,
        SUM(s.total) AS total_spent
      FROM sales s
      INNER JOIN users u ON s.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      GROUP BY u.id, u.email, up.nombre
      ORDER BY total_spent DESC
      LIMIT :limit;
    `;
    return await sequelize.query(query, {
      replacements: { limit: parseInt(limit) },
      type: QueryTypes.SELECT
    });
  },

  //Rendimiento de Ventas por Categoría de Producto
  async getCategoryPerformance() {
    const query = `
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        COUNT(sd.id) AS total_items_sold,
        SUM(sd.quantity * sd.price_per_unit) AS total_revenue
      FROM sale_details sd
      INNER JOIN products p ON sd.product_id = p.id
      INNER JOIN categories c ON p.category_id = c.id
      GROUP BY c.id, c.name
      ORDER BY total_revenue DESC;
    `;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT
    });
  }


};