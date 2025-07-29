import { api } from "./api";

export async function login(email: string, password: string) {
  return api.post("/auth/login", { email, password });
}
