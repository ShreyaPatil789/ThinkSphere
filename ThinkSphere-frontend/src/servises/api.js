import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const fetchBlogs = () => API.get("/blogs");
export const login = (credentials) => API.post("/auth/login", credentials);
