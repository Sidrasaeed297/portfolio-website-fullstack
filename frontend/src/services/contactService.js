// src/services/contactService.js
import api from "./api";

/**
 * Submit a new contact message.
 * @param {{ name:string, email:string, subject:string, message:string }} data
 * @returns {Promise<any>}
 */
export const submitContactMessage = (data) => {
  return api.post("/contact", data);
};

/**
 * Fetch contact messages with optional pagination / search.
 * @param {{ skip?:number, limit?:number, q?:string }} params
 * @returns {Promise<any>}
 */
export const getContactMessages = (params = {}) => {
  return api.get("/contact", { params });
};

/**
 * Delete a contact message by ID.
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deleteContactMessage = (id) => {
  return api.delete(`/contact/${id}`);
};
