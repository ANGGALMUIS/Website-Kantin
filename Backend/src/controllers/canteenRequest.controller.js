import prisma from "../config/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createCanteenRequest = catchAsync(async (req, res) => {
  console.log("===== DEBUG =====");
  console.log("req.user =", req.user);
  console.log("prisma.canteenRequest =", prisma.canteenRequest);

  const { name, description, imageUrl, proposalUrl } = req.body;
  console.log("REQ BODY:", req.body);
  console.log("PROPOSAL URL:", proposalUrl);
  console.log("=== PRISMA MODELS ===");
  console.log(Object.keys(prisma));
  console.log("canteenRequest =", prisma.canteenRequest);
  const existingRequest = await prisma.canteenRequest.findFirst({
    where: {
      userId: req.user.id,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    throw new AppError(
      "Kamu masih memiliki pengajuan yang menunggu persetujuan",
      400,
    );
  }

  const request = await prisma.canteenRequest.create({
    data: {
      userId: req.user.id,
      name,
      description,
      imageUrl,
      proposalUrl,
    },
  });

  res.status(201).json({
    success: true,
    message: "Pengajuan kantin berhasil dikirim",
    data: request,
  });
});

export const getMyRequest = catchAsync(async (req, res) => {
  const request = await prisma.canteenRequest.findFirst({
    where: {
      userId: req.user.id,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: request,
  });
});
