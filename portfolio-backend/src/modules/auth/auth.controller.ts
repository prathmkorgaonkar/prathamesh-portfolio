
import type { RequestHandler } from "express";
import { z } from "zod";
import {
  registerAdmin,
  loginAdmin,
} from "./auth.service.js";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(72),
});

export const register: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });
      return;
    }

    const admin = await registerAdmin(
      validation.data.name,
      validation.data.email,
      validation.data.password
    );

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });
      return;
    }

    const result = await loginAdmin(
      validation.data.email,
      validation.data.password
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const getProfile: RequestHandler = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin profile fetched successfully",
    data: {
      userId: req.user?.userId,
      email: req.user?.email,
    },
  });
};