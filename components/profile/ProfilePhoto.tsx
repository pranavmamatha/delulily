import { useProfile } from "@/hooks/profile/use-profile";
import { useProfileStore } from "@/store/useProfileStore";
import { Image } from "expo-image";
import { View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";


export default function ProfilePhoto() {
  useProfile()
  const { fullName, avatarUrl } = useProfileStore()

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      className="items-center pt-6 pb-4"
    >
      {/* Avatar with Gradient Border */}
      <View className="mb-4">
        <View className="bg-white/10 rounded-full p-1 border border-white/20 shadow-lg shadow-black/20">
          <Image
            source={avatarUrl}
            className="h-32 w-32 rounded-full"
            contentFit="cover"
          />
        </View>
      </View>

      {/* Name */}
      <Animated.Text
        entering={FadeIn.delay(200).duration(600)}
        className="text-3xl font-bold text-white mb-1"
      >
        {fullName}
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text
        entering={FadeIn.delay(400).duration(600)}
        className="text-sm text-white/80"
      >
        Creative Artist
      </Animated.Text>
    </Animated.View>
  )
}
