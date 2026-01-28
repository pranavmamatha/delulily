import { View, Text } from "react-native"
import GoogleSignInButton from "@/components/auth/google-signin-button"
// import { useAuthStore } from "@/store/useAuthStore"
// import { Redirect } from "expo-router"

export default function Login() {
  // const { isLoggedIn } = useAuthStore()
  // if (isLoggedIn) return <Redirect href={"/(tabs)"} />
  return <View className="flex flex-1 justify-center items-center">
    <Text className="text-red-400">
      <GoogleSignInButton />
    </Text>
  </View>
}
