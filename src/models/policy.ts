import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Policy extends Model<
  InferAttributes<Policy>,
  InferCreationAttributes<Policy>
> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare privacy: string | null;
  declare shipping: string | null;
  declare returnPolicy: string | null;
}

const initPolicyModel = (sequelize: Sequelize) => {
  Policy.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      privacy: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      shipping: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      returnPolicy: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "policies",
      underscored: true,
    }
  );

  return Policy;
};

export { Policy, initPolicyModel };
