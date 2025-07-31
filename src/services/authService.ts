import { api } from "./api";
import { LoginModel } from "./../models/login";

export async function login(data: LoginModel) {
  return api.post("login", data);
}
