export type Role = "TEAM_MEMBER" | "MANAGER" | "ADMIN";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
}
export interface ChangeRoleRequest {
  role: Role;
}