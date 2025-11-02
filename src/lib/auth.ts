export interface User {
  id: string;
  username: string;
  name: string;
  phoneNumber: string;
  emailId: string;
  password: string; // In production, this should be hashed
}

const STORAGE_KEY = "level-up-users";
const CURRENT_USER_KEY = "level-up-current-user";
const THEME_KEY = "level-up-theme";

export function registerUser(userData: {
  username: string;
  name: string;
  phoneNumber: string;
  emailId: string;
  password: string;
}): { success: boolean; message: string } {
  if (typeof window === "undefined") {
    return { success: false, message: "Server-side rendering not supported" };
  }

  // Validate inputs
  if (!userData.username || !userData.name || !userData.emailId || !userData.password) {
    return { success: false, message: "All fields are required" };
  }

  if (userData.password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters" };
  }

  // Check if username or email already exists
  const users = getUsers();
  if (users.find((u) => u.username === userData.username)) {
    return { success: false, message: "Username already exists" };
  }
  if (users.find((u) => u.emailId === userData.emailId)) {
    return { success: false, message: "Email already exists" };
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    ...userData,
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  // Auto-login
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return { success: true, message: "Registration successful!" };
}

export function loginUser(username: string, password: string): { success: boolean; message: string; user?: User } {
  if (typeof window === "undefined") {
    return { success: false, message: "Server-side rendering not supported" };
  }

  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return { success: false, message: "Invalid username or password" };
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, message: "Login successful!", user };
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";

  const stored = localStorage.getItem(THEME_KEY);
  return (stored as "dark" | "light") || "dark";
}

export function setTheme(theme: "dark" | "light"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
}

