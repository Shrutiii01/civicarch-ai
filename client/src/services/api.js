import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ------------------------
   AUTH APIs
------------------------- */

export const signup = (data) => {
  return api.post("/auth/signup", data)
}

export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    
    console.log("RESPONSE DATA:", response.data);   // 👈 check payload

    const token = response.data.token; // 🔥 adjust key if different
    
    console.log("TOKEN:", token); // 👈 check token

    // Store token
    localStorage.setItem("token", token);

    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = (email, otp) => {
  return api.post("/auth/verify-otp", null, {
    params: {
      email: email,
      otp: otp
    }
  })
}

export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", null, {
    params: { email }
  })
}

export const resetPassword = (email, otp, newPassword) => {
  return api.post("/auth/reset-password", null, {
    params: {
      email: email,
      otp: otp,
      new_password: newPassword
    }
  })
}

/* ------------------------
   COMPLAINT API
------------------------- */

export const submitComplaint = (formData) => {
  return api.post("/complaints/submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ------------------------
   IMAGE PROCESSING API
------------------------- */

export const processImage = (imageFile) => {

  const formData = new FormData()
  formData.append("image", imageFile)

  return api.post("/complaints/process-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

/* ------------------------
   COMPLAINT API
------------------------- */

export const saveDraftComplaint = (formData) => {
  return api.post("/complaints/draft", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getComplaintHistory = () => {
  return api.get("/complaints/history");
};

export const getComplaintById = (complaintId) => {
  return api.get(`/complaints/${complaintId}`);
};

export default api

export const classifyIssue = (text) => {
  return api.post("/complaints/classify", { text: text });
};