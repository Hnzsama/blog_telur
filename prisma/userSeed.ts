import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function seedUsers(prisma: any) {
  console.log("Seeding users...");

  // 1. Create Default Admin User
  const adminEmail = "admin@hargatelur.id";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = hashPassword("adminpassword");
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Administrator Utama",
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    console.log("Admin seeded: admin@hargatelur.id / adminpassword");
  }

  // 2. Create regional bloggers
  const bloggers = [
    { email: "peternak@hargatelur.id", name: "Slamet Peternak Blitar", password: "bloggerpassword" },
    { email: "jakarta@hargatelur.id", name: "Budi Agen Jakarta", password: "bloggerpassword" },
    { email: "surabaya@hargatelur.id", name: "Andi Agen Surabaya", password: "bloggerpassword" },
    { email: "medan@hargatelur.id", name: "Roni Peternak Medan", password: "bloggerpassword" },
    { email: "bandung@hargatelur.id", name: "Dedi Peternak Bandung", password: "bloggerpassword" }
  ];

  const seededBloggers = [];
  for (const blogger of bloggers) {
    const existing = await prisma.user.findUnique({
      where: { email: blogger.email }
    });

    if (!existing) {
      const hashedPassword = hashPassword(blogger.password);
      const user = await prisma.user.create({
        data: {
          email: blogger.email,
          name: blogger.name,
          password: hashedPassword,
          role: "USER"
        }
      });
      seededBloggers.push(user);
      console.log(`Blogger seeded: ${blogger.email}`);
    } else {
      seededBloggers.push(existing);
    }
  }

  return seededBloggers;
}
