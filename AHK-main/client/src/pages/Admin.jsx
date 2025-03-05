import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiTrash2,
  FiLogOut,
  FiMusic,
  FiFile,
} from "react-icons/fi";
import "../styles/Admin.css";
import { apiService } from "../services/api";
import { useApi } from "../hooks/useApi";

// Constants
const WRITING_GENRES = [
  "Poetry",
  "Excripts",
  "What They Say",
  "Written Work",
  "Puicos",
];
const MUSIC_GENRES = ["Soundtrack", "Pop", "Rock", "Electro", "Other"];

function Admin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedFile, setSelectedFile] = useState({ id: null, type: null });
  const [filePreview, setFilePreview] = useState(null);

  // Database content states
  const [dbContent, setDbContent] = useState({
    photo: [],
    artwork: [],
    music: [],
    writing: [],
  });

  const [formData, setFormData] = useState({
    artwork: { title: "", description: "" },
    music: { title: "", description: "", genre: "" },
    photo: { title: "", description: "" },
    writing: { title: "", description: "", genre: "" },
  });

  const { loading: apiLoading, error: apiError, handleRequest } = useApi();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [pageTitles, setPageTitles] = useState({
    photo: "Default Photo Title",
    art: "Default Art Title",
  });

  // Load titles from localStorage on component mount
  useEffect(() => {
    const storedTitles = JSON.parse(localStorage.getItem("pageTitles"));
    if (storedTitles) {
      setPageTitles(storedTitles);
    }
  }, []);

  // Save titles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pageTitles", JSON.stringify(pageTitles));
  }, [pageTitles]);

  const handleTitleChange = (page, newTitle) => {
    setPageTitles((prevTitles) => ({
      ...prevTitles,
      [page]: newTitle,
    }));
  };

  // Fetch all content from database
  useEffect(() => {
    const fetchAllContent = async () => {
      if (isAuthenticated) {
        // Only fetch if authenticated
        try {
          const [artwork, music, photos, writings] = await Promise.all([
            handleRequest(() => apiService.getAllPaintings()),
            handleRequest(() => apiService.getAllMusic()),
            handleRequest(() => apiService.getAllPhotography()),
            handleRequest(() => apiService.getAllWritings()),
          ]);

          setDbContent({
            artwork: artwork || [],
            music: music || [],
            photo: photos || [],
            writing: writings || [],
          });
        } catch (error) {
          console.error("Error fetching content:", error);
          toast.error("Failed to load content");
        }
      }
    };

    fetchAllContent();
  }, [isAuthenticated, handleRequest]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await apiService.verifyAdminToken();
        setIsAuthenticated(isValid);
        if (!isValid) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("isAdminAuthenticated");
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("isAdminAuthenticated");
      }
    };

    checkAuth();
  }, []);

  const contentTypes = {
    artwork: { accepts: ".png,.jpg,.jpeg" },
    music: { accepts: ".mp3" },
    photo: { accepts: ".png,.jpg,.jpeg" },
    writing: { accepts: ".txt, .pdf" },
  };

  const handleInputChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
        const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB in bytes

        if (file.size > maxSizeInBytes) {
            alert('File size exceeds 10 MB. Please select a smaller file.');
            return;
        }

        setFilePreview({
            url: URL.createObjectURL(file),
            filename: file.name
        });
        toast.success(`${file.name} selected successfully!`, { icon: "📁" });
    }
};

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      const title = formData[type].title;
      formDataToSend.append("name", title);

      // Handle different content types
      if (type === "writing" || type === "music") {
        // Append genre for both writing and music types
        formDataToSend.append("genre", formData[type].genre);
      } else if (type === "photo" || type === "artwork") {
        formDataToSend.append("description", formData[type].description || "");
      }

      const file = fileInputRef.current?.files[0];
      if (file) {
        const fileExtension = file.name.split(".").pop();
        const newFileName = `${title
          .toLowerCase()
          .replace(/\s+/g, "-")}.${fileExtension}`;
        const renamedFile = new File([file], newFileName, { type: file.type });
        formDataToSend.append("file", renamedFile);
      }

      if (selectedFile.id) {
        await handleRequest(() =>
          apiService.updateContent(type, selectedFile.id, formDataToSend)
        );
        toast.success("Item updated successfully!");
      } else {
        await handleRequest(() =>
          apiService.uploadContent(type, formDataToSend)
        );
        toast.success("Item added successfully!");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to ${selectedFile.id ? "update" : "add"} ${type}`);
      setIsLoading(false);
    }
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setSelectedFile({ id: null, type });
    setFormData({
      ...formData,
      [type]: {
        title: "",
        genre: type === "writing" ? "" : undefined,
      },
    });
    setShowModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiService.loginAdmin({
        username: loginData.username,
        password: loginData.password,
      });
      setIsAuthenticated(true);
      localStorage.setItem("isAdminAuthenticated", "true");
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setIsLoading(true);
    try {
      await handleRequest(() => apiService.deleteContent(type, id));

      setDbContent((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item._id !== id),
      }));

      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async (file, type) => {
    setSelectedFile({ id: file._id, type });
    setModalType(type);
    
    // Set the form data with existing values
    setFormData(prev => ({
        ...prev,
        [type]: {
            title: file.name || '',
            description: file.description || '',
            genre: file.genre || '',
        }
    }));

    // Set file preview with filename and URL
    setFilePreview({
        url: file.imageUrl || '', // Use the existing URL
        filename: file.filename // Set the filename
    });

    setShowModal(true);
  };

  const renderFilePreview = () => {
    console.log(filePreview);
    if (!filePreview) return null;

    if (filePreview.filename.includes('writings/')) {
        return (
            <div className="file-previewText">
                <FiFile size={24} />
                <p>{filePreview.filename.split('/').pop() || 'Text Document'}</p>
            </div>
        );
    }

    if (filePreview.filename.includes('music/')) {
        return (
            <div className="file-previewAudio">
                <FiMusic size={24} />
                <p>{filePreview.filename.split('/').pop() || 'Audio File'}</p>
            </div>
            
        );
    }

    return (
        <div className="file-previewImage">
            <img src={filePreview.url} alt="Preview" />
            <p>{filePreview.filename.split('/').pop() || 'Image'}</p>
        </div>
    );
    
  };

  const renderModal = () => {
    if (!showModal) return null;

    const { accepts } = contentTypes[modalType];
    const isEditing = selectedFile.id !== null;
    const isWriting = modalType === "writing";
    const isMusic = modalType === "music";
    const showDescription = modalType === "photo" || modalType === "artwork";

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">
              {isEditing ? `Edit ${modalType}` : `Add New ${modalType}`}
            </h3>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
          </div>

          <form
            className="modal-form"
            onSubmit={(e) => handleSubmit(e, modalType)}
          >
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                value={formData[modalType].title}
                onChange={(e) =>
                  handleInputChange(modalType, "title", e.target.value)
                }
                required
                placeholder="Enter title"
              />
            </div>

            {(isWriting || isMusic) && (
              <div className="form-group">
                <label className="form-label">Genre</label>
                <select
                  className="form-select"
                  value={formData[modalType].genre}
                  onChange={(e) =>
                    handleInputChange(modalType, "genre", e.target.value)
                  }
                  required
                >
                  <option value="">Select a genre</option>
                  {(isWriting ? WRITING_GENRES : MUSIC_GENRES).map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {showDescription && (
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData[modalType].description}
                  onChange={(e) =>
                    handleInputChange(modalType, "description", e.target.value)
                  }
                  placeholder="Enter description"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">File {!isEditing && "*"}</label>
              <div className="file-input-wrapper">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accepts}
                  className="file-input"
                  onChange={(e) => handleFileChange(e, modalType)}
                  required={!isEditing}
                />
                <span className="file-input-text">
                  {isEditing
                    ? "Choose new file to replace existing"
                    : "Click to select or drag a file here"}
                </span>
                {renderFilePreview()}
              </div>
            </div>

            <button
              type="submit"
              className="action-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⭕
                </motion.div>
              ) : isEditing ? (
                "Update"
              ) : (
                "Upload"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderFileList = (type) => {
    return (
      <>
        <div className="section-header">
          <h2 className="section-title">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button
            className="add-new-button"
            onClick={() => handleAddNew(type)}
            disabled={isLoading}
          >
            <FiPlus /> Add New
          </button>
        </div>

        <div className="file-list">
          {dbContent[type].map((item) => (
            <div key={item._id} className="file-list-item">
              <div
                className="file-details"
                onClick={() => handleEditClick(item, type)}
              >
                {type === "music" ? (
                  <FiMusic className="file-icon" />
                ) : type === "writing" ? (
                  <FiFile className="file-icon" />
                ) : item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="file-preview"
                  />
                ) : null}
                <span className="file-title">{item.name}</span>
              </div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item._id, type);
                }}
                disabled={isLoading}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderTitleControls = () => (
    <div className="title-controls">
      <div className="form-group">
        <label className="form-label">Photo Page Title</label>
        <input
          type="text"
          className="form-input"
          value={pageTitles.photo}
          onChange={(e) => handleTitleChange("photo", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Art Page Title</label>
        <input
          type="text"
          className="form-input"
          value={pageTitles.art}
          onChange={(e) => handleTitleChange("art", e.target.value)}
        />
      </div>
    </div>
  );

  if (isAuthenticated) {
    return (
      <div className="dashboard-container">
        <Toaster position="top-right" />
        <div className="dashboard-header">
          <h1 className="dashboard-title">AHK</h1>
          <div className="dashboard-controls">
            <button onClick={handleLogout} className="logout-button">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="content-section">{renderFileList("artwork")}</div>

          <div className="content-section">{renderFileList("music")}</div>

          <div className="content-section">{renderFileList("photo")}</div>

          <div className="content-section">{renderFileList("writing")}</div>
        </div>

        {showModal && renderModal()}
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-input-group">
            <FiUser className="login-form-icon" />
            <input
              type="text"
              className="login-form-input"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="login-input-group">
            <FiLock className="login-form-icon" />
            <input
              type={showPassword ? "text" : "password"}
              className="login-form-input"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⭕
              </motion.div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;
