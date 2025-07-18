import React, { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:3000/check", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          console.log("🔍 checkAuthStatus: ", data.user);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        const errorData = await response.json();
        
        // Check if user is blocked
        if (errorData.blocked) {
          alert("Your account has been blocked. You can no longer access this site.");
          // Clear any stored data
          localStorage.removeItem("jwt");
          localStorage.removeItem("userId");
        }
        
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        // SAVE TOKEN TO LOCAL STORAGE
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("userId", data.user._id);
        }

        await checkAuthStatus(); // refresh user info
        return { success: true };
      } else {
        const errorData = await response.json();
        
        // Check if user is blocked
        if (errorData.blocked) {
          return { 
            success: false, 
            error: { message: "Your account has been blocked. You can no longer access this site." } 
          };
        }
        
        return { success: false, error: errorData };
      }
    } catch (error) {
      return { success: false, error: { message: "Network error" } };
    }
  };

  const register = async (userData) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        await checkAuthStatus(); // Refresh user data
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      return { success: false, error: { message: "Network error" } };
    }
  };

  const loginAdmin = async (credentials) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/loginAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        await checkAuthStatus(); // refresh user info
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      return { success: false, error: { message: "Network error" } };
    }
  };

  const logout = async () => {
    try {
      // Clear the JWT cookie by setting it to expire
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setCurrentUser((prev) => ({ ...prev, ...userData }));
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        loginAdmin,
        logout,
        register,
        updateUser,
        checkAuthStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
