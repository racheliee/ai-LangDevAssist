"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seed() {
    try {
        console.log('Seed data inserted successfully');
    }
    catch (error) {
        console.error('Error seeding data:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
seed().catch((error) => console.error('Error running seed:', error));
//# sourceMappingURL=seed.js.map