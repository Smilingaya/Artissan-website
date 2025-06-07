// # API calls
// src/utils/validators.js
// A collection of validation functions for form data

/**
 * Validates profile data from ProfileEdit form
 * @param {Object} data - Profile form data
 * @returns {Object} - Object containing validation errors (if any)
 */
export const validateProfileData = (data) => {
  const errors = {};
  
  // Username validation
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else if (data.username.length > 30) {
    errors.username = 'Username cannot exceed 30 characters';
  } else if (!/^[a-zA-Z0-9._]+$/.test(data.username)) {
    errors.username = 'Username can only contain letters, numbers, periods and underscores';
  }
  
  // Full name validation
  if (!data.fullName) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.length > 50) {
    errors.fullName = 'Full name cannot exceed 50 characters';
  }
  
  // Bio validation (optional field)
  if (data.bio && data.bio.length > 150) {
    errors.bio = 'Bio cannot exceed 150 characters';
  }
  
  // Website validation (optional field)
  if (data.website) {
    // Simple URL validation
    // Don't check for protocol since we ask users not to include it
    if (data.website.includes('http://') || data.website.includes('https://')) {
      errors.website = 'Please remove http:// or https:// from the URL';
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(data.website)) {
      errors.website = 'Please enter a valid website domain';
    }
  }
  
  // Email validation (optional field)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Phone validation (optional field)
  if (data.phone) {
    // Remove all non-digits for validation
    const cleanedPhone = data.phone.replace(/\D/g, '');
    // Basic check for length
    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      errors.phone = 'Please enter a valid phone number';
    }
  }
  
  return errors;
};

/**
 * Validates post data from PostForm
 * @param {Object} data - Post form data
 * @param {string} imagePreview - Image preview URL
 * @param {string} type - Form type ('create' or 'edit')
 * @returns {Object} - Object containing validation errors (if any)
 */
export const validatePostData = (data, imagePreview, type) => {
  const errors = {};
  
  // Image validation (required for new posts)
  if (!imagePreview && type === 'create') {
    errors.image = 'Please upload an image';
  }
  
  // Title validation
  if (!data.title) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }
  
  // Description validation (optional but with max length)
  if (data.description && data.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }
  
  // Tags validation (check for sensible limits)
  if (data.tags && data.tags.length > 10) {
    errors.tags = 'Cannot have more than 10 tags';
  }
  
  // Tag length validation
  if (data.tags) {
    for (const tag of data.tags) {
      if (tag.length > 30) {
        errors.tags = 'Tags cannot exceed 30 characters each';
        break;
      }
    }
  }
  
  // Location validation (optional with max length)
  if (data.location && data.location.length > 100) {
    errors.location = 'Location cannot exceed 100 characters';
  }
  
  return errors;
};

/**
 * Validates comment text
 * @param {string} text - Comment text
 * @returns {Object} - Object containing validation errors (if any)
 */
export const validateComment = (text) => {
  const errors = {};
  
  if (!text || text.trim() === '') {
    errors.text = 'Comment cannot be empty';
  } else if (text.length > 500) {
    errors.text = 'Comment cannot exceed 500 characters';
  }
  
  return errors;
};

/**
 * Validates login form data
 * @param {Object} data - Login form data
 * @returns {Object} - Object containing validation errors (if any)
 */
export const validateLoginData = (data) => {
  const errors = {};
  
  // Username/Email validation
  if (!data.usernameOrEmail) {
    errors.usernameOrEmail = 'Username or email is required';
  }
  
  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

/**
 * Validates registration form data
 * @param {Object} data - Registration form data
 * @returns {Object} - Object containing validation errors (if any)
 */
export const validateRegistrationData = (data) => {
  const errors = {};
  
  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Username validation
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else if (data.username.length > 30) {
    errors.username = 'Username cannot exceed 30 characters';
  } else if (!/^[a-zA-Z0-9._]+$/.test(data.username)) {
    errors.username = 'Username can only contain letters, numbers, periods and underscores';
  }
  
  // Full name validation
  if (!data.fullName) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.length > 50) {
    errors.fullName = 'Full name cannot exceed 50 characters';
  }
  
  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(data.password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  
  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

/**
 * Validates product data
 * @param {Object} data - Product form data
 * @param {string} imagePreview - Image preview URL
 * @returns {Object} - Object containing validation errors (if any)
 */
export const validateProductData = (data, imagePreview) => {
  const errors = {};
  
  // Image validation
  if (!imagePreview) {
    errors.image = 'Product image is required';
  }
  
  // Name validation
  if (!data.name) {
    errors.name = 'Product name is required';
  } else if (data.name.length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  } else if (data.name.length > 100) {
    errors.name = 'Product name cannot exceed 100 characters';
  }
  
  // Description validation
  if (!data.description) {
    errors.description = 'Product description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }
  
  // Price validation
  if (!data.price) {
    errors.price = 'Price is required';
  } else if (isNaN(data.price) || data.price <= 0) {
    errors.price = 'Please enter a valid price';
  }
  
  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  return errors;
};

/**
 * Validates search query
 * @param {string} query - Search query
 * @returns {Object} - Object containing validation errors (if any)
 */
export const validateSearchQuery = (query) => {
  const errors = {};
  
  if (!query || query.trim() === '') {
    errors.query = 'Search query cannot be empty';
  } else if (query.length < 2) {
    errors.query = 'Search query must be at least 2 characters';
  } else if (query.length > 50) {
    errors.query = 'Search query cannot exceed 50 characters';
  }
  
  return errors;
};