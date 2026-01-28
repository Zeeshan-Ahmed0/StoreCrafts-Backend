import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare userId: number | null;
  declare name: string;
  declare phone: string;
  declare address: string;
  declare paymentMethod: CreationOptional<string>;
  declare status: CreationOptional<string>;
  declare shipping: number | null;
  declare subTotal: number | null;
  declare total: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

const initOrderModel = (sequelize: Sequelize) => {
  Order.init(
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: "cod",
      },
      status: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: "pending",
      },
      shipping: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subTotal: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: "orders",
      underscored: true,
    }
  );

  return Order;
};

export { Order, initOrderModel };
