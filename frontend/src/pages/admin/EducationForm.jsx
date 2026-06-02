// src/pages/admin/EducationForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormWrapper from "../../components/admin/FormWrapper";
import { createEducation, getEducationById, updateEducation } from "../../services/portfolioService";

/**
 * Admin form for creating or editing an Education entry.
 * Fields: institution, degree, field_of_study, start_date, end_date.
 * Uses FormWrapper (React Hook Form) and validates required fields.
 */
export default function EducationForm() {
  const { id } = useParams(); // undefined for create, defined for edit
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // State for form default values and loading flag (while fetching existing record)
  const [defaultValues, setDefaultValues] = useState({});
  const [loading, setLoading] = useState(isEdit);

  // Load existing education when editing
  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await getEducationById(id);
          setDefaultValues(res.data);
        } catch (e) {
          console.error("Failed to load education", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit]);

  const handleSubmit = async (values) => {
    if (isEdit) {
      await updateEducation(id, values);
    } else {
      await createEducation(values);
    }
    navigate("/admin/education");
  };

  // Render function passed to FormWrapper as children
  const renderFields = ({ register, errors }) => (
    <div className="space-y-4">
      <div>
        <label className="block font-medium mb-1" htmlFor="institution">
          Institution
        </label>
        <input
          id="institution"
          {...register("institution", { required: "Institution is required" })}
          className="w-full border rounded p-2"
        />
        {errors.institution && (
          <p className="text-red-600 text-sm">{errors.institution.message}</p>
        )}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="degree">
          Degree
        </label>
        <input
          id="degree"
          {...register("degree", { required: "Degree is required" })}
          className="w-full border rounded p-2"
        />
        {errors.degree && (
          <p className="text-red-600 text-sm">{errors.degree.message}</p>
        )}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="field_of_study">
          Field of Study
        </label>
        <input
          id="field_of_study"
          {...register("field_of_study", { required: "Field of study is required" })}
          className="w-full border rounded p-2"
        />
        {errors.field_of_study && (
          <p className="text-red-600 text-sm">{errors.field_of_study.message}</p>
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
            {...register("end_date", { required: "End date required" })}
            className="w-full border rounded p-2"
          />
          {errors.end_date && (
            <p className="text-red-600 text-sm">{errors.end_date.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Education" : "Add Education"}
      </h1>
      {/* While loading we could show a spinner – omitted for brevity */}
      <FormWrapper
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Update Education" : "Create Education"}
        // children is a render prop function
        children={renderFields}
      />
    </div>
  );
}
