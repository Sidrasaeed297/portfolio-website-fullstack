import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";

/**
 * CRUDTable – generic table for admin listings.
 * Props:
 *   columns: [{ header: string, accessor: string, sortable?: boolean }]
 *   fetchData: ({ skip, limit, search, sort, order }) => Promise<{ items: any[], total: number }>
 *   onEdit: (item) => void
 *   onDelete: (item) => void
 *   pageSizeOptions?: number[] (default [10,20,50])
 */
export default function CRUDTable({
  columns,
  fetchData,
  onEdit,
  onDelete,
  pageSizeOptions = [10, 20, 50],
}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(pageSizeOptions[0]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("asc");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetchData({ skip, limit, search, sort, order });
      setItems(response.items);
      setTotal(response.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit, search, sort, order]);

  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(skip / limit) + 1;

  const handleSort = (accessor, sortable) => {
    if (!sortable) return;
    if (sort === accessor) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(accessor);
      setOrder("asc");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-2 py-1 w-full md:w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSkip(0);
          }}
        />
        <div className="flex items-center space-x-2">
          <select
            className="border rounded px-2 py-1"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setSkip(0);
            }}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort(col.accessor, col.sortable)}
                >
                  <div className="flex items-center">
                    {col.header}
                    {col.sortable && sort === col.accessor && (
                      <span className="ml-1">
                        {order === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center">
                  No records found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b dark:border-gray-600">
                  {columns.map((col) => (
                    <td key={col.accessor} className="px-4 py-2">
                      {item[col.accessor]}
                    </td>
                  ))}
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center p-4 border-t bg-gray-50 dark:bg-gray-700">
        <button
          disabled={skip === 0}
          onClick={() => setSkip((prev) => Math.max(prev - limit, 0))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={skip + limit >= total}
          onClick={() => setSkip((prev) => prev + limit)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

CRUDTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  fetchData: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
};
