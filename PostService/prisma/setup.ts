// singleton pattern to create a single instance of PrismaClient that can be imported into other files

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
