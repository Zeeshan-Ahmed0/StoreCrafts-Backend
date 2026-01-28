import { Dialect, Sequelize } from "sequelize";
import { env } from "./env.js";

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  dialect: env.db.dialect as Dialect,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log("Error connecting database", error));

export { sequelize };
