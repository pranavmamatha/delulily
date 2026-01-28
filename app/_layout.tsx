import { useAuthListener } from "@/hooks/auth/use-auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  useAuthListener();
  const {isLoggedIn} = useAuthStore();
return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
