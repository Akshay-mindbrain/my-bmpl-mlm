import { AdminType } from "@prisma/client";

export interface CreateAdminDTO {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobile: string;
  username?: string | null;
  password: string;
  adminType?: AdminType;
}
export interface UpdateAdminDTO {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobile?: string | null;
  username?: string | null;
  password?: string | null;
  status?: string | null;
  refreshToken?: string | null;
}
export interface loginDto {
  username?: string | null;
  password?: string;
}
