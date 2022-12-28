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
    let banker = await prisma.nhanVien.create({
      data: {
        hoTen: fullName,
        sdt: faker.phone.number('09########'),
        taiKhoan: {
          create: {
            tenDangNhap: username,
            matKhau: hashed,
            vaiTro: 'Banker',
          },
        },
      },
    });
  }
  //1 Admin
  let admin = await prisma.taiKhoan.create({
    data: {
      tenDangNhap: faker.random.numeric(12),
      matKhau: hashed,
      vaiTro: 'Admin',
    },
  });

  // 5 user
  for (let i = 1; i < 6; i++) {
    let firsName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let fullName = firsName + ' ' + lastName;
    let username = faker.random.numeric(12);

    let user = await prisma.khachHang.create({
      data: {
        hoTen: fullName,
        sdt: faker.phone.number('09########'),
        email: faker.internet.email(firsName, lastName, 'gmail'),
        taiKhoan: {
          create: {
            tenDangNhap: username,
            matKhau: hashed,
            vaiTro: 'User',
          },
        },
      },
    });

    // taikhoanthanhtoan cho user
    let tkthanhtoan = await prisma.taiKhoanThanhToan.create({
      data: {
        soTK: faker.finance.creditCardNumber('##########'),
        soDu: +faker.finance.account(8),
        maTK: user.maTK,
      },
    });
  }
  //lay danhsach user hien tai
  let list = await prisma.taiKhoan.findMany({
    where: {
      vaiTro: 'User',
    },
    orderBy: {
      maTK: 'asc',
    },
    include: { taiKhoanThanhToan: true },
  });
  let n = list.length;

  //danhsachdaluu
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      await prisma.danhSachDaLuu.create({
        data: {
          maTK: list[i].maTK,
          nguoiDung: list[j].maTK,
          tenGoiNho: faker.lorem.word(),
        },
      });
    }
  }

  for (let i = 0; i < n; i++) {
    let count = 0;
    // chuyen khoan
    while (count < 8) {
      let rand = faker.datatype.number({
        min: 0,
        max: n - 1,
      });
      if (rand != i) {
        await prisma.chuyenKhoanNoiBo.create({
          data: {
            nguoiChuyen: list[i].taiKhoanThanhToan.soTK,
            nguoiNhan: list[rand].taiKhoanThanhToan.soTK,
            soTien: +faker.finance.account(6),
            noiDungCK: faker.lorem.sentence(),
          },
        });
        count++;
      }
    }
    //duoc chuyen khoan
    count = 0;
    while (count < 8) {
      let rand = faker.datatype.number({
        min: 0,
        max: n - 1,
      });
      if (rand != i) {
        await prisma.chuyenKhoanNoiBo.create({
          data: {
            nguoiNhan: list[i].taiKhoanThanhToan.soTK,
            nguoiChuyen: list[rand].taiKhoanThanhToan.soTK,
            soTien: +faker.finance.account(6),
            noiDungCK: faker.lorem.sentence(),
          },
        });
        count++;
      }
    }
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
