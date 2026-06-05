import prisma from "../config/prisma.js";

export const getPendingCanteens = async (req, res) => {
  try {
    const canteens = await prisma.user.findMany({
      where: {
        role: "CANTEEN_ADMIN",
        status: "PENDING",
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    res.json(canteens);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const approveCanteen = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        status: "ACTIVE",
      },
    });

    const existingCanteen = await prisma.canteen.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (!existingCanteen) {
      await prisma.canteen.create({
        data: {
          ownerId: user.id,
          name: user.name,
          description: "",
          isOpen: false,
        },
      });
    }

    res.json({
      success: true,
      message: "Kantin berhasil diapprove",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectCanteen = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        status: "REJECTED",
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    res.json({
      message: "Kantin berhasil direject",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
   const totalUsers = await prisma.user.count({
     where: {
       role: {
         not: "SUPER_ADMIN",
       },
     },
   });

    const totalBuyers = await prisma.user.count({
      where: {
        role: "BUYER",
      },
    });

    const totalCanteens = await prisma.user.count({
      where: {
        role: "CANTEEN_ADMIN",
      },
    });

    const pendingCanteens = await prisma.user.count({
      where: {
        role: "CANTEEN_ADMIN",

        status: "PENDING",
      },
    });

    const activeCanteens = await prisma.user.count({
      where: {
        role: "CANTEEN_ADMIN",

        status: "ACTIVE",
      },
    });

    const totalOrders = await prisma.order.count();

    res.json({
      success: true,

      data: {
        totalUsers,

        totalBuyers,

        totalCanteens,

        pendingCanteens,

        activeCanteens,

        totalOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.canteenRequest.findMany({
      where: {
        status: "PENDING",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.canteenRequest.findUnique({
      where: {
        id,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: "Pengajuan tidak ditemukan",
      });
    }

    await prisma.user.update({
      where: {
        id: request.userId,
      },
      data: {
        role: "CANTEEN_ADMIN",
      },
    });

    await prisma.canteen.create({
      data: {
        ownerId: request.userId,
        name: request.name,
        description: request.description,
        imageUrl: request.imageUrl,
        isOpen: false,
      },
    });

    await prisma.canteenRequest.update({
      where: {
        id,
      },
      data: {
        status: "APPROVED",
      },
    });

    res.json({
      success: true,
      message: "Pengajuan berhasil disetujui",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const { reason } = req.body;

    await prisma.canteenRequest.update({
      where: {
        id,
      },

      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });

    res.json({
      success: true,
      message: "Pengajuan ditolak",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
