/**
 * Admin Dashboard Utility Functions
 * A collection of helper functions for use throughout the application
 */

/**
 * Format a number with thousands separators
 * @param {number} num - The number to format
 * @param {boolean} addPrefix - Whether to add a currency prefix
 * @param {string} prefix - The currency prefix to add
 * @returns {string} Formatted number
 */
export const formatNumber = (num, addPrefix = false, prefix = '$') => {
  if (num === undefined || num === null) return '0';
  
  // Format with thousand separators
  const formattedNum = num.toLocaleString();
  
  // Add prefix if needed
  return addPrefix ? `${prefix}${formattedNum}` : formattedNum;
};

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use ('relative', 'full', 'short')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'full') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (format === 'relative') {
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    // Fall back to short format for older dates
    format = 'short';
  }
  
  if (format === 'short') {
    return dateObj.toLocaleDateString();
  }
  
  // Full format
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return dateObj.toLocaleDateString(undefined, options);
};

/**
 * Get appropriate status color
 * @param {string} status - The status string ('active', 'inactive', 'success', 'warning', 'error', etc.)
 * @returns {object} Object with background and text colors
 */
export const getStatusColors = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'success':
      return { 
        bg: 'rgba(76, 175, 80, 0.1)', 
        color: '#4CAF50' 
      };
    case 'warning':
    case 'pending':
      return { 
        bg: 'rgba(255, 152, 0, 0.1)', 
        color: '#FF9800' 
      };
    case 'inactive':
    case 'error':
    case 'failed':
      return { 
        bg: 'rgba(244, 67, 54, 0.1)', 
        color: '#F44336' 
      };
    default:
      return { 
        bg: 'rgba(158, 158, 158, 0.1)', 
        color: '#9E9E9E' 
      };
  }
};

/**
 * Get icon for activity type
 * @param {string} type - The activity type
 * @returns {string} Material icon name
 */
export const getActivityIconName = (type) => {
  switch (type?.toLowerCase()) {
    case 'users': return 'Person';
    case 'posts': return 'PostAdd';
    case 'products': return 'Inventory';
    case 'orders': return 'ShoppingCart';
    case 'settings': return 'Settings';
    default: return 'Circle';
  }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Filter collection by search term
 * @param {Array} items - Array of items to filter
 * @param {string} searchTerm - Term to search for
 * @param {Array} fields - Fields to search in
 * @returns {Array} Filtered items
 */
export const filterBySearchTerm = (items, searchTerm, fields) => {
  if (!searchTerm || !searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase().trim();
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (!value) return false;
      return value.toString().toLowerCase().includes(term);
    });
  });
};

/**
 * Sort array of objects by a property
 * @param {Array} items - Array to sort
 * @param {string} key - Property to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortByProperty = (items, key, direction = 'asc') => {
  const sortedItems = [...items];
  
  return sortedItems.sort((a, b) => {
    let valA = a[key];
    let valB = b[key];
    
    // Handle strings
    if (typeof valA === 'string' && typeof valB === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array items by a property
 * @param {Array} items - Array to group
 * @param {string} key - Property to group by
 * @returns {Object} Grouped items
 */
export const groupByProperty = (items, key) => {
  return items.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Generate chart data from array of objects
 * @param {Array} items - Source data
 * @param {string} labelKey - Property to use as label
 * @param {string} valueKey - Property to use as value
 * @returns {Array} Chart data array
 */
export const generateChartData = (items, labelKey, valueKey) => {
  return items.map(item => ({
    name: item[labelKey],
    value: item[valueKey]
  }));
};

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {object} Percentage change with direction
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous) return { value: 0, direction: 'neutral' };
  
  const change = ((current - previous) / previous) * 100;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  
  return {
    value: Math.abs(change).toFixed(1),
    direction
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Generate random ID (for temporary use)
 * @returns {string} Random ID
 */
export const generateTempId = () => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Convert RGB color to hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color
 */
export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};