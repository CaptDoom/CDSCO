import React, { useState, useEffect, createContext, useContext } from "react";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    uid: "1",
    email: "vaibhav.k@cdsco.gov.in",
    displayName: "Vaibhav K.",
    photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmJFM3zLGPEtcvLFetihKRDJPlNcIXSwTRCpE0WHF79sCSYr8r7AN0AofBsx3doarPvZMh2y8txsTqW-SqarwHFk9N6Vojkb8LPGylrpnEhBBNnGtrkqg3Rr1UH6bCjBNCahwOtq0JL9pN-XqNEkSRdTS-MwlHDdZpOWcHaCBJCE-8F_u2QuRyJVkDieBvRHGMtdLv0ZAco4frnn_kXyxzAomtF9VCw2NcUMcJYf6eP444H8BJ280plffGo3aqviq--8OzkruOu_nL"
  });
  const [loading, setLoading] = useState(false);

  // This will be replaced with Firebase logic
  const signIn = async () => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setUser({
        uid: "1",
        email: "vaibhav.k@cdsco.gov.in",
        displayName: "Vaibhav K.",
        photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmJFM3zLGPEtcvLFetihKRDJPlNcIXSwTRCpE0WHF79sCSYr8r7AN0AofBsx3doarPvZMh2y8txsTqW-SqarwHFk9N6Vojkb8LPGylrpnEhBBNnGtrkqg3Rr1UH6bCjBNCahwOtq0JL9pN-XqNEkSRdTS-MwlHDdZpOWcHaCBJCE-8F_u2QuRyJVkDieBvRHGMtdLv0ZAco4frnn_kXyxzAomtF9VCw2NcUMcJYf6eP444H8BJ280plffGo3aqviq--8OzkruOu_nL"
      });
      setLoading(false);
    }, 1000);
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
