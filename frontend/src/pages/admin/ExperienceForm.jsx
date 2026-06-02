// src/pages/admin/ExperienceForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormWrapper from "../../components/admin/FormWrapper";
import {
  createExperience,
  getExperienceById,
  updateExperience,
} from "../../services/portfolioService";

/**
 * Admin form for creating or editing an Experience entry.
 */
export default function ExperienceForm() {
  const { id } = useParams(); // undefined for create, defined for edit
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // State for existing values (edit mode) and loading flag
  const [defaultValues, setDefaultValues] = useState({});
  const [loading, setLoading] = useState(isEdit);

  // Fetch the existing experience when editing
  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await getExperienceById(id);
          setDefaultValues(res.data);
        } catch (e) {
          console.error("Failed to load experience", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit]);

  const handleSubmit = async (values) => {
    // If current is true, clear end_date (backend may treat null as ongoing)
    const payload = { ...values };
    if (payload.current) payload.end_date = null;
    
    if (isEdit) {
      await updateExperience(id, payload);
    } else {
      await createExperience(payload);
    }
    navigate("/admin/experience");
  };

  // Validation rules and field rendering – supplied to FormWrapper via children render prop
  const renderForm = ({ register, errors, watch, isSubmitting }) => {
    const current = watch("current");
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="company">
            Company
          </label>
          <input
            id="company"
            {...register("company", { required: "Company is required" })}
            className="w-full border rounded p-2"
          />
          {errors.company && (
            <p className="text-red-600 text-sm">{errors.company.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="position">
            Position
          </label>
          <input
            id="position"
            {...register("position", { required: "Position is required" })}
            className="w-full border rounded p-2"
          />
          {errors.position && (
            <p className="text-red-600 text-sm">{errors.position.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", { required: "Description is required" })}
            className="w-full border rounded p-2"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="start_date">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              {...register("start_date", { required: "Start date required" })}
              className="w-full border rounded p-2"
            />
            {errors.start_date && (
              <p className="text-red-600 text-sm">{errors.start_date.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="end_date">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              {...register("end_date", {
                validate: (value) => {
                  if (current) return true; // end date optional when current
                  if (!value) return "End date required unless marked as current";
                  return true;
                },
              })}
              className="w-full border rounded p-2"
            />
            {errors.end_date && (
              <p className="text-red-600 text-sm">{errors.end_date.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="current"
            {...register("current")}
            className="mr-2"
          />
          <label htmlFor="current" className="select-none">
            Currently Working Here
          </label>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          >
            {isEdit ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/experience")}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Experience" : "Add Experience"}
      </h1>
      <FormWrapper
        loadData={loadData}
        onSubmit={handleSubmit}
        render={renderForm}
        resetOnSubmit={true}
      />
    </div>
  );
}
