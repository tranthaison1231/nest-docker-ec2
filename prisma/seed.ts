import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.create({
    data: {
      firstName: 'Cody',
      lastName: 'Higgins',
      email: 'ttson.1711@gmail.com',
      phoneNumber: '123456789',
      salt: '123456789',
      password: '123456789',
      avatarURL: 'https://www.google.com',
    },
  });

  console.log({ user });
}

run()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
