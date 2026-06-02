// src/pages/admin/Education.jsx
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import CRUDTable from "../../components/admin/CRUDTable";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { getEducations, deleteEducation } from "../../services/portfolioService";

export default function Education() {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState({ open: false, id: null });

  // Data fetcher for CRUDTable – respects pagination, search, sorting
  const fetchData = useCallback(
    async ({ skip = 0, limit = 20, q = "", sort = "", order = "" }) => {
      const res = await getEducations({ skip, limit, q, sort, order });
      // Expected shape: { data: [], total: number }
      return { items: res.data, total: res.total };
    },
    []
  );

  const handleEdit = (id) => {
    navigate(`/admin/education/${id}/edit`);
  };

  const handleDelete = (id) => {
    setConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    if (confirm.id) {
      await deleteEducation(confirm.id);
      setConfirm({ open: false, id: null });
    }
  };

  const columns = [
    { header: "Institution", accessor: "institution" },
    { header: "Degree", accessor: "degree" },
    { header: "Field of Study", accessor: "field_of_study" },
    { header: "Start Date", accessor: "start_date" },
    { header: "End Date", accessor: "end_date" },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.id)}
            className="px-2 py-1 bg-primary text-white rounded hover:bg-primary/80"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Education</h1>
      <div className="mb-4">
        <button
          onClick={() => navigate("/admin/education/create")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          Add Education
        </button>
      </div>
      <CRUDTable columns={columns} fetchData={fetchData} />

      <ConfirmDialog
        open={confirm.open}
        title="Delete Education"
        message="Are you sure you want to delete this education entry?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
    </div>
  );
}
