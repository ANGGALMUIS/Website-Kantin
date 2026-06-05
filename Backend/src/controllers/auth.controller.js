import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import axios from "axios";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";


export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw new AppError("Email sudah digunakan", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "BUYER",
      status: "ACTIVE",
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    success: true,
    message: "Registrasi berhasil",
    data: user,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new AppError("Email atau password salah", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Email atau password salah", 401);
  }

  if (user.role === "CANTEEN_ADMIN" && user.status === "PENDING") {
    throw new AppError("Akun kantin masih menunggu persetujuan admin", 403);
  }

  if (user.role === "CANTEEN_ADMIN" && user.status === "REJECTED") {
    throw new AppError("Akun kantin ditolak oleh admin", 403);
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.status(200).json({
    success: true,
    message: "Login berhasil",
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

export const me = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  res.json({
    success: true,
    data: user,
  });
});

export const getMe = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  res.json({
    success: true,
    data: user,
  });
});

export const googleLogin = catchAsync(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new AppError("Access token Google tidak ditemukan", 400);
  }

  // Ambil data user dari Google
  const { data: googleUser } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${credential}`,
      },
    },
  );

  const email = googleUser.email.toLowerCase();

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Auto register buyer
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: googleUser.name,
        email,
        googleId: googleUser.sub,
        avatar: googleUser.picture,
        role: "BUYER",
        status: "ACTIVE",
      },
    });
  }

  // Update googleId jika belum ada
  if (!user.googleId) {
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        googleId: googleUser.sub,
        avatar: googleUser.picture,
      },
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
    },
  });
});
