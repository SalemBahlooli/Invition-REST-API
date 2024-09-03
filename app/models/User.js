const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const User = {
  create: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  },
  findByEmail: (email) => {
    return prisma.user.findUnique({ where: { email } });
  },
};

module.exports = User;
