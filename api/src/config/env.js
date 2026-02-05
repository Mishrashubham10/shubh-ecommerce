import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'development';

const fruits = ["apple", "banana", "apple"];

const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});

console.log(`WE'RE WORKING IN THIS ENVIROMENT ${NODE_ENV}`);

dotenv.config({
  path:
    NODE_ENV === 'test'
      ? '.env.test'
      : NODE_ENV === 'production'
      ? '.env.production'
      : '.env',
});