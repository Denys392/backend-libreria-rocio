import { productRepository } from "../repositories/productRepository.js";
import { Product } from "../models/model.index.js";
import { Op } from "sequelize";

export const productService = {
  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const err = new Error("El producto solicitado no existe.");
      err.status = 404;
      throw err;
    }
    return product;
  },

  async getPublicProductById(id) {
    const product = await this.getProductById(id);

    if (product.price === null) {
      const err = new Error("El producto solicitado no está disponible para la venta.");
      err.status = 404; 
      throw err;
    }
    return product;
  },

  async getAllProducts(queryParams) {
    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const search = queryParams.search || "";

    const { count, rows } = await productRepository.findAll({
      search,
      limit,
      page,
    });

    return {
      total_items: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      products: rows,
    };
  },

  async getPublicProducts(queryParams) {
    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const search = queryParams.search || "";

    const { count, rows } = await productRepository.findPublicProducts({
      search,
      limit,
      page,
    });

    return {
      total_items: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      products: rows,
    };
  },

  async getProductsByCategoryId(categoryId) {
    if (!categoryId || isNaN(parseInt(categoryId))) {
      const err = new Error("Invalid category ID filter");
      err.status = 400;
      throw err;
    }
    return await productRepository.findProductsByCategoryId(
      parseInt(categoryId),
    );
  },

  async getProductsByProviderId(providerId) {
    if (!providerId || isNaN(parseInt(providerId))) {
      const err = new Error("Invalid provider ID filter");
      err.status = 400;
      throw err;
    }
    return await productRepository.findProductsByProviderId(
      parseInt(providerId),
    );
  },

  async createProduct(productData) {
    if (!productData.name || productData.name.trim() === "") {
      const err = new Error("Product name is required");
      err.status = 400;
      throw err;
    }

    const normalizedName = productData.name.trim();

    const existingProduct = await productRepository.findByName(normalizedName);
    if (existingProduct) {
      const err = new Error("A product with this name already exists");
      err.status = 409;
      throw err;
    }

    return await productRepository.createProduct({
      name: normalizedName,
      description: productData.description
        ? productData.description.trim()
        : null,
      price:
        productData.price !== undefined ? parseFloat(productData.price) : null,
      stock: productData.stock !== undefined ? parseInt(productData.stock) : 0,
      image: productData.image ? productData.image.trim() : null, // <--- NUEVA ASIGNACIÓN
      category_id: productData.category_id
        ? parseInt(productData.category_id)
        : null,
      provider_id: productData.provider_id
        ? parseInt(productData.provider_id)
        : null,
    });
  },

  async updateProduct(id, productData) {
    await this.getProductById(id);

    const updateData = {};

    if (productData.name !== undefined) {
      if (!productData.name || productData.name.trim() === "") {
        const err = new Error("Product name cannot be empty");
        err.status = 400;
        throw err;
      }
      const normalizedName = productData.name.trim();
      const existingProduct =
        await productRepository.findByName(normalizedName);

      if (existingProduct && existingProduct.id !== parseInt(id)) {
        const err = new Error("A product with this name already exists");
        err.status = 409;
        throw err;
      }
      updateData.name = normalizedName;
    }

    if (productData.description !== undefined) {
      updateData.description = productData.description
        ? productData.description.trim()
        : null;
    }
    if (productData.price !== undefined) {
      updateData.price = parseFloat(productData.price);
    }
    if (productData.stock !== undefined) {
      updateData.stock = parseInt(productData.stock);
    }
    if (productData.image !== undefined) {
      updateData.image = productData.image ? productData.image.trim() : null;
    }
    if (productData.category_id !== undefined) {
      updateData.category_id = productData.category_id
        ? parseInt(productData.category_id)
        : null;
    }
    if (productData.provider_id !== undefined) {
      updateData.provider_id = productData.provider_id
        ? parseInt(productData.provider_id)
        : null;
    }

    await productRepository.updateProduct(id, updateData);

    return await this.getProductById(id);
  },

  async deleteProduct(id) {
    await this.getProductById(id);
    return await productRepository.deleteProduct(id);
  },

  async getCatalogByCategories() {
    const categoriesWithProducts =
      await productRepository.findCatalogByCategories({
        order: [
          ["name", "ASC"],
          [{ model: Product, as: "products" }, "name", "ASC"],
        ],
      });

    return categoriesWithProducts.map((category) => {
      const plainCategory = category.get({ plain: true });

      const allProducts = plainCategory.products || [];
      plainCategory.products = allProducts.slice(0, 5);

      plainCategory.has_more = allProducts.length > 5;

      return plainCategory;
    });
  },

  async getProductsByCategoryIdPaginated(
    categoryId,
    queryParams,
    isPublic = true,
  ) {
    if (!categoryId || isNaN(parseInt(categoryId))) {
      const err = new Error("El ID de la categoría no es válido.");
      err.status = 400;
      throw err;
    }

    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const offset = (page - 1) * limit;

    const whereCondition = {
      category_id: parseInt(categoryId),
    };

    if (isPublic) {
      whereCondition.price = { [Op.ne]: null };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["name", "ASC"]],
    });

    return {
      total_items: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      products: rows,
    };
  },
};
