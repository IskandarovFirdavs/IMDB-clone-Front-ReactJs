import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          // No refresh token available, logout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Try to get a new token
        const response = await axios.post(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:8000"
          }/users/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;

        // Save the new token
        localStorage.setItem("access_token", access);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const reviewService = {
  getRecent: () => api.get("/titles/reviews/?ordering=-created_at"),
};

// Title related API calls
const titleService = {
  getAll: (params) => api.get("/titles/titles/", { params }),
  getById: (id) => api.get(`/titles/titles/${id}/`),
  getTrending: () => api.get("/titles/titles/?sort=trending"),
  getReviews: (id) => api.get(`/titles/reviews/?title=${id}`),
  addReview: (id, data) => api.post(`/titles/reviews/`, { ...data, title: id }),
  addRating: (id, score) => api.post(`/titles/ratings/`, { title: id, score }),
  getGenres: () => api.get("/titles/genres/"),
  create: (data) => api.post("/titles/titles/create/", data),
  update: (id, data) => api.put(`/titles/titles/${id}/update/`, data),
  partialUpdate: (id, data) => api.patch(`/titles/titles/${id}/update/`, data),
  delete: (id) => api.delete(`/titles/titles/${id}/delete/`),
};

// Person related API calls
const personService = {
  getAll: (params) => api.get("/users/persons/", { params }),
  getById: (id) => api.get(`/users/persons/${id}/`),
  getFilmography: (id) => api.get(`/users/persons/${id}/filmography/`),
};

// News related API calls
const newsService = {
  getAll: (params) => api.get("/news/news/", { params }),
  getById: (id) => api.get(`/news/news/${id}/`),
  create: (data) => api.post("/news/news/", data),
  update: (id, data) => api.put(`/news/news/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/news/news/${id}/`, data),
  delete: (id) => api.delete(`/news/news/${id}/`),
  getLatest: () => api.get("/news/news/?ordering=-published_at"),
};

// Trivia related API calls
const triviaService = {
  getAll: (params) => api.get("/news/trivia/", { params }),
  getById: (id) => api.get(`/news/trivia/${id}/`),
  create: (data) => api.post("/news/trivia/", data),
  update: (id, data) => api.put(`/news/trivia/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/news/trivia/${id}/`, data),
  delete: (id) => api.delete(`/news/trivia/${id}/`),
  getByTitle: (titleId) => api.get(`/news/trivia/?title=${titleId}`),
  getByPerson: (personId) => api.get(`/news/trivia/?person=${personId}`),
};

// Watchlist related API calls
const watchlistService = {
  getAll: () => api.get("/titles/watchlists/"),
  addTitle: (titleId, status) =>
    api.post("/titles/watchlists/", { title: titleId, status }),
  updateStatus: (id, status) =>
    api.patch(`/titles/watchlists/${id}/`, { status }),
  removeTitle: (id) => api.delete(`/titles/watchlists/${id}/`),
};

// Search related API calls
const searchService = {
  search: (query, type) => {
    const params = { search: query };
    if (type && type !== "all") {
      if (["MOVIE", "TV_SERIES", "TV_EPISODE", "VIDEO_GAME"].includes(type)) {
        params.title_type = type;
      } else if (type === "title") {
        // Search only in titles
      } else if (type === "person") {
        return personService.getAll({ search: query });
      }
    }
    return api.get("/titles/titles/", { params });
  },
};

// User related API calls
const userService = {
  login: (credentials) => api.post("/users/login/", credentials),
  register: (userData) => api.post("/users/", userData),
  getCurrentUser: () => api.get("/users/me/"),
  getAll: (params) => api.get("/users/", { params }),
  getById: (id) => api.get(`/users/${id}/`),
  update: (id, data) => api.put(`/users/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
};

export default api;
export {
  titleService,
  personService,
  newsService,
  triviaService,
  watchlistService,
  searchService,
  userService,
  reviewService,
};
