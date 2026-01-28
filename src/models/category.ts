import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare name: string;
  declare subtitle: string | null;
  declare image: string;
  declare description: string | null;
}

const initCategoryModel = (sequelize: Sequelize) => {
  Category.init(
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
      name: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "categories",
      underscored: true,
      timestamps: false,
    }
  );

  return Category;
};

export { Category, initCategoryModel };
