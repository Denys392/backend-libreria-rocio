import { productRepository } from "../repositories/productRepository.js";
import { Product } from "../models/model.index.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

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
      const err = new Error(
        "El producto solicitado no está disponible para la venta.",
      );
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
      const err = new Error("El ID de la categoría de filtro no es válido.");
      err.status = 400;
      throw err;
    }
    return await productRepository.findProductsByCategoryId(
      parseInt(categoryId),
    );
  },

  async getProductsByProviderId(providerId) {
    if (!providerId || isNaN(parseInt(providerId))) {
      const err = new Error("El ID del proveedor de filtro no es válido.");
      err.status = 400;
      throw err;
    }
    return await productRepository.findProductsByProviderId(
      parseInt(providerId),
    );
  },

  async createProduct(productData, uploadedFile) {
    if (!productData.name || productData.name.trim() === "") {
      const err = new Error("El nombre del producto es obligatorio.");
      err.status = 400;
      throw err;
    }

    const normalizedName = productData.name.trim();
    const existingProduct = await productRepository.findByName(normalizedName);
    if (existingProduct) {
      if (uploadedFile) {
        fs.unlink(uploadedFile.path, () => {});
      }
      const err = new Error("Ya existe un producto con este nombre.");
      err.status = 409;
      throw err;
    }

    const imageName = uploadedFile
      ? uploadedFile.filename
      : productData.image
        ? productData.image.trim()
        : null;

    return await productRepository.createProduct({
      name: normalizedName,
      description: productData.description
        ? productData.description.trim()
        : null,
      price:
        productData.price !== undefined ? parseFloat(productData.price) : null,
      stock: 0,
      image: imageName,
      category_id: productData.category_id
        ? parseInt(productData.category_id)
        : null,
      provider_id: productData.provider_id
        ? parseInt(productData.provider_id)
        : null,
    });
  },

  async updateProduct(id, productData, uploadedFile) {
    const currentProduct = await this.getProductById(id);
    const updateData = {};

    if (productData.name !== undefined) {
      if (!productData.name || productData.name.trim() === "") {
        if (uploadedFile) fs.unlink(uploadedFile.path, () => {});
        const err = new Error("El nombre del producto no puede estar vacío.");
        err.status = 400;
        throw err;
      }
      const normalizedName = productData.name.trim();
      const existingProduct =
        await productRepository.findByName(normalizedName);

      if (existingProduct && existingProduct.id !== parseInt(id)) {
        if (uploadedFile) fs.unlink(uploadedFile.path, () => {});
        const err = new Error("Ya existe un producto con este nombre.");
        err.status = 409;
        throw err;
      }
      updateData.name = normalizedName;
    }

    if (productData.description !== undefined)
      updateData.description = productData.description
        ? productData.description.trim()
        : null;
    if (productData.price !== undefined)
      updateData.price =
        productData.price === null ? null : parseFloat(productData.price);

    const oldImage = currentProduct.image;
    if (uploadedFile) {
      updateData.image = uploadedFile.filename;
    } else if (productData.image !== undefined) {
      updateData.image = productData.image ? productData.image.trim() : null;
    }

    await productRepository.updateProduct(id, updateData);

    if (uploadedFile && oldImage) {
      const absoluteOldPath = path.join(
        process.cwd(),
        "public/uploads/products",
        oldImage,
      );
      if (fs.existsSync(absoluteOldPath)) {
        fs.promises
          .unlink(absoluteOldPath)
          .catch((err) =>
            console.error(
              "Error eliminando imagen vieja de producto:",
              err.message,
            ),
          );
      }
    }

    return await this.getProductById(id);
  },

  async deleteProduct(id) {
    const product = await this.getProductById(id);
    const productImage = product.image;

    await productRepository.deleteProduct(id);

    if (productImage) {
      const absoluteOldPath = path.join(
        process.cwd(),
        "public/uploads/products",
        productImage,
      );
      if (fs.existsSync(absoluteOldPath)) {
        fs.promises.unlink(absoluteOldPath).catch(() => {});
      }
    }
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
