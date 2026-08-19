import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { auth } from "../services/firebase";
import { getUserData } from "../services/dashboard";

type AuthContextType = {
  userData: User | null;
  loading: boolean;
  userProfile: any | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        // Clear all profile caches on logout
        queryClient.removeQueries({ queryKey: ["user-profile"] });
        return;
      }

      // Force a fresh fetch whenever auth changes
      await queryClient.invalidateQueries({
        queryKey: ["user-profile", currentUser.uid],
      });
    });

    return unsubscribe;
  }, [queryClient]);

  const profileQuery = useQuery({
    queryKey: ["user-profile", user?.uid],
    queryFn: () => getUserData(user!.uid),
    enabled: !!user,

    // Always treat auth profile as stale
    staleTime: 0,

    // Keep cache only briefly
    gcTime: 1000 * 60,

    // Refetch when the component mounts
    refetchOnMount: "always",

    // Optional: refetch when window regains focus
    refetchOnWindowFocus: false,

    retry: 1,
  });

  const refreshProfile = async () => {
    if (!user) return;

    await queryClient.invalidateQueries({
      queryKey: ["user-profile", user.uid],
    });
  };

  const value = useMemo(
    () => ({
      userData: user,
      loading,
      userProfile: profileQuery.data ?? null,
      profileLoading: profileQuery.isFetching,
      refreshProfile,
    }),
    [user, loading, profileQuery.data, profileQuery.isFetching],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};