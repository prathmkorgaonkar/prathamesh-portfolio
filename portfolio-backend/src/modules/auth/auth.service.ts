
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source.js";
import { User } from "../../database/entities/user.entity.js";
import { AppError } from "../../utils/appError.js";

const userRepository = AppDataSource.getRepository(User);

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

export const registerAdmin = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await userRepository.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Admin already exists", 409);
  }

  // Allow only the first admin to register.
  const userCount = await userRepository.count();

  if (userCount > 0) {
    throw new AppError("Admin registration is disabled", 403);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = userRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  await userRepository.save(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const loginAdmin = async (
  email: string,
  password: string
) => {
  const user = await userRepository
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne();

  if (!user || !user.isActive) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    getJwtSecret(),
    { expiresIn: "1d" }
  );

  return {
    token,
    admin: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
