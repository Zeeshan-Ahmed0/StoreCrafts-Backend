import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
  declare id: CreationOptional<string>;
  declare storeId: string | null;
  declare email: string;
  declare password: string;
  declare role: CreationOptional<"super_admin" | "store_admin" | "store_owner">;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

const initAdminModel = (sequelize: Sequelize) => {
  Admin.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: false, // Uniqueness enforced via composite index (store_id, email)
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("super_admin", "store_admin", "store_owner"),
        allowNull: false,
        defaultValue: "store_admin",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "admins",
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["store_id", "email"],
        },
      ],
    }
  );

  return Admin;
};

export { Admin, initAdminModel };
