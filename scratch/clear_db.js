const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.entry.deleteMany({});
  console.log(`Deleted ${deleted.count} sample entries from DB.`);
  const count = await prisma.entry.count();
  console.log("Current entry count in DB after cleanup:", count);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
