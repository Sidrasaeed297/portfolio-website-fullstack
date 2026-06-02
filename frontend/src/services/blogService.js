// src/services/blogService.js
import api from "./api";

const BASE_URL = "/blogs";

export const createBlog = (data) => api.post(BASE_URL, data);
export const getBlogById = (id) => api.get(`${BASE_URL}/${id}`);
export const getBlogs = (params = {}) => api.get(BASE_URL, { params });
export const updateBlog = (id, data) => api.put(`${BASE_URL}/${id}`, data);
export const deleteBlog = (id) => api.delete(`${BASE_URL}/${id}`);
export const searchBlogs = (query, extraParams = {}) =>
  getBlogs({ q: query, ...extraParams });
