import { useState } from 'react';
import { Upload, Video, Image, X, FileVideo, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';

const UploadVideoComponent = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  
  const [formData, setFormData] = useState({
    videoFile: null,
    thumbnail: null,
    title: '',
    description: '',
    category: '',
    isPublished: true
  });
  
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();

  const categories = [
    'Music',
    'Gaming',
    'Sports',
    'News',
    'Entertainment',
    'Education',
    'Technology',
    'Science',
    'Travel',
    'Cooking',
    'Fitness',
    'Fashion',
    'Comedy',
    'Documentary'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Handle visibility radio button separately
    if (name === 'visibility') {
      setFormData(prev => ({
        ...prev,
        isPublished: value === 'true'
      }));
    } else if (type === 'file' && files && files[0]) {
      setIsLoadingFile(true);
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
        setIsLoadingFile(false);
      }, 800);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setIsLoadingFile(true);
        setTimeout(() => {
          setFormData(prev => ({ ...prev, videoFile: file }));
          setIsLoadingFile(false);
        }, 800);
      } else {
        setErrors(prev => ({ ...prev, videoFile: 'Please upload a valid video file' }));
      }
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.videoFile) {
      newErrors.videoFile = 'Please select a video file';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description || formData.description.trim().length === 0) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Description must be less than 5000 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Please upload a thumbnail image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleUpload();
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formDataToSend = new FormData();
      
      // Append video file
      formDataToSend.append('videoFile', formData.videoFile);
      
      // Append thumbnail
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }
      
      // Append other fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('isPublished', formData.isPublished);
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(
        '/api/v1/videos/upload-video',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          timeout: 600000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      if (response.data.success) {
        setIsUploading(false);
        setStep(3);
      }
      
    } catch (error) {
      setIsUploading(false);
      let errorMessage = 'Failed to upload video. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. The request took too long. Please try with a smaller file.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setUploadError(errorMessage);
      console.error('Upload error:', error);
    }
  };

  const handleReset = () => {
    setStep(1);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setFormData({
      videoFile: null,
      thumbnail: null,
      title: '',
      description: '',
      category: '',
      isPublished: true
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleReset();
      navigate("/");
    }
  };

  const removeVideo = () => {
    setFormData(prev => ({ ...prev, videoFile: null }));
    setErrors(prev => ({ ...prev, videoFile: '' }));
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: null }));
    setErrors(prev => ({ ...prev, thumbnail: '' }));
  };

  return (
    <div className="min-h-screen bg-black text-white px-3 py-4 sm:px-6 sm:py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Upload Video</h1>
                <p className="text-gray-400 text-xs sm:text-sm">Share your content with the world</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#272727] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#3a3a3a] transition-all w-full sm:w-auto justify-center"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Cancel
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: 'Upload' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Done' }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s.num 
                      ? 'bg-white text-black' 
                      : 'bg-[#272727] text-gray-400'
                  }`}>
                    {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${
                    step >= s.num ? 'text-white' : 'text-gray-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`h-0.5 flex-1 mx-2 transition-all ${
                    step > s.num ? 'bg-white' : 'bg-[#272727]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6 border border-[#272727]">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Select Video File</h2>
              </div>
              
              {!formData.videoFile ? (
                <div>
                  {isLoadingFile ? (
                    <div className="border-2 border-dashed rounded-xl p-8 sm:p-12 md:p-16 text-center border-[#272727] bg-[#1a1a1a]">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#272727] rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-pulse">
                          <Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium mb-2">Processing Video File...</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">Please wait while we validate your video</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 sm:p-12 md:p-16 text-center transition-all cursor-pointer ${
                        dragActive 
                          ? 'border-white bg-[#1a1a1a]' 
                          : 'border-[#272727] hover:border-gray-500 hover:bg-[#1a1a1a]'
                      }`}
                      onClick={() => document.getElementById('video-input').click()}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#272727] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                          <Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium mb-2">
                          {dragActive ? 'Drop your video here' : 'Drag and drop video file'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">or</p>
                        <button className="bg-white text-black px-5 py-1.5 sm:px-6 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all">
                          Select File
                        </button>
                        <p className="text-xs text-gray-500 mt-3 sm:mt-4">
                          MP4, MOV, AVI, WebM (Max 2GB)
                        </p>
                      </div>
                      <input
                        id="video-input"
                        type="file"
                        name="videoFile"
                        accept="video/*"
                        onChange={handleInputChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#272727] rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileVideo className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white mb-1 truncate text-sm">{formData.videoFile.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeVideo}
                      className="p-2 hover:bg-[#272727] rounded-lg transition-all flex-shrink-0"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
              )}
              
              {errors.videoFile && (
                <p className="text-xs sm:text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.videoFile}
                </p>
              )}

              <button
                onClick={handleNext}
                disabled={!formData.videoFile}
                className="w-full bg-white text-black py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Next: Video Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setStep(1)}
                  className="p-1.5 sm:p-2 hover:bg-[#272727] rounded-lg transition-all flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <h2 className="text-lg sm:text-xl font-semibold">Video Details</h2>
              </div>

              {/* Error Display */}
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-500 font-medium text-sm">Upload Failed</p>
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{uploadError}</p>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={100}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all text-sm ${
                    errors.title 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#272727] focus:border-gray-500'
                  }`}
                  placeholder="Enter video title"
                />
                <div className="flex justify-between mt-1.5">
                  {errors.title && (
                    <p className="text-xs text-red-500">{errors.title}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.title.length}/100
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={5000}
                  rows={4}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all resize-none text-sm ${
                    errors.description 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#272727] focus:border-gray-500'
                  }`}
                  placeholder="Tell viewers about your video"
                />
                <div className="flex justify-between mt-1.5">
                  {errors.description && (
                    <p className="text-xs text-red-500">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.description.length}/5000
                  </p>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Thumbnail *
                </label>
                {!formData.thumbnail ? (
                  <div
                    onClick={() => document.getElementById('thumbnail-input').click()}
                    className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:bg-[#1a1a1a] transition-all ${
                      errors.thumbnail 
                        ? 'border-red-500' 
                        : 'border-[#272727] hover:border-gray-500'
                    }`}
                  >
                    <Image className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-400">Click to upload thumbnail</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG (Recommended: 1280x720)</p>
                  </div>
                ) : (
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-16 bg-[#272727] rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={URL.createObjectURL(formData.thumbnail)} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-white truncate">{formData.thumbnail.name}</p>
                      </div>
                      <button
                        onClick={removeThumbnail}
                        className="p-2 hover:bg-[#272727] rounded-lg transition-all flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                )}
                <input
                  id="thumbnail-input"
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                {errors.thumbnail && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.thumbnail}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#1a1a1a] border rounded-lg text-white focus:outline-none transition-all text-sm ${
                    errors.category 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#272727] focus:border-gray-500'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>
                )}
              </div>
            
              {/* Visibility */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Visibility
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'true', label: 'Public', desc: 'Everyone can watch', icon: Eye },
                    { value: 'false', label: 'Private', desc: 'Only you can watch', icon: EyeOff }
                  ].map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-2.5 sm:p-3 bg-[#1a1a1a] rounded-lg cursor-pointer transition-all ${
                          formData.isPublished === (option.value === 'true')
                            ? 'border border-white' 
                            : 'border border-transparent hover:bg-[#272727]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={formData.isPublished === (option.value === 'true')}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-white">{option.label}</p>
                          <p className="text-xs text-gray-400">{option.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>              

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  className="px-4 sm:px-6 bg-[#272727] text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#3a3a3a] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  disabled={isUploading}
                  className="w-full sm:flex-1 bg-white text-black py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Upload Video
                </button>
              </div>
            </div>
          )}

          {step === 3 && !isUploading && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Video Uploaded Successfully!</h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8 px-2">
                Your video is now processing and will be available shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="bg-white text-black px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  Upload Another
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-[#272727] text-white px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#3a3a3a] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#272727] rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Uploading Your Video...</h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">Please don't close this page</p>
              
              <div className="max-w-md mx-auto">
                <div className="w-full bg-[#272727] rounded-full h-2 mb-3 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-lg sm:text-xl font-bold">{uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadVideoComponent;