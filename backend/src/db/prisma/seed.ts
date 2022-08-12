import Roles from '../../data/roles';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../utils/auth/index';
const prisma = new PrismaClient();
const rolesList = [Roles.Admin, Roles.Cashier, Roles.Finanace];
async function checkRoleExists(roleName: string) {
  const role = await prisma.userRole.findFirst({ where: { name: roleName } });
  if (role) return true;
  return false;
}
async function checkUserExists(normalizedUsername: string) {
  const user = await prisma.user.findFirst({
    where: {
      normalizedUsername
    }
  });
  if (user) return true;
  else return false;
}
async function seedRoles() {
  rolesList.forEach(async role => {
    if (!(await checkRoleExists(role))) {
      await prisma.userRole.create({
        data: {
          name: role,
        }
      });
    }
  });
  console.log('Finished seeding roles');
}
async function seedSuperUser() {
  const adminRole = await prisma.userRole.findFirst({
    where: {
      name: Roles.Admin
    }
  });
  if (!adminRole) {
    console.log("The role doesn't exist.");
    return false;
  }
  if (!(await checkUserExists('SUPERUSER'))) {
    const superUser = await prisma.user.create({
      data: {
        firstName: 'SuperUser',
        lastName: 'SuperUser',
        username: 'SuperUser',
        normalizedUsername: 'SUPERUSER',
        phoneNumber: '0000',
        password: await hashPassword('123456'),
        address: 'Super user Address',
        roles: {
          connect: {
            id: adminRole.id
          }
        }
      }
    });

  }
  else {
    console.log('SuperUser already exists.');
  }
  console.log('Finished seeding users.');
}
async function main() {
  await seedRoles();
  await seedSuperUser();

}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });