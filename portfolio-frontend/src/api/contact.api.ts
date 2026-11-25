
import axiosInstance from "./axiosInstance";

import type {
  Contact,
  ContactInput,
  ContactResponse,
} from "../types/contact";

// Public contact form
export const submitContact = async (data: ContactInput) => {
  const response = await axiosInstance.post("/contact", data);
  return response.data;
};

// Admin: Get all contacts
export const getAllContacts = async (
  params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    search?: string;
  }
): Promise<ContactResponse> => {
  const response = await axiosInstance.get<ContactResponse>(
    "/contact",
    { params }
  );

  return response.data;
};

// Admin: Get contact by ID
export const getContactById = async (id: string) => {
  const response = await axiosInstance.get<{ success: boolean; data: Contact }>(
    `/contact/${id}`
  );

  return response.data;
};

// Admin: Mark as Read / Unread
export const updateContactReadStatus = async (
  id: string,
  isRead: boolean
) => {
  const response = await axiosInstance.patch(
    `/contact/${id}/read`,
    { isRead }
  );

  return response.data;
};

// Admin: Delete contact
export const deleteContact = async (id: string) => {
  const response = await axiosInstance.delete(`/contact/${id}`);
  return response.data;
};
