import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'development';

const fruits = ["apple", "banana", "apple"];

const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});

const users = [
  { name: "Amit", age: 22 },
  { name: "Neha", age: 25 },
  { name: "Rahul", age: 30 }
];

const newUsers = users.filter((user) => user.age > 24);
console.log(newUsers);

console.log(`WE'RE WORKING IN THIS ENVIROMENT ${NODE_ENV}`);

dotenv.config({
  path:
    NODE_ENV === 'test'
      ? '.env.test'
      : NODE_ENV === 'production'
      ? '.env.production'
      : '.env',
});