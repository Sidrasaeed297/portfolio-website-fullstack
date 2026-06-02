// src/pages/admin/BlogForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormWrapper from "../../components/admin/FormWrapper";
import {
  createBlog,
  getBlogById,
  updateBlog,
} from "../../services/blogService";

export default function BlogForm() {
  const { id } = useParams(); // undefined for create, defined for edit
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
    published: false,
  });

  // Load existing blog when editing
  useEffect(() => {
    if (id) {
      (async () => {
        const resp = await getBlogById(id);
        const data = resp.data;
        setInitialValues({
          title: data.title,
          content: data.content,
          published: data.published,
        });
      })();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    if (id) {
      await updateBlog(id, formData);
    } else {
      await createBlog(formData);
    }
    navigate("/admin/blogs");
  };

  const validation = {
    title: { required: "Title is required" },
    content: { required: "Content is required" },
  };

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Blog" : "Create Blog"}
      </h1>

      <FormWrapper
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        validation={validation}
        submitLabel={id ? "Update" : "Create"}
      >
        {({ register, errors }) => (
          <>
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                {...register("title", validation.title)}
                className="input w-full"
              />
              {errors.title && (
                <p className="text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Content</label>
              <textarea
                {...register("content", validation.content)}
                className="input w-full"
                rows={6}
              />
              {errors.content && (
                <p className="text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("published")}
                id="published"
                className="h-4 w-4"
              />
              <label htmlFor="published" className="font-medium">
                Published
              </label>
            </div>
          </>
        )}
      </FormWrapper>
    </section>
  );
}
