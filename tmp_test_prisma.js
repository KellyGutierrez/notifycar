const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Testing User.create with emailVerified...');
        // We don't actually need to execute it if we just want to see if the TS/JS methods exist
        // but in JS we can only check at runtime
        const data = {
            email: 'test' + Date.now() + '@example.com',
            name: 'Test',
            role: 'USER',
            emailVerified: null,
        };

        console.log('Data to send:', data);

        // Check if the property exists in the model definitions
        const userModel = prisma.user;
        console.log('User model found');

        // Attempting a creation (will fail on DB connection but validator should run first)
        await prisma.user.create({ data });
        console.log('Success (unlikely if no DB)');
    } catch (e) {
        console.error('Caught error:');
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
