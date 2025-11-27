# API Dev Notes

## Requirements Checklist

- [x] Dev environment: docker-compose
- [x] NodeJS (latest LTS)
- [x] Framework: NestJS
- [x] Database: PostgreSQL
- [x] Storage: Amazon S3 (mocked with LocalStack)
- [x] Image processing: scaled/cropped and optimized to given size
- [x] Tests (basic)
- [x] API Documentation: OpenAPIv3 (swagger)
- [x] Dev documentation (this readme)

## Dev Notes

- LocalStack is used to mock AWS S3 for local development and testing.
- Images are resized using Jimp before being uploaded to S3.
- Sequelize ORM is used for database operations.
- All image-related logic is organized under `/src/images` for clarity.
- To run the project, use `docker-compose up` from the root directory.
- Example endpoints:
  - `POST /images` for uploading and resizing images
  - `GET /images` for listing images with filtering and pagination
  - `GET /images/:id` for retrieving a single image by id

## Example .env for local development

```
AWS_REGION=us-east-1
S3_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_BUCKET=images-bucket
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=images
NODE_ENV=development
PORT=3000
```
