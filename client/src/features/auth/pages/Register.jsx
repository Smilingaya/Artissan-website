import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import artisan1 from "../../../assets/artisan1.jpg";
import artisan2 from "../../../assets/artisan2.jpg";
import googleIcon from "../../../assets/google.png";
import { motion } from "framer-motion";
import { useAuth } from "../../../shared/contexts/UserContext";

const styles = {
container :{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  width: "70%",
  height: "90%",
  fontFamily: "'Poppins', sans-serif",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)"
},

  leftPanel: {
    position: "relative",
    width: "100%",
    height: "90%",
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7))",
    color: "white",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: "2rem"
  },
  overlayTitle: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    fontWeight: "700"
  },
  overlayText: {
    fontSize: "1.2rem",
    maxWidth: "80%",
    lineHeight: "1.6",
    margin: "0 auto"
  },
  rightPanel: {
    display: "grid",
    placeItems: "center",
    padding: "2rem",
    height: "100%",
    width: "100%",
  },
  formContainer: {
    width: "85%",
    maxWidth: "450px"
  },
  formHeader: {
    textAlign: "center",
    marginBottom: "2rem"
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "0.5rem"
  },
  subtitle: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "1.5rem"
  },
  formBody: {
    display: "grid",
    gap: "1.2rem"
  },
  formGroup: {
    display: "grid",
    gap: "0.5rem"
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#374151"
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "1rem",
    transition: "border 0.3s ease",
    "&:focus": {
      border: "1px solid #4361ee"
    }
  },
  forgotPassword: {
    textAlign: "right",
    fontSize: "0.9rem"
  },
  forgotLink: {
    color: "#4361ee",
    textDecoration: "none",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#3a56d4"
    }
  },
  errorMessage: {
    background: "#fee2e2",
    color: "#ef4444",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.9rem"
  },
  successMessage: {
    background: "#d1fae5",
    color: "#10b981",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.9rem"
  },
  button: {
    background: "#4361ee",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.3s ease",
    display: "grid",
    placeItems: "center",
    "&:hover": {
      background: "#3a56d4"
    },
    "&:disabled": {
      opacity: 0.7,
      cursor: "not-allowed"
    }
  },
  secondaryButton: {
    background: "#fff",
    color: "#4361ee",
    border: "1px solid #4361ee",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "grid",
    placeItems: "center",
    "&:hover": {
      background: "#f7f9fe"
    }
  },
  socialLogin: {
    display: "grid",
    gap: "1rem",
    textAlign: "center",
    marginTop: "1.5rem"
  },
  socialDivider: {
    color: "#6b7280",
    fontSize: "0.9rem",
    position: "relative",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      width: "40%",
      height: "1px",
      background: "#e5e7eb"
    },
    "&::before": {
      left: 0
    },
    "&::after": {
      right: 0
    }
  },
  stepIndicator: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1.5rem"
  },
  step: {
    padding: "0.5rem",
    textAlign: "center",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    position: "relative"
  },
  activeStep: {
    background: "#ebf2ff",
    color: "#4361ee"
  },
  inactiveStep: {
    background: "#f3f4f6",
    color: "#9ca3af"
  },
  stepLine: {
    position: "absolute",
    top: "50%",
    left: "100%",
    width: "100%",
    height: "2px",
    background: "#e5e7eb",
    zIndex: 0
  },
  fileUpload: {
    display: "grid",
    gap: "0.5rem"
  },
  fileInput: {
    display: "none"
  },
  fileLabel: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "0.5rem",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    border: "2px dashed #e5e7eb",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "#4361ee",
      background: "#f7f9fe"
    }
  },
  previewContainer: {
    width: "100%",
    display: "grid",
    placeItems: "center",
    marginTop: "1rem"
  },
  previewImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #e5e7eb"
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "100px",
    fontFamily: "'Poppins', sans-serif",
    transition: "border 0.3s ease",
    "&:focus": {
      border: "1px solid #4361ee"
    }
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginTop: "1rem"
  }
};

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register,loginAdmin, isAuthenticated,currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
useEffect(() => {
  if (isAuthenticated && currentUser) {
    const from = location.state?.from?.pathname;

    if (currentUser.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate(from || "/home", { replace: true });
    }
  }
}, [isAuthenticated, currentUser, navigate, location]);


  // Clear messages when switching forms
  useEffect(() => {
    setError("");
    setSuccess("");
    setRegisterStep(1);
    setImage(null);
    setPreviewUrl(null);
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Validate first step
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }
    
    // Move to step 2
    setError("");
    setRegisterStep(2);
  };

  const handleBack = () => {
    setRegisterStep(1);
    setError("");
  };

 const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  setSuccess("");

  try {
    // First try admin login
    const result = await loginAdmin({
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
  setSuccess("Login Admin successful!");
  await checkAuthStatus(); // `useEffect` will redirect based on role
  return;
}

    // Try normal user login
    const userResult = await login({
      email: formData.email,
      password: formData.password
    });

    if (userResult.success) {
      setSuccess("Login successful!");
      await checkAuthStatus();
setTimeout(() => {
  navigate("/admin");
}, 100); 
    } else {
      setError(userResult.error?.email || userResult.error?.password || "Authentication failed");
    }

  } catch (err) {
    setError("Network error. Please try again later.");
  } finally {
    setIsLoading(false);
  }
};


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        bio: formData.bio || ""
      };
      
      if (image) {
        userData.image = image;
      }

      const result = await register(userData);
      
      if (result.success) {
        setSuccess("Registration successful!");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        setError(result.error.email || result.error.password || result.error.name || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", bio: "" });
  };

  return (
    <div style={{ display: "grid", overflow:'hidden', placeItems:"center",width:"100vw", height: "100%" , background: "linear-gradient(135deg,rgb(243, 253, 186) 0%,rgb(193, 195, 255) 100%)" }}>
    <div style={styles.container}>
      {/* Left panel - changes based on form type */}
      <motion.div 
        style={styles.leftPanel}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src={isLogin ? artisan2 : artisan1} 
          alt="Artisan" 
          style={styles.image}
        />
        <div style={styles.overlay}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 style={styles.overlayTitle}>
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p style={styles.overlayText}>
              {isLogin 
                ? "We're glad to see you again" 
                : "Connect with artisans around the world"}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right panel - form container */}
      <motion.div 
        style={styles.rightPanel}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <motion.h2
              style={styles.title}
              key={isLogin ? "login-title" : "register-title"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </motion.h2>
            <motion.p
              style={styles.subtitle}
              key={isLogin ? "login-subtitle" : "register-subtitle"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {isLogin 
                ? "Welcome back! Please enter your details" 
                : `${registerStep === 1 ? "Step 1: Required Information" : "Step 2: Optional Profile Details"}`}
            </motion.p>
            
            {/* Step indicator for register */}
            {!isLogin && (
              <motion.div 
                style={styles.stepIndicator}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <div style={{
                  ...styles.step,
                  ...(registerStep === 1 ? styles.activeStep : styles.inactiveStep)
                }}>
                  Step 1: Account
                </div>
                <div style={{
                  ...styles.step,
                  ...(registerStep === 2 ? styles.activeStep : styles.inactiveStep)
                }}>
                  Step 2: Profile
                </div>
              </motion.div>
            )}
          </div>

          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit}>
              <div style={styles.formBody}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  style={styles.formGroup}
                >
                  <label htmlFor="email" style={styles.label}>Email</label>
                  <input
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                      outline: "none",
                      fontSize: "1rem"
                    }}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={styles.formGroup}
                >
                  <label htmlFor="password" style={styles.label}>Password</label>
                  <input
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                      outline: "none",
                      fontSize: "1rem"
                    }}
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  style={styles.forgotPassword}
                >
                 <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.errorMessage}
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.successMessage}
                  >
                    {success}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  style={{
                    background: "#4361ee",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                    display: "grid",
                    placeItems: "center"
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div 
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        border: "3px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "50%",
                        borderTop: "3px solid white",
                        animation: "spin 1s linear infinite"
                      }}
                    />
                  ) : "Sign In"}
                </motion.button>

                <div style={styles.socialLogin}>
                  <span style={{
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    position: "relative",
                    display: "grid",
                    placeItems: "center",
                    margin: "0.5rem 0"
                  }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0 10px",
                      backgroundColor: "white",
                      position: "relative",
                      zIndex: 1
                    }}>
                      Or continue with
                    </span>
                    <span style={{
                      position: "absolute",
                      width: "100%",
                      height: "1px",
                      backgroundColor: "#e5e7eb",
                      top: "50%",
                      zIndex: 0
                    }}></span>
                  </span>
                  <motion.div 
                    style={{
                      display: "grid",
                      placeItems: "center"
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <img 
                      src={googleIcon} 
                      alt="Google" 
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                        cursor: "pointer",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                      }} 
                    />
                  </motion.div>
                </div>
              </div>
            </form>
          ) : (
            /* Register Form - with steps */
            registerStep === 1 ? (
              /* Step 1: Basic Info */
              <form onSubmit={handleNext}>
                <div style={styles.formBody}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    style={styles.formGroup}
                  >
                    <label htmlFor="name" style={styles.label}>Full Name <span style={{color: "red"}}>*</span></label>
                    <input
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: "1rem"
                      }}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={styles.formGroup}
                  >
                    <label htmlFor="email" style={styles.label}>Email <span style={{color: "red"}}>*</span></label>
                    <input
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: "1rem"
                      }}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={styles.formGroup}
                  >
                    <label htmlFor="password" style={styles.label}>Password <span style={{color: "red"}}>*</span></label>
                    <input
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: "1rem"
                      }}
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={styles.errorMessage}
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    style={{
                      background: "#4361ee",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background 0.3s ease"
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Continue to Step 2
                  </motion.button>
                </div>
              </form>
            ) : (
              /* Step 2: Profile Details */
              <form onSubmit={handleRegisterSubmit}>
                <div style={styles.formBody}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    style={styles.fileUpload}
                  >
                    <label htmlFor="profileImage" style={styles.label}>Profile Picture (Optional)</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={styles.fileInput}
                    />
                    <div 
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "0.5rem",
                        padding: "1.5rem",
                        borderRadius: "0.5rem",
                        border: "2px dashed #e5e7eb",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.3s ease"
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <span style={{ color: "#6b7280" }}>
                        {previewUrl ? "Change image" : "Click to upload an image"}
                      </span>
                    </div>
                    
                    {previewUrl && (
                      <div style={{
                        width: "100%",
                        display: "grid",
                        placeItems: "center",
                        marginTop: "1rem"
                      }}>
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid #e5e7eb"
                          }} 
                        />
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={styles.formGroup}
                  >
                    <label htmlFor="bio" style={styles.label}>Bio (Optional)</label>
                    <textarea
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: "1rem",
                        resize: "vertical",
                        minHeight: "100px",
                        fontFamily: "'Poppins', sans-serif"
                      }}
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={styles.errorMessage}
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={styles.successMessage}
                    >
                      {success}
                    </motion.div>
                  )}

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginTop: "1rem"
                  }}>
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      style={{
                        background: "#fff",
                        color: "#4361ee",
                        border: "1px solid #4361ee",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        fontSize: "1rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      style={{
                        background: "#4361ee",
                        color: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        fontSize: "1rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                        display: "grid",
                        placeItems: "center"
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div 
                        style={{
                          width: "1.5rem",
                          height: "1.5rem",
                          border: "3px solid rgba(255, 255, 255, 0.3)",
                          borderRadius: "50%",
                          borderTop: "3px solid white",
                          animation: "spin 1s linear infinite"
                        }}
                      />
                    ) : "Create Account"}
                  </motion.button>
                </div>
              </div>
            </form>
          )
        )}

        {/* Toggle between login and register */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ 
            textAlign: "center", 
            marginTop: "2rem",
            fontSize: "0.9rem",
            color: "#6b7280" 
          }}
        >
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={toggleForm}
              style={{
                color: "#4361ee",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  </div>
  </div>
);
}

export default AuthPage;