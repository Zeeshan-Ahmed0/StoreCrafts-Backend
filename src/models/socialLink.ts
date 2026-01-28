import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class SocialLink extends Model<InferAttributes<SocialLink>, InferCreationAttributes<SocialLink>> {
  declare id: CreationOptional<number>;
  declare storeId: string;
  declare instagram: string | null;
  declare youtube: string | null;
  declare tiktok: string | null;
  declare facebook: string | null;
}

const initSocialLinkModel = (sequelize: Sequelize) => {
  SocialLink.init(
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
      instagram: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      youtube: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tiktok: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "social_links",
      underscored: true,
    }
  );

  return SocialLink;
};

export { SocialLink, initSocialLinkModel };
