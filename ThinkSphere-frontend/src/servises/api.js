import axios from "axios";
import { API_BASE_URL } from "../config";

const API = axios.create({ baseURL: `${API_BASE_URL}/api` });

export const fetchBlogs = () => API.get("/blogs");
export const login = (credentials) => API.post("/auth/login", credentials);
