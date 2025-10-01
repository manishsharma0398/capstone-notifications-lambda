export interface User {
  id: number;
  role: "ngo" | "volunteer" | "admin";
  email: string;
  lastName: string;
  provider: "google" | "local" | "phone";
  firstName: string;
}

export interface Message {
  type: string;
  data: User;
}
