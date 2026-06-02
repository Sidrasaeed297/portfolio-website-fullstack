// src/pages/admin/Blogs.jsx
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CRUDTable from "../../components/admin/CRUDTable";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  getBlogs,
  deleteBlog,
} from "../../services/blogService";

export default function Blogs() {
  const navigate = useNavigate();
  const [confirm, setConfirm] = React.useState({ open: false, item: null });

  const fetchData = useCallback(async ({ skip, limit, search, sort, order }) => {
    const params = {
      skip,
      limit,
      q: search || undefined,
      sort: sort || undefined,
      order: order || undefined,
    };
    const resp = await getBlogs(params);
    return { items: resp.data.items, total: resp.data.total };
  }, []);

  const handleEdit = (item) => {
    navigate(`/admin/blogs/${item.id}/edit`);
  };

  const handleDelete = (item) => {
    setConfirm({ open: true, item });
  };

  const confirmDelete = async () => {
    if (!confirm.item) return;
    await deleteBlog(confirm.item.id);
    setConfirm({ open: false, item: null });
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      <button
        onClick={() => navigate("/admin/blogs/create")}
        className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
      >
        + New Blog
      </button>
      <CRUDTable
        columns={[
          { header: "Title", accessor: "title", sortable: true },
          { header: "Published", accessor: "published", sortable: true },
        ]}
        fetchData={fetchData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ConfirmDialog
        open={confirm.open}
        title="Delete Blog"
        message={`Are you sure you want to delete "${confirm.item?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, item: null })}
      />
    </section>
  );
}
