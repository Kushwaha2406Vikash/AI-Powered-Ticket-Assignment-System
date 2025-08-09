import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  // Effect to fetch users on initial component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Effect to filter users whenever the 'users' state or 'searchQuery' changes
  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [users, searchQuery]);

  // Function to fetch all users from the API
  const fetchUsers = async () => {
    try {
      const data = await apiRequest("GET", "/api/auth/users");
      console.log("user data", data);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const data = await apiRequest(
        "POST",
        "/api/auth/update-user",
        {
          email: editingUser,
          role: formData.role,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User updated successfully:", data);

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 ">
      <h1 className="text-2xl font-bold mb-6 text-blue-400 text-center">
        Admin Panel - Manage Users
      </h1>
      <input
        type="text"
        className="input input-bordered w-full mb-6 bg-white placeholder-black border-blue-700 text-black shadow-pink-600"
        placeholder="Search by email"
        value={searchQuery}
        onChange={handleSearch}
      />
      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500">No users found.</p>
      )}
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          className="bg-white text-black rounded p-4 mb-4 border shadow-md shadow-pink-600 "
        >
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Current Role:</strong> {user.role}
          </p>
          <p>
            <strong>Skills:</strong>{" "}
            {user.skills && user.skills.length > 0
              ? user.skills.join(", ")
              : "N/A"}
          </p>

          {editingUser === user.email ? (
            <div className="mt-4 space-y-2">
              <select
                className="select select-bordered w-full bg-white text-black border-blue-700  font-medium border-2 rounded-full"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>

              <input
                type="text"
                placeholder="Comma-separated skills"
                className="input input-bordered w-full mb-6 bg-white placeholder-black text-black  border-blue-700  font-medium border-2 rounded-full"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
              />

              <div className="flex gap-2">
                <button
                  className="btn btn-success btn-sm rounded-lg font-bold hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-200"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                 className="btn btn-ghost btn-sm rounded-lg font-bold hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-200"
                  
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm mt-2 rounded-lg hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => handleEditClick(user)}
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
