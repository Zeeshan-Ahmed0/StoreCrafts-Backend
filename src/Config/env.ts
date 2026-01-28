import dotenv from "dotenv";

dotenv.config();

const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  db: {
    name: requireEnv("DB_NAME"),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
    host: requireEnv("DB_HOST"),
    dialect: process.env.DB_DIALECT ?? "postgres",
  },
  jwtSecret: requireEnv("JWT_SECRET_KEY"),
};

export { env };
