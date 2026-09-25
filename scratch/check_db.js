const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.entry.count();
  console.log("Current entry count in DB:", count);
  if (count > 0) {
    const entries = await prisma.entry.findMany({ select: { id: true, title: true } });
    console.log("Entries in DB:", entries);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
