import axios from "axios";

export const userAxios = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});
