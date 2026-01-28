import { app } from "./app.js";
import { sequelize } from "./config/dbConfig.js";
import { env } from "./config/env.js";
import { initModels } from "./models/index.js";

const startServer = async () => {
  try {
    initModels(sequelize);
    if (env.nodeEnv !== "production") {
      await sequelize.sync({ alter: true });
    }
    app.listen(env.port, () => {
      console.log(`Server is running on PORT ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
