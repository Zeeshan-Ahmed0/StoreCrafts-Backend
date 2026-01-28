import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class NavbarOption extends Model<
  InferAttributes<NavbarOption>,
  InferCreationAttributes<NavbarOption>
> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare label: string;
  declare url: string;
  declare type: CreationOptional<string>;
  declare position: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;
  declare editable: CreationOptional<boolean>;
}

const initNavbarOptionModel = (sequelize: Sequelize) => {
  NavbarOption.init(
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
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
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
      editable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      type: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: 'link',
      }
    },
    {
      sequelize,
      timestamps: false,
      tableName: "navbar_options",
      underscored: true,
    }
  );

  return NavbarOption;
};

export { NavbarOption, initNavbarOptionModel };
