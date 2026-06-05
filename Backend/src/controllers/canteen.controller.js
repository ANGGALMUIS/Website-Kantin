import prisma from "../config/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { io } from "../server.js";

export const createCanteen = catchAsync(async (req, res) => {
  const { name, description } = req.body;

  const existingCanteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (existingCanteen) {
    throw new AppError("Kamu sudah memiliki kantin", 400);
  }

  const canteen = await prisma.canteen.create({
    data: {
      ownerId: req.user.id,
      name,
      description,
    },
  });

  res.status(201).json({
    success: true,
    message: "Kantin berhasil dibuat",
    data: canteen,
  });
});

export const getMyCanteen = catchAsync(async (req, res) => {
  let canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  // AUTO CREATE JIKA BELUM ADA
  if (!canteen) {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    canteen = await prisma.canteen.create({
      data: {
        ownerId: user.id,
        name: user.name || "Kantin Baru",
        description: "",
        isOpen: false,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: canteen,
  });
});

export const updateMyCanteen = catchAsync(async (req, res) => {
  const { name, description, imageUrl, isOpen } = req.body;

  let canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  // AUTO CREATE
  if (!canteen) {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    canteen = await prisma.canteen.create({
      data: {
        ownerId: user.id,
        name: user.name || "Kantin Baru",
        description: "",
        isOpen: false,
      },
    });
  }

  const updatedCanteen = await prisma.canteen.update({
    where: {
      id: canteen.id,
    },
    data: {
      name,
      description,
      imageUrl,
      isOpen,
    },
  });

  io.emit("canteen-status-updated", {
    canteenId: updatedCanteen.id,
    isOpen: updatedCanteen.isOpen,
  });

  res.status(200).json({
    success: true,
    message: "Profil kantin berhasil diperbarui",
    data: updatedCanteen,
  });
});

export const updateCanteenStatus = catchAsync(async (req, res) => {
  const { isOpen } = req.body;

  const canteen = await prisma.canteen.update({
    where: {
      ownerId: req.user.id,
    },
    data: {
      isOpen,
    },
  });

  io.emit("canteen-status-updated", {
    canteenId: canteen.id,
    isOpen: canteen.isOpen,
  });

  res.status(200).json({
    success: true,
    message: "Status kantin berhasil diperbarui",
    data: canteen,
  });

  res.status(200).json({
    success: true,
    message: "Status kantin berhasil diperbarui",
    data: canteen,
  });
});

export const getAllCanteens = catchAsync(async (req, res) => {
  const canteens = await prisma.canteen.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      isOpen: true,
      imageUrl: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: canteens,
  });
});

export const getCanteenById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const canteen = await prisma.canteen.findUnique({
    where: { id },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  res.status(200).json({
    success: true,
    data: canteen,
  });
});

export const getCanteenMenus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const menus = await prisma.menu.findMany({
    where: {
      canteenId: id,
      isAvailable: true,
      isDeleted: false,
    },

    include: {
      category: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: menus,
  });
});

export const getCanteenStats = catchAsync(async (req, res) => {
  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const totalMenus = await prisma.menu.count({
    where: {
      canteenId: canteen.id,
      isDeleted: false,
    },
  });

  const totalOrders = await prisma.order.count({
    where: {
      canteenId: canteen.id,
    },
  });

  const pendingOrders = await prisma.order.count({
    where: {
      canteenId: canteen.id,
      status: "PENDING",
    },
  });

  const readyOrders = await prisma.order.count({
    where: {
      canteenId: canteen.id,
      status: "READY",
    },
  });

  const completedOrders = await prisma.order.count({
    where: {
      canteenId: canteen.id,
      status: "COMPLETED",
    },
  });

  const revenue = await prisma.order.aggregate({
    where: {
      canteenId: canteen.id,
      status: "COMPLETED",
    },

    _sum: {
      totalPrice: true,
    },
  });

  res.status(200).json({
    success: true,

    data: {
      totalMenus,
      totalOrders,

      pendingOrders,
      readyOrders,
      completedOrders,

      revenue: Number(revenue._sum.totalPrice || 0),
    },
  });
});

export const getDashboardStats = async (req, res) => {
  try {
    const canteen = await prisma.canteen.findUnique({
      where: {
        ownerId: req.user.id,
      },
    });

    if (!canteen) {
      return res.status(404).json({
        message: "Kantin tidak ditemukan",
      });
    }

    const totalMenus = await prisma.menu.count({
      where: {
        canteenId: canteen.id,
        isDeleted: false,
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        canteenId: canteen.id,
      },
    });

    const totalOrders = orders.length;

    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

    const readyOrders = orders.filter((o) => o.status === "READY").length;

    const completedOrders = orders.filter(
      (o) => o.status === "COMPLETED",
    ).length;

    const revenue = orders
      .filter((o) => o.status === "COMPLETED")
      .reduce((sum, o) => sum + Number(o.totalPrice), 0);

    res.json({
      success: true,
      data: {
        totalMenus,
        totalOrders,
        revenue,
        pendingOrders,
        readyOrders,
        completedOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const canteen = await prisma.canteen.findUnique({
      where: {
        ownerId: req.user.id,
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        canteenId: canteen.id,

        status: "COMPLETED",
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    const chartData = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];

      if (!chartData[date]) {
        chartData[date] = 0;
      }

      chartData[date] += Number(order.totalPrice);
    });

    const result = Object.entries(chartData).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    res.json({
      success: true,

      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
