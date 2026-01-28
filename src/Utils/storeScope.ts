type StoreScopedWhere = Record<string, unknown>;

const applyStoreScope = (
  storeId: string,
  where: StoreScopedWhere = {}
) => {
  return { ...where, storeId };
};

export { applyStoreScope };
