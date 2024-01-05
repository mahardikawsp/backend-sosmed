import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){
    //create dummy
    // const user1 = await prisma.user.upsert({
    //     where: { username: 'Mahardika' },
    //     update: {},
    //     create: {
    //       name: 'Mahardika',
    //       username : 'mahardika',
    //       email: 'mahardikawsp@gmail.com',
    //       password: 'mahardika',
    //       photo: 'photo.jpg'
    //     },
    // });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });