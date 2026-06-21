import { providerRepository } from "../repositories/providerRepository.js";

export const providerService = {
  async getProviderById(id) {
    const provider = await providerRepository.findById(id);
    if (!provider) {
      const err = new Error("El proveedor solicitado no existe.");
      err.status = 404;
      throw err;
    }
    return provider;
  },

  async getAllProviders() {
    const providers = await providerRepository.findAll();
    return providers;
  },

  async createProvider(providerData) {
    if (!providerData.ruc_or_dni || providerData.ruc_or_dni.trim() === "") {
      const err = new Error("El RUC o DNI es obligatorio.");
      err.status = 400;
      throw err;
    }

    const normalizedIdentifier = providerData.ruc_or_dni.trim();
    const normalizedCompanyName = providerData.company_name
      ? providerData.company_name.trim()
      : null;

    const existingProvider =
      await providerRepository.findByRucOrDni(normalizedIdentifier);
    if (existingProvider) {
      const err = new Error(
        "Ya existe un proveedor registrado con este RUC o DNI.",
      );
      err.status = 409;
      throw err;
    }

    return await providerRepository.createProvider({
      company_name: normalizedCompanyName,
      ruc_or_dni: normalizedIdentifier,
      phone: providerData.phone ? providerData.phone.trim() : null,
      email: providerData.email
        ? providerData.email.trim().toLowerCase()
        : null,
    });
  },

  async updateProvider(id, providerData) {
    await this.getProviderById(id);

    const updateData = {};

    if (providerData.ruc_or_dni !== undefined) {
      if (!providerData.ruc_or_dni || providerData.ruc_or_dni.trim() === "") {
        const err = new Error("El RUC o DNI no puede estar vacío.");
        err.status = 400;
        throw err;
      }

      const normalizedIdentifier = providerData.ruc_or_dni.trim();
      const existingProvider =
        await providerRepository.findByRucOrDni(normalizedIdentifier);

      if (existingProvider && existingProvider.id !== parseInt(id)) {
        const err = new Error(
          "Ya existe otro proveedor registrado con este RUC o DNI.",
        );
        err.status = 409;
        throw err;
      }
      updateData.ruc_or_dni = normalizedIdentifier;
    }

    if (providerData.company_name !== undefined) {
      updateData.company_name = providerData.company_name
        ? providerData.company_name.trim()
        : null;
    }
    if (providerData.phone !== undefined) {
      updateData.phone = providerData.phone ? providerData.phone.trim() : null;
    }
    if (providerData.email !== undefined) {
      updateData.email = providerData.email
        ? providerData.email.trim().toLowerCase()
        : null;
    }

    await providerRepository.updateProvider(id, updateData);

    return await this.getProviderById(id);
  },

  async getProviderByRucOrDni(identifier) {
    if (!identifier || identifier.trim() === "") {
      const err = new Error("El identificador RUC o DNI es obligatorio.");
      err.status = 400;
      throw err;
    }

    const provider = await providerRepository.findByRucOrDni(identifier.trim());

    if (!provider) {
      const err = new Error(
        `No se encontró ningún proveedor con el RUC/DNI '${identifier}'.`,
      );
      err.status = 404;
      throw err;
    }

    return provider;
  },

  async deleteProvider(id) {
    await this.getProviderById(id);
    return await providerRepository.deleteProvider(id);
  },
};
