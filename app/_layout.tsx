import AnimatedSplash from "@/components/AnimatedSplash";
import { useAuthListener } from "@/hooks/auth/use-auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import "../global.css";

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAuthListener();
  const { isLoggedIn, isLoading } = useAuthStore();
  const [appReady, setAppReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Hide the native splash screen and show our animated one
      SplashScreen.hideAsync();
      // Give the animated splash a moment, then signal readiness
      const timer = setTimeout(() => {
        setAppReady(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const onSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <Stack>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="job/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="template/[id]" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* Animated splash overlay */}
      {!splashDone && (
        <AnimatedSplash isReady={appReady} onFinish={onSplashFinish} />
      )}
    </View>
  );
}
