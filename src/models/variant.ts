import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Variant extends Model<
  InferAttributes<Variant>,
  InferCreationAttributes<Variant>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare name: string;
  declare value: string;
  declare image: string | null;
  declare price: number;
  declare comparePrice: number | null;
  declare default: boolean;
  declare isActive: CreationOptional<boolean>;
}

const initVariantModel = (sequelize: Sequelize) => {
  Variant.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      comparePrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
      sequelize,
      tableName: "variants",
      underscored: true,
    }
  );

  return Variant;
};

export { Variant, initVariantModel };
