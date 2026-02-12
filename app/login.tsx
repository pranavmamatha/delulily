import GoogleSignInButton from "@/components/auth/google-signin-button";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function Login() {
  return (
    <View className="flex-1 bg-gray-950">
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#4c1d95", "#0f172a", "#000000"]}
        locations={[0, 0.4, 0.9]}
        className="absolute inset-0"
      />

      {/* Decorative blurred blobs */}
      <View className="absolute inset-0 overflow-hidden">
        <View className="absolute -top-20 -left-20 w-96 h-96 bg-fuchsia-600 rounded-full blur-[100px] opacity-20" />
        <View className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20" />
        <View className="absolute -bottom-20 left-1/2 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-20 transform -translate-x-1/2" />
      </View>

      <View className="flex-1 justify-center items-center px-8 relative z-10 w-full max-w-md mx-auto">
        {/* Logo Section */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(1000).springify()}
          className="items-center mb-16"
        >
          <View className="w-32 h-32 bg-white/10 rounded-3xl items-center justify-center mb-6 border border-white/20 shadow-lg backdrop-blur-xl">
            <Image
              source={require("../assets/images/splash-icon.png")}
              className="w-20 h-20"
              contentFit="contain"
            />
          </View>

          <Text className="text-5xl font-bold text-white tracking-widest text-center shadow-sm">
            delulily
          </Text>
          <Text className="text-white/60 text-lg mt-3 text-center font-medium tracking-wide">
            Turn your delusions into reality
          </Text>
        </Animated.View>

        {/* Action Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          className="w-full"
        >
          <View className="mb-6">
            <GoogleSignInButton />
          </View>

          <Text className="text-white/30 text-xs text-center px-4 leading-5">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
