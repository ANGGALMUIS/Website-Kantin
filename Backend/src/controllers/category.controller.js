import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const createDefaultCategories = async (canteenId) => {
  const defaultCategories = ["Makanan Berat", "Minuman", "Snack", "Lain-lain"];

  for (const name of defaultCategories) {
    const exists = await prisma.category.findFirst({
      where: {
        canteenId,
        name,
      },
    });

    if (!exists) {
      await prisma.category.create({
        data: {
          name,
          canteenId,
        },
      });
    }
  }
};

export const getMyCategories = catchAsync(async (req, res) => {
  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  await createDefaultCategories(canteen.id);

  const categories = await prisma.category.findMany({
    where: {
      canteenId: canteen.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;

  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      canteenId: canteen.id,
      name,
    },
  });

  if (existingCategory) {
    throw new AppError("Kategori sudah ada", 400);
  }

  const category = await prisma.category.create({
    data: {
      name,
      canteenId: canteen.id,
    },
  });

  res.status(201).json({
    success: true,
    message: "Kategori berhasil dibuat",
    data: category,
  });
});

export const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const category = await prisma.category.findFirst({
    where: {
      id,
      canteenId: canteen.id,
    },
  });

  if (!category) {
    throw new AppError("Kategori tidak ditemukan", 404);
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  res.status(200).json({
    success: true,
    message: "Kategori berhasil diperbarui",
    data: updatedCategory,
  });
});

export const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const category = await prisma.category.findFirst({
    where: {
      id,
      canteenId: canteen.id,
    },
  });

  if (!category) {
    throw new AppError("Kategori tidak ditemukan", 404);
  }

  const menuCount = await prisma.menu.count({
    where: {
      categoryId: id,
    },
  });

  if (menuCount > 0) {
    throw new AppError("Kategori masih digunakan oleh menu", 400);
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Kategori berhasil dihapus",
  });
});
