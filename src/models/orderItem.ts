import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<number>;
  declare orderId: number;
  declare productId: number;
  declare variantId: number | null;
  declare name: string;
  declare quantity: number;
  declare price: number;
  declare comparePrice: number | null;
}

const initOrderItemModel = (sequelize: Sequelize) => {
  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      variantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      comparePrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "order_items",
      underscored: true,
    }
  );

  return OrderItem;
};

export { OrderItem, initOrderItemModel };
