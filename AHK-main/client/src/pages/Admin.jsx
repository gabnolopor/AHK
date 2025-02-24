import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { FiUser, FiLock, FiEye, FiEyeOff, FiFile, FiMusic, FiImage, FiFileText, FiPlus, FiSettings, FiUpload } from 'react-icons/fi';
import '../styles/Admin.css';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

function Admin() {
  const [isLoginView, setIsLoginView] = useState(!localStorage.getItem('isAdminAuthenticated'));
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedFile, setSelectedFile] = useState({ id: null, type: null });
  const [filePreview, setFilePreview] = useState(null);
  
  const [files, setFiles] = useState({
    artwork: null,
    music: null,
    photo: null,
    writing: null
  });

  const [formData, setFormData] = useState({
    artwork: { title: '', description: '' },
    music: { title: '', description: '' },
    photo: { title: '', description: '' },
    writing: { title: '', description: '' }
  });

  const [contentList, setContentList] = useState({
    artwork: [
      { id: 1, title: 'Abstract Sunset', date: '2024-03-15' },
      { id: 2, title: 'Urban Landscape', date: '2024-03-10' }
    ],
    music: [
      { id: 1, title: 'Summer Breeze', date: '2024-03-14' },
      { id: 2, title: 'Night Drive', date: '2024-03-08' }
    ],
    photo: [
      { id: 1, title: 'Mountain Vista', date: '2024-03-13' },
      { id: 2, title: 'Ocean Waves', date: '2024-03-09' }
    ],
    writing: [
      { id: 1, title: 'Short Story Collection', date: '2024-03-12' },
      { id: 2, title: 'Poetry Series', date: '2024-03-07' }
    ]
  });

  const [backgroundSettings, setBackgroundSettings] = useState(() => {
    const savedSettings = localStorage.getItem('backgroundSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      type: 'gradient',
      gradientStart: '#1a1a1a',
      gradientEnd: '#4a4a4a',
      image: null,
      imageUrl: null
    };
  });

  useEffect(() => {
    localStorage.setItem('backgroundSettings', JSON.stringify(backgroundSettings));
  }, [backgroundSettings]);

  const getBackgroundStyle = () => ({
    background: backgroundSettings.type === 'gradient'
      ? `linear-gradient(135deg, ${backgroundSettings.gradientStart}, ${backgroundSettings.gradientEnd})`
      : backgroundSettings.imageUrl
      ? `url(${backgroundSettings.imageUrl})`
      : 'initial',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  });

  const [showStyleModal, setShowStyleModal] = useState(false);

  const navigate = useNavigate();

  const contentTypes = {
    artwork: { icon: FiFile, accepts: '.png,.jpg,.jpeg' },
    music: { icon: FiMusic, accepts: '.mp3' },
    photo: { icon: FiImage, accepts: '.png,.jpg,.jpeg' },
    writing: { icon: FiFileText, accepts: '.pdf' }
  };

  const { loading: apiLoading, error: apiError, handleRequest } = useApi();
  
  const [backendPhotos, setBackendPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photos = await handleRequest(apiService.getAllPhotography);
        setBackendPhotos(photos);
        
        setContentList(prev => ({
          ...prev,
          photo: photos.map(photo => ({
            id: photo._id,
            title: photo.name,
            description: photo.description,
            date: new Date().toISOString().split('T')[0],
            imageUrl: photo.imageUrl
          }))
        }));
      } catch (err) {
        console.error('Failed to fetch photos:', err);
        toast.error('Failed to load photos');
      }
    };

    if (!isLoginView) {
      fetchPhotos();
    }
  }, [isLoginView, handleRequest]);

  const handleInputChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      
      const previewType = file.type.startsWith('image/') ? URL.createObjectURL(file) :
                         file.type === 'application/pdf' ? 'pdf' :
                         file.type.includes('audio') ? 'audio' : null;
      
      setFilePreview(previewType);
      toast.success(`${file.name} selected successfully!`, { icon: '📁' });
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (!formData[type].title || !files[type]) {
      toast.error('Please fill all required fields');
      return;
    }

    const uploadPromise = new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.promise(uploadPromise, {
      loading: 'Uploading...',
      success: () => {
        if (selectedFile.id) {
          setContentList(prev => ({
            ...prev,
            [type]: prev[type].map(item => 
              item.id === selectedFile.id 
                ? { 
                    ...item, 
                    title: formData[type].title,
                    description: formData[type].description,
                    date: new Date().toISOString().split('T')[0] 
                  }
                : item
            )
          }));
        } else {
          setContentList(prev => ({
            ...prev,
            [type]: [...prev[type], {
              id: Math.max(...prev[type].map(item => item.id)) + 1,
              title: formData[type].title,
              description: formData[type].description,
              date: new Date().toISOString().split('T')[0]
            }]
          }));
        }

        // Reset states
        setFiles(prev => ({ ...prev, [type]: null }));
        setFormData(prev => ({
          ...prev,
          [type]: { title: '', description: '' }
        }));
        setShowModal(false);
        setSelectedFile({ id: null, type: null });
        setFilePreview(null);

        return `${type.charAt(0).toUpperCase() + type.slice(1)} ${selectedFile.id ? 'updated' : 'uploaded'} successfully!`;
      },
      error: 'Upload failed'
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Show loading animation
    const loginPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'test' && credentials.password === 'test') {
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000); // Simulate API call
    });

    toast.promise(loginPromise, {
      loading: 'Authenticating...',
      success: () => {
        localStorage.setItem('isAdminAuthenticated', 'true');
        setIsLoginView(false);
        navigate('/admin');
        return 'Successfully logged in!';
      },
      error: () => {
        return 'Invalid username or password';
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsLoginView(true);
    toast.success('Logged out successfully');
  };

  const handleFileSelect = (fileId, type) => {
    setSelectedFile({ id: fileId, type: type });
    setModalType(type);
    // Pre-fill form data with existing title
    const selectedItem = contentList[type].find(item => item.id === fileId);
    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          title: selectedItem.title
        }
      }));
    }
    setShowModal(true);
  };

  const handleAddNew = (type) => {
    setSelectedFile({ id: null, type: type });
    setModalType(type);
    setShowModal(true);
  };


  const renderFilePreview = () => {
    if (!filePreview) return null;

    const fileName = files[modalType]?.name;
    const PreviewIcon = contentTypes[modalType]?.icon;

    return (
      <div className="file-preview-container">
        {filePreview.startsWith('blob:') ? (
          <img src={filePreview} alt="Preview" className="file-preview-image" />
        ) : (
          <>
            <PreviewIcon className="preview-icon" />
            <span>{filePreview === 'pdf' ? 'PDF Document' : 'Audio File'}</span>
          </>
        )}
        {fileName && <div className="file-name">{fileName}</div>}
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;

    const { accepts } = contentTypes[modalType];
    const isEditing = selectedFile.id !== null;

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">
              {isEditing ? `Edit ${modalType}` : `Add New ${modalType}`}
            </h3>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
          </div>
          
          <form className="modal-form" onSubmit={(e) => handleSubmit(e, modalType)}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                value={formData[modalType].title}
                onChange={(e) => handleInputChange(modalType, 'title', e.target.value)}
                required
                placeholder="Enter title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <textarea
                className="form-textarea"
                value={formData[modalType].description}
                onChange={(e) => handleInputChange(modalType, 'description', e.target.value)}
                placeholder="Enter description (optional)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">File *</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept={accepts}
                  className="file-input"
                  onChange={(e) => handleFileChange(e, modalType)}
                  required={!isEditing}
                />
                <span className="file-input-text">
                  Click to select or drag a file here
                </span>
                {renderFilePreview()}
              </div>
            </div>

            <button type="submit" className="action-button">
              {isEditing ? 'Update' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderFileList = (type) => {
    const Icon = contentTypes[type].icon;

    return (
      <>
        <div className="section-header">
          <h2 className="section-title">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <button 
            className="add-new-button"
            onClick={() => handleAddNew(type)}
          >
            <FiPlus /> Add New
          </button>
        </div>
        
        <div className="file-list">
          {contentList[type].map((file) => (
            <div
              key={file.id}
              className={`file-list-item ${
                selectedFile.id === file.id && selectedFile.type === type ? 'selected' : ''
              }`}
              onClick={() => handleFileSelect(file.id, type)}
            >
              {type === 'photo' && file.imageUrl ? (
                <img 
                  src={file.imageUrl} 
                  alt={file.title}
                  className="file-preview"
                />
              ) : (
                <Icon className="file-icon" />
              )}
              <div className="file-details">
                <div className="file-title">{file.title}</div>
                <div className="file-date">{file.date}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const handleCloseStyleModal = () => {
    if (backgroundSettings.type === 'image' && !backgroundSettings.imageUrl) {
      URL.revokeObjectURL(backgroundSettings.imageUrl);
    }
    setShowStyleModal(false);
  };

  const handleBackgroundImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackgroundSettings(prev => ({
        ...prev,
        type: 'image',
        image: file,
        imageUrl: url
      }));
      localStorage.setItem('backgroundSettings', JSON.stringify({
        ...backgroundSettings,
        type: 'image',
        imageUrl: url
      }));
      toast.success(`${file.name} selected as background`, {
        icon: '🖼️',
        duration: 2000,
      });
    }
  };

  const handleGradientChange = (color, position) => {
    setBackgroundSettings(prev => ({
      ...prev,
      type: 'gradient',
      [position]: color
    }));
    localStorage.setItem('backgroundSettings', JSON.stringify({
      ...backgroundSettings,
      type: 'gradient',
      [position]: color
    }));
  };

  const renderBackgroundPreview = () => {
    if (backgroundSettings.type !== 'image') return null;
    if (!backgroundSettings.imageUrl) return null;

    return (
      <div className="background-preview-container">
        <img 
          src={backgroundSettings.imageUrl} 
          alt="Background Preview" 
          className="background-preview-image"
        />
        <span className="background-file-name">
          {backgroundSettings.image?.name || 'Current background image'}
        </span>
      </div>
    );
  };

  const renderStyleModal = () => {
    if (!showStyleModal) return null;

    return (
      <div className="modal-overlay" onClick={handleCloseStyleModal}>
        <div className="modal-content style-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Customize Background</h3>
            <button className="modal-close" onClick={() => setShowStyleModal(false)}>×</button>
          </div>
          
          <div className="style-options">
            <div className="form-group">
              <label className="form-label">Background Type</label>
              <div className="button-group">
                <button
                  className={`style-button ${backgroundSettings.type === 'gradient' ? 'active' : ''}`}
                  onClick={() => setBackgroundSettings(prev => ({ ...prev, type: 'gradient' }))}
                >
                  Gradient
                </button>
                <button
                  className={`style-button ${backgroundSettings.type === 'image' ? 'active' : ''}`}
                  onClick={() => setBackgroundSettings(prev => ({ ...prev, type: 'image' }))}
                >
                  Image
                </button>
              </div>
            </div>

            {backgroundSettings.type === 'gradient' ? (
              <div className="gradient-controls">
                <div className="form-group">
                  <label className="form-label">Start Color</label>
                  <input
                    type="color"
                    value={backgroundSettings.gradientStart}
                    onChange={(e) => handleGradientChange(e.target.value, 'gradientStart')}
                    className="color-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Color</label>
                  <input
                    type="color"
                    value={backgroundSettings.gradientEnd}
                    onChange={(e) => handleGradientChange(e.target.value, 'gradientEnd')}
                    className="color-input"
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Background Image</label>
                <div className="background-upload-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImage}
                    className="file-input"
                  />
                  <div className="background-upload-text">
                    <FiUpload className="upload-icon" />
                    <span>Click to select or drag an image here</span>
                  </div>
                </div>
                {renderBackgroundPreview()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLogin = () => {
    return (
      <div 
        className="login-container"
        style={getBackgroundStyle()}
      >
        <div className="login-card">
          <h1 className="login-title">Admin Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-input-group">
              <FiUser className="login-form-icon" />
              <input
                type="text"
                className="login-form-input"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>
            <div className="login-input-group">
              <FiLock className="login-form-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="login-form-input"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div 
        className="dashboard-container"
        style={getBackgroundStyle()}
      >
        <Toaster position="top-right" />
        <div className="dashboard-header">
          <h1 className="dashboard-title">AHK</h1>
          <div className="dashboard-controls">
            <button 
              onClick={() => setShowStyleModal(true)} 
              className="style-settings-button"
            >
              <FiSettings /> Style
            </button>
            <button onClick={handleLogout} className="logout-button">
              <FiLock /> Logout
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="content-section">
            {renderFileList('artwork')}
          </div>

          <div className="content-section">
            {renderFileList('music')}
          </div>

          <div className="content-section">
            {renderFileList('photo')}
          </div>

          <div className="content-section">
            {renderFileList('writing')}
          </div>
        </div>
      </div>
    );
  };

  if (isLoginView) {
    return renderLogin();
  }

  return (
    <>
      {renderDashboard()}
      {renderModal()}
      {renderStyleModal()}
    </>
  );
}

export default Admin;