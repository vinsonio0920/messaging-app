import { prisma } from "./lib/prisma.js";

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      id: 23,
      email: "vinsonhe2@gmail.com",
      password: "Vinson is the best!",
      username: "Vinsinned",
      profile: "https://i.sstatic.net/l60Hf.png",
      online: false,
    },
  });
  console.log("Created user: ", user);

  const allUsers = await prisma.user.findMany();
  console.log("All users: ", JSON.stringify(allUsers));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
