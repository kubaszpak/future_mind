import { ApiProperty } from '@nestjs/swagger';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';

export class Image extends Model {
  @ApiProperty()
  public id!: number;

  @ApiProperty()
  public title!: string;

  @ApiProperty()
  public url!: string;

  @ApiProperty()
  public width!: number;

  @ApiProperty()
  public height!: number;

  @ApiProperty()
  public readonly createdAt!: Date;

  @ApiProperty()
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
