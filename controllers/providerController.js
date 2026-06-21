import { providerService } from "../services/providerService.js";

export const createProvider = async (req, res, next) => {
  try {
    const provider = await providerService.createProvider(req.body);
    return res.status(201).json({
      message: "Proveedor creado exitosamente.",
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderByDocument = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      const err = new Error("El identificador RUC o DNI es obligatorio.");
      err.status = 400;
      throw err;
    }
    const provider = await providerService.getProviderByRucOrDni(identifier);
    return res.status(200).json(provider);
  } catch (error) {
    next(error);
  }
};

export const getAllProviders = async (req, res, next) => {
  try {
    const providers = await providerService.getAllProviders();
    return res.status(200).json(providers);
  } catch (error) {
    next(error);
  }
};

export const getProviderByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await providerService.getProviderById(id);
    return res.status(200).json(provider);
  } catch (error) {
    next(error);
  }
};

export const updateProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProvider = await providerService.updateProvider(id, req.body);
    return res.status(200).json({
      message: "Proveedor actualizado exitosamente.",
      data: updatedProvider,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    await providerService.deleteProvider(id);
    return res.status(200).json({
      message: "Proveedor eliminado exitosamente.",
    });
  } catch (error) {
    next(error);
  }
};
