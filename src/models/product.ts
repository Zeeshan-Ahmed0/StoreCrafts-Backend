import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare categoryId: number | null;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare tag: string | null;
  declare primaryImage: string | null;
  declare secondaryImage: string | null;
  declare price: number;
  declare comparePrice: number | null;
  declare isActive: CreationOptional<boolean>;
  declare inStock: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

const initProductModel = (sequelize: Sequelize) => {
  Product.init(
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(240),
        allowNull: false,
        unique: false, // Uniqueness enforced via composite index (store_id, slug)
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tag: {
        type: DataTypes.STRING(160),
        allowNull: true,
      },
      primaryImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      secondaryImage: {
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
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      inStock: {
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
      tableName: "products",
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["store_id", "slug"],
        },
      ],
    }
  );

  return Product;
};

export { Product, initProductModel };
