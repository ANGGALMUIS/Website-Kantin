import prisma from "../config/prisma.js";
import { generateQueueNumber } from "../utils/queue.js";
import { io } from "../server.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// =====================================
// CREATE ORDER
// =====================================
export const createOrder = catchAsync(async (req, res) => {
  const { canteenId, items } = req.body;

  const canteen = await prisma.canteen.findUnique({
    where: {
      id: canteenId,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  if (!canteen.isOpen) {
    throw new AppError("Kantin sedang tutup", 400);
  }

  const order = await prisma.$transaction(async (tx) => {
    const queueNumber = await generateQueueNumber(tx, canteenId);

    let totalPrice = 0;

    const menuPrices = {};

    for (const item of items) {
      const menu = await tx.menu.findUnique({
        where: {
          id: item.menuId,
        },
      });

      if (!menu) {
        throw new AppError("Menu tidak ditemukan", 404);
      }

      if (!menu.isAvailable) {
        throw new AppError(`${menu.name} sedang tidak tersedia`, 400);
      }

      totalPrice += Number(menu.price) * item.quantity;

      menuPrices[item.menuId] = menu.price;
    }

    return tx.order.create({
      data: {
        buyerId: req.user.id,
        canteenId,
        queueNumber,
        totalPrice,

        items: {
          create: items.map((item) => ({
            menuId: item.menuId,
            quantity: item.quantity,
            price: menuPrices[item.menuId],
          })),
        },
      },

      include: {
        items: true,
      },
    });
  });

  io.to(`canteen_${canteenId}`).emit("new-order", order);

  res.status(201).json({
    success: true,
    message: "Order berhasil dibuat",
    data: order,
  });
});

// =====================================
// BUYER - MY ORDERS
// =====================================
export const getMyOrders = catchAsync(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      buyerId: req.user.id,
    },

    include: {
      items: {
        include: {
          menu: true,
        },
      },

      canteen: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

// =====================================
// CANTEEN - GET ORDERS
// =====================================
export const getCanteenOrders = catchAsync(async (req, res) => {
  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const orders = await prisma.order.findMany({
    where: {
      canteenId: canteen.id,
    },

    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      items: {
        include: {
          menu: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

// =====================================
// UPDATE STATUS ORDER
// =====================================
export const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const canteen = await prisma.canteen.findUnique({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!canteen) {
    throw new AppError("Kantin tidak ditemukan", 404);
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      canteenId: canteen.id,
    },
  });

  if (!order) {
    throw new AppError("Pesanan tidak ditemukan", 404);
  }

  const validStatuses = [
    "PENDING",
    "ACCEPTED",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    throw new AppError("Status tidak valid", 400);
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id,
    },

    data: {
      status,
    },
  });

  io.to(`buyer_${updatedOrder.buyerId}`).emit("order-status-updated", {
    orderId: updatedOrder.id,
    status: updatedOrder.status,
  });

  let notificationMessage = "";

  switch (status) {
    case "ACCEPTED":
      notificationMessage = `Pesanan ${updatedOrder.queueNumber} sedang diproses`;
      break;

    case "READY":
      notificationMessage = `Pesanan ${updatedOrder.queueNumber} siap diambil`;
      break;

    case "COMPLETED":
      notificationMessage = `Pesanan ${updatedOrder.queueNumber} selesai`;
      break;

    case "CANCELLED":
      notificationMessage = `Pesanan ${updatedOrder.queueNumber} dibatalkan`;
      break;

    default:
      notificationMessage = `Status pesanan berubah menjadi ${status}`;
  }

  io.to(`buyer_${updatedOrder.buyerId}`).emit("new-notification", {
    id: Date.now(),
    message: notificationMessage,
    createdAt: new Date(),
  });

  io.to(`canteen_${updatedOrder.canteenId}`).emit(
    "order-updated",
    updatedOrder,
  );

  res.status(200).json({
    success: true,
    message: "Status pesanan berhasil diperbarui",
    data: updatedOrder,
  });
});

// =====================================
// ORDER HISTORY
// =====================================
export const getOrderHistory = catchAsync(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      buyerId: req.user.id,
      status: "COMPLETED",
    },

    include: {
      items: {
        include: {
          menu: true,
        },
      },

      canteen: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: orders,
  });
});
