import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Banner extends Model<InferAttributes<Banner>, InferCreationAttributes<Banner>> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare title: string | null;
  declare image: string;
  declare link: string | null;
  declare position: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;
}

const initBannerModel = (sequelize: Sequelize) => {
  Banner.init(
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
      title: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "banners",
      underscored: true,
      timestamps: false,
    }
  );

  return Banner;
};

export { Banner, initBannerModel };
