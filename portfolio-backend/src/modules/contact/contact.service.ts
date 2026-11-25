
import { AppDataSource } from "../../database/data-source.js";
import { Contact } from "../../database/entities/contact.entity.js";
import { AppError } from "../../utils/appError.js";
import type { ContactQueryInput } from "../../validations/contact.validation.js";

const contactRepository = AppDataSource.getRepository(Contact);

interface CreateContactInput {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const createContact = async (contactData: CreateContactInput) => {
    const contact = contactRepository.create(contactData);

    return await contactRepository.save(contact);
};

// GET ALL CONTACT MESSAGES
export const getAllContacts = async (filters: ContactQueryInput) => {
    const { page, limit, isRead, search } = filters;

    const query = contactRepository.createQueryBuilder("contact");

    if (isRead !== undefined) {
        query.andWhere("contact.isRead = :isRead", {
            isRead: isRead === "true",
        });
    }

    if (search) {
        query.andWhere(
            `(
        contact.name ILIKE :search OR
        contact.email ILIKE :search OR
        contact.subject ILIKE :search
      )`,
            { search: `%${search}%` }
        );
    }

    query
        .orderBy("contact.createdAt", "DESC")
        .skip((page - 1) * limit)
        .take(limit);

    const [contacts, total] = await query.getManyAndCount();

    return {
        contacts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// GET CONTACT BY ID
export const getContactById = async (id: string) => {
    const contact = await contactRepository.findOneBy({ id });

    if (!contact) {
        throw new AppError("Contact message not found", 404);
    }

    return contact;
};

// MARK CONTACT AS READ / UNREAD
export const updateContactReadStatus = async (id: string, isRead: boolean) => {
    const contact = await getContactById(id);

    contact.isRead = isRead;

    return await contactRepository.save(contact);
};

// DELETE CONTACT
export const deleteContact = async (id: string) => {
    const contact = await getContactById(id);

    await contactRepository.remove(contact);

    return {
        message: "Contact message deleted successfully",
    };
};