import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { io } from "../server.js";

export const createMenu = catchAsync(async (req, res) => {
  const { name, description, price, imageUrl, categoryId } = req.body;

  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const existingMenu = await prisma.menu.findFirst({
    where: {
      canteenId: canteen.id,
      name: name.trim(),
      isDeleted: false,
    },
  });

  if (existingMenu) {
    throw new AppError("Menu dengan nama tersebut sudah ada", 400);
  }

  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        canteenId: canteen.id,
      },
    });

    if (!category) {
      throw new AppError("Kategori tidak ditemukan", 404);
    }
  }

  const menu = await prisma.menu.create({
    data: {
      name,
      description,
      price,
      imageUrl,
      categoryId: categoryId || null,
      canteenId: canteen.id,
    },

    include: {
      category: true,
    },
  });

  io.to(`canteen_${canteen.id}`).emit("menu-updated");

  res.status(201).json({
    success: true,
    message: "Menu berhasil dibuat",
    data: menu,
  });
});

export const getMyMenus = catchAsync(async (req, res) => {
  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const menus = await prisma.menu.findMany({
    where: {
      canteenId: canteen.id,
      isDeleted: false,
    },

    include: {
      category: true,
    },

    orderBy: [
      {
        categoryId: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: menus,
  });
});

export const updateMenu = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { name, description, price, imageUrl, categoryId } = req.body;

  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const menu = await prisma.menu.findFirst({
    where: {
      id,
      canteenId: canteen.id,
      isDeleted: false,
    },
  });

  if (!menu) {
    throw new AppError("Menu tidak ditemukan", 404);
  }

  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        canteenId: canteen.id,
      },
    });

    if (!category) {
      throw new AppError("Kategori tidak ditemukan", 404);
    }
  }

  const updatedMenu = await prisma.menu.update({
    where: {
      id,
    },

    data: {
      name,
      description,
      price,
      imageUrl,
      categoryId: categoryId || null,
    },

    include: {
      category: true,
    },
  });

  io.to(`canteen_${canteen.id}`).emit("menu-updated");

  res.status(200).json({
    success: true,
    message: "Menu berhasil diperbarui",
    data: updatedMenu,
  });
});

export const deleteMenu = catchAsync(async (req, res) => {
  const { id } = req.params;

  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const menu = await prisma.menu.findFirst({
    where: {
      id,
      canteenId: canteen.id,
      isDeleted: false,
    },
  });

  if (!menu) {
    throw new AppError("Menu tidak ditemukan", 404);
  }

  await prisma.menu.update({
    where: {
      id,
    },

    data: {
      isDeleted: true,
      isAvailable: false,
    },
  });

  io.to(`canteen_${canteen.id}`).emit("menu-updated");

  res.status(200).json({
    success: true,
    message: "Menu berhasil dihapus",
  });
});

export const updateMenuAvailability = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const menu = await prisma.menu.findFirst({
    where: {
      id,
      canteenId: canteen.id,
      isDeleted: false,
    },
  });

  if (!menu) {
    throw new AppError("Menu tidak ditemukan", 404);
  }

  const updatedMenu = await prisma.menu.update({
    where: {
      id,
    },

    data: {
      isAvailable,
    },

    include: {
      category: true,
    },
  });

  io.to(`canteen_${canteen.id}`).emit("menu-updated");

  res.status(200).json({
    success: true,
    message: "Status menu berhasil diperbarui",
    data: updatedMenu,
  });
});
