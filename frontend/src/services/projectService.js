// src/services/projectService.js
import api from "./api";

const BASE_URL = "/projects";

/**
 * Create a new project.
 * @param {Object} data - Project payload.
 * @returns {Promise} Axios response.
 */
export const createProject = (data) => api.post(BASE_URL, data);

/**
 * Get a project by its ID.
 * @param {string|number} id - Project ID.
 */
export const getProjectById = (id) => api.get(`${BASE_URL}/${id}`);

/**
 * Get a list of projects with optional pagination, sorting and search.
 * @param {Object} params - { skip, limit, q, sort, order }
 */
export const getProjects = (params = {}) => api.get(BASE_URL, { params });

/**
 * Update an existing project.
 * @param {string|number} id - Project ID.
 * @param {Object} data - Updated fields.
 */
export const updateProject = (id, data) => api.put(`${BASE_URL}/${id}`, data);

/**
 * Delete a project.
 * @param {string|number} id - Project ID.
 */
export const deleteProject = (id) => api.delete(`${BASE_URL}/${id}`);

/**
 * Search projects (alias for getProjects with query).
 * @param {string} query - Search term.
 * @param {Object} extraParams - Additional pagination/sort params.
 */
export const searchProjects = (query, extraParams = {}) =>
  getProjects({ q: query, ...extraParams });
