import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFolderOpen } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { useUser } from "../context/User.context";
import { Menu, X } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import axios from "../config/axios";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [errorOfProjectCreation, setErrorOfProjectCreation] = useState("");
  const [SuccessForProjectionCreation, setSuccessForProjectionCreation] =
    useState("");
  const [projects, setProjects] = useState([]);

// console.log(project)

  // Fetch Projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/projects/all");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error?.response?.data?.error || error.message);
      }
    };
    fetchData();
  }, []);

  const toggleProfileModal = () => {
    setIsProfileOpen((prev) => !prev);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setIsMenuOpen(false);
    navigate("/login");
  };

  const createProject = async (e) => {
    e.preventDefault();
    setErrorOfProjectCreation(""); 
    setSuccessForProjectionCreation(""); 

    if (!projectName.trim()) {
      setErrorOfProjectCreation("Enter Project Name to create a New Project");
      return;
    }

    try {
      const res = await axios.post("/projects/create", { name: projectName });
      setProjects((prev) => [...prev, res.data]); // Update projects instantly
      setProjectName(""); 
      setSuccessForProjectionCreation("Project Created Successfully");

      setTimeout(() => {
        setShowProjectModal(false); 
        setSuccessForProjectionCreation(""); 
      }, 1000);
    } catch (err) {
      setErrorOfProjectCreation(
        err.response?.data?.error || "Failed to create project"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <button
          onClick={() => setShowProjectModal(true)}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-3"
        >
          New Project <FaPlus />
        </button>
        <h1 className="text-2xl font-extrabold tracking-wide text-blue-500">
          CODESYNC
        </h1>
        <div className="flex items-center gap-4 relative">
          <button onClick={toggleMenu}>
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-10 w-40 bg-gray-800 rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
          <button
            onClick={toggleProfileModal}
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </button>
        </div>
      </nav>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-lg w-96 backdrop-blur-md">
            <button
              onClick={toggleProfileModal}
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold text-center mb-4">Profile</h2>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <p className="text-lg font-semibold">{user?.name || "User"}</p>
              <p className="text-gray-400">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Creation Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl backdrop-blur-lg text-center w-80">
            <h2 className="text-xl font-bold mb-4">New Project</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            />
            {errorOfProjectCreation && (
              <div className="text-red-500 text-sm mb-2 text-center my-1">
                {errorOfProjectCreation}
              </div>
            )}
            {SuccessForProjectionCreation && (
              <div className="text-green-500 text-sm mb-2 text-center my-1">
                {SuccessForProjectionCreation}
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={createProject}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="p-4">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center ">
              <h3 className="text-xl font-semibold">{project.name}</h3>
                <h1>
                  collaborators : <span className=" text-blue-500">{project.users?.length}</span>
                </h1>

              </div>
              <button
                onClick={() => navigate("/project", { state: { project } })}
                className="mt-4 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-4"
              >
                <FaFolderOpen /> View Project
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
