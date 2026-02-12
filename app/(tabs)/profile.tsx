import Jobs from "@/components/jobs/Jobs";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { ScrollView, Text, View } from "react-native";
cssInterop(Image, { className: "style" });

export default function Profile() {
  return (
    <View className="flex-1 bg-gray-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header with gradient, photo, stats, and logout */}
        <ProfileHeader />

        {/* My Creations Section */}
        <View className="px-6 pt-16 pb-4">
          <Text className="text-xl font-bold text-white mb-6 tracking-wide">
            My Creations
          </Text>
          <Jobs />
        </View>
      </ScrollView>
    </View>
  )
}
