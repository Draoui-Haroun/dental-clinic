
export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  address?: string;
  notes?: string;
  createdAt: string;
};