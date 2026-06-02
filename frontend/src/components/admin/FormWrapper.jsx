// src/components/admin/FormWrapper.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

/**
 * FormWrapper – a thin wrapper around React Hook Form.
 *
 * Props:
 *   - defaultValues: object – initial form values (for edit mode)
 *   - onSubmit: (data) => Promise – handler that returns a promise.
 *   - validation: object – RHF validation rules keyed by field name.
 *   - children: function – render prop receiving { register, errors, isSubmitting }.
 *   - submitLabel: string – button text.
 */
export default function FormWrapper({
  defaultValues = {},
  onSubmit,
  validation = {},
  children,
  submitLabel = "Submit",
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  // Reset form values when defaultValues change (e.g., editing mode)
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const internalSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (e) {
      // bubble up – UI can show toast elsewhere.
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
      {children({ register, errors })}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

FormWrapper.propTypes = {
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  validation: PropTypes.object,
  children: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
};
