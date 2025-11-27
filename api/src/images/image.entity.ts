import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';

export class Image extends Model {
  public id!: number;
  public title!: string;
  public url!: string;
  public width!: number;
  public height!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'images',
    timestamps: true,
  },
);
