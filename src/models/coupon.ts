import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Coupon extends Model<
  InferAttributes<Coupon>,
  InferCreationAttributes<Coupon>
> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare code: string;
  declare isPercentage: CreationOptional<boolean>;
  declare value: number;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare isActive: CreationOptional<boolean>;
}

const initCouponModel = (sequelize: Sequelize) => {
  Coupon.init(
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
      code: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
      },
      isPercentage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      value: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      startsAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endsAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "coupons",
      underscored: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["store_id", "code"],
        },
      ],
    }
  );

  return Coupon;
};

export { Coupon, initCouponModel };
