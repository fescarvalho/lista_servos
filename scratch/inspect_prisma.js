const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
console.log(Object.keys(client));
process.exit(0);
