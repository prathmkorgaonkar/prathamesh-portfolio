
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { deleteContactHandler, getAllContactsHandler, getContactByIdHandler, submitContact, updateContactReadStatusHandler } from "./contact.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages submitted. Please try again later.",
  },
});

router.post("/", contactLimiter, submitContact);

router.get("/", authenticate, getAllContactsHandler);
router.get("/:id", authenticate, getContactByIdHandler);
router.patch("/:id/read", authenticate, updateContactReadStatusHandler);
router.delete("/:id", authenticate, deleteContactHandler);

export default router;
