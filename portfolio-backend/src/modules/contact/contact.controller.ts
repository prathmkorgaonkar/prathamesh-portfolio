
import type { RequestHandler } from "express";
import { z } from "zod";
import { createContact, deleteContact, getAllContacts, getContactById, updateContactReadStatus } from "./contact.service.js";
import { contactIdSchema, contactQuerySchema } from "../../validations/contact.validation.js";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
});

export const submitContact: RequestHandler = async (req, res, next) => {
  try {
    const validation = contactSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const contact = await createContact(validation.data);

    res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully",
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL CONTACTS
export const getAllContactsHandler: RequestHandler = async (req, res, next) => {
  try {
    const filters = contactQuerySchema.parse(req.query);

    const result = await getAllContacts(filters);

    res.status(200).json({
      success: true,
      data: result.contacts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// GET CONTACT BY ID
export const getContactByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = contactIdSchema.parse(req.params.id);

    const contact = await getContactById(id);

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// MARK CONTACT AS READ / UNREAD
export const updateContactReadStatusHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = contactIdSchema.parse(req.params.id);

    const bodySchema = z.object({
      isRead: z.boolean(),
    });

    const { isRead } = bodySchema.parse(req.body);

    const contact = await updateContactReadStatus(id, isRead);

    res.status(200).json({
      success: true,
      message: isRead
        ? "Contact marked as read"
        : "Contact marked as unread",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE CONTACT
export const deleteContactHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = contactIdSchema.parse(req.params.id);

    const result = await deleteContact(id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};