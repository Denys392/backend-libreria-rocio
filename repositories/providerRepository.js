import { Provider } from "../models/model.index.js";

export const providerRepository = {
  findById(id, options = {}) {
    return Provider.findByPk(id, options);
  },

  findAll(options = {}) {
    return Provider.findAll(options);
  },

  findByCompanyName(companyName, options = {}) {
    return Provider.findOne({
      where: { company_name: companyName },
      ...options,
    });
  },

  findByRucOrDni(identifier, options = {}) {
    return Provider.findOne({
      where: { ruc_or_dni: identifier },
      ...options,
    });
  },

  createProvider(data, options = {}) {
    return Provider.create(data, options);
  },

  updateProvider(id, data, options = {}) {
    return Provider.update(data, { where: { id }, ...options });
  },

  deleteProvider(id, options = {}) {
    return Provider.destroy({ where: { id }, ...options });
  },
};
