const API_BASE_URL = "http://127.0.0.1:8000";

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("access_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
};

// Auth endpoints
export const auth = {
  register: (email, password) =>
    apiCall("/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) =>
    apiCall("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// Mindmap endpoints
export const mindmap = {
  upload: async (file) => {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("file", file);

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  },

  generate: (payload) =>
    apiCall("/generate-mindmap", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getHistory: () => apiCall("/history"),
};
