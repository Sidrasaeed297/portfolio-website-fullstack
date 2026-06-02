// src/services/portfolioService.js
import api from "./api";

// Skills endpoints
const SKILLS_BASE = "/skills";
export const createSkill = (data) => api.post(SKILLS_BASE, data);
export const getSkillById = (id) => api.get(`${SKILLS_BASE}/${id}`);
export const getSkills = (params = {}) => api.get(SKILLS_BASE, { params });
export const updateSkill = (id, data) => api.put(`${SKILLS_BASE}/${id}`, data);
export const deleteSkill = (id) => api.delete(`${SKILLS_BASE}/${id}`);
export const searchSkills = (query, extraParams = {}) =>
  getSkills({ q: query, ...extraParams });

// Experience endpoints (placeholder – will be used later)
const EXPERIENCE_BASE = "/experience";
export const createExperience = (data) => api.post(EXPERIENCE_BASE, data);
export const getExperienceById = (id) => api.get(`${EXPERIENCE_BASE}/${id}`);
export const getExperiences = (params = {}) => api.get(EXPERIENCE_BASE, { params });
export const updateExperience = (id, data) => api.put(`${EXPERIENCE_BASE}/${id}`, data);
export const deleteExperience = (id) => api.delete(`${EXPERIENCE_BASE}/${id}`);
export const searchExperiences = (query, extraParams = {}) =>
  getExperiences({ q: query, ...extraParams });

// Education endpoints (placeholder – will be used later)
const EDUCATION_BASE = "/education";
export const createEducation = (data) => api.post(EDUCATION_BASE, data);
export const getEducationById = (id) => api.get(`${EDUCATION_BASE}/${id}`);
export const getEducations = (params = {}) => api.get(EDUCATION_BASE, { params });
export const updateEducation = (id, data) => api.put(`${EDUCATION_BASE}/${id}`, data);
export const deleteEducation = (id) => api.delete(`${EDUCATION_BASE}/${id}`);
export const searchEducations = (query, extraParams = {}) =>
  getEducations({ q: query, ...extraParams });
