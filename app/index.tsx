import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function() {
  const { isLoggedIn } = useAuthStore()
  if (isLoggedIn) return <Redirect href={"/(tabs)"} />
  return <Redirect href={"/login"} />
}
