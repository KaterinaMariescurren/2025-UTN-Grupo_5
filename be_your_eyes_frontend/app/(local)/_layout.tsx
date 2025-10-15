import { useAuth } from "@/contexts/authContext";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";

export default function LocalLayout() {
  const router = useRouter();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  return <Slot />;
}
