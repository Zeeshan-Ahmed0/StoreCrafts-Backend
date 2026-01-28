import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Footer extends Model<InferAttributes<Footer>, InferCreationAttributes<Footer>> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare label: string;
  declare url: string;
}

const initFooterModel = (sequelize: Sequelize) => {
  Footer.init(
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
      label: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "footers",
      underscored: true,
    }
  );

  return Footer;
};

export { Footer, initFooterModel };
