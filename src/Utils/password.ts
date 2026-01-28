import bcrypt from "bcryptjs";

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export { hashPassword, verifyPassword };
