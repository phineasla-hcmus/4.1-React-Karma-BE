import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const hashed = bcrypt.hashSync('1234', 10);

  //2 Bankers
  for (let i = 1; i < 3; i++) {
    let firsName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let fullName = firsName + ' ' + lastName;
    let username = faker.random.numeric(12);
    let banker = await prisma.nhanVien.upsert({
      create: {
        hoTen: fullName,
        sdt: faker.phone.number('09##-###-###'),
        taiKhoan: {
          create: {
            tenDangNhap: username,
            matKhau: hashed,
            vaiTro: 'Banker',
          },
        },
      },
      where: {
        maNV: 1,
      },
      update: {},
    });
  }

  //1 Admin
  let admin = await prisma.taiKhoan.upsert({
    create: {
      tenDangNhap: faker.random.numeric(12),
      matKhau: hashed,
      vaiTro: 'Admin',
    },
    where: {
      maTK: 1,
    },
    update: {},
  });

  // 5 user
  for (let i = 1; i < 6; i++) {
    let firsName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let fullName = firsName + ' ' + lastName;
    let username = faker.random.numeric(12);

    let user = await prisma.khachHang.upsert({
      create: {
        hoTen: fullName,
        sdt: faker.phone.number('09##-###-###'),
        email: faker.internet.email(firsName, lastName, 'gmail'),
        taiKhoan: {
          create: {
            tenDangNhap: username,
            matKhau: hashed,
            vaiTro: 'User',
          },
        },
      },
      where: {
        maKH: 1,
      },
      update: {},
    });

    // taikhoanthanhtoan cho user
    let tkthanhtoan = await prisma.taiKhoanThanhToan.upsert({
      create: {
        soTK: faker.finance.creditCardNumber('### ### ####'),
        soDu: +faker.finance.account(),
        maTK: user.maTK,
      },
      where: {
        maTK: user.maTK,
      },
      update: {},
    });
  }
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
