import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`WE'RE WORKING IN THIS ENVIROMENT ${NODE_ENV}`);

dotenv.config({
  path:
    NODE_ENV === 'test'
      ? '.env.test'
      : NODE_ENV === 'production'
      ? '.env.production'
      : '.env',
});