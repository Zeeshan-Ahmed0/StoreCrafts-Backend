const requireFields = (payload: Record<string, unknown>, fields: string[]) => {
  const missing = fields.filter((field) => {
    const value = payload[field];
    if (value === undefined || value === null) {
      return true;
    }
    if (typeof value === "string" && value.trim().length === 0) {
      return true;
    }
    return false;
  });
  return missing;
};

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export { isEmail, requireFields };
