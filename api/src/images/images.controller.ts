import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UploadedFile,
  Body,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import {
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Image } from './image.entity';
import { createS3Client } from '../s3.config';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { resizeImageBuffer } from './image-resize.helper';
import type { Express } from 'express';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  @ApiResponse({ status: 200, type: Image, description: 'Single image object' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async getImageById(@Param('id') id: number) {
    const image = await this.imagesService.findImageById(id);
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of images',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        images: {
          type: 'array',
          items: { $ref: getSchemaPath(Image) },
        },
      },
    },
  })
  async getImages(
    @Query('title') title?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { rows, count } = await this.imagesService.findAllImages(
      title,
      page,
      limit,
    );
    return {
      total: count,
      page,
      limit,
      images: rows,
    };
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
        },
        width: {
          type: 'integer',
        },
        height: {
          type: 'integer',
        },
      },
      required: ['file', 'title', 'width', 'height'],
    },
  })
  @ApiResponse({
    status: 201,
    type: Image,
    description: 'Image uploaded and resized',
  })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('width') width: number,
    @Body('height') height: number,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const s3 = createS3Client();
    const bucket = process.env.S3_BUCKET || 'images-bucket';
    const key = `${uuidv4()}-${file.originalname}`;

    const resizedBuffer = await resizeImageBuffer(
      file.buffer,
      Number(width),
      Number(height),
      file.mimetype,
    );
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: resizedBuffer,
        ContentType: file.mimetype,
      }),
    );

    const image = await this.imagesService.createImage({
      title,
      url: `https://${bucket}.s3.amazonaws.com/${key}`,
      width,
      height,
    });
    return image;
  }
}
