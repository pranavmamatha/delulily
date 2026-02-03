import { useProfileStore } from "@/store/useProfileStore";
import { View, Text } from "react-native";
import { Image } from "expo-image"

export default function Profile() {
  const { fullName, avatarUrl } = useProfileStore();
  console.log(avatarUrl)
  return <View className='flex flex-1 justify-center items-center'>
    <Image source={{ uri: avatarUrl ?? "" }} style={{ width: 120, height: 120, borderRadius: 60 }} />

    <Text>
      {fullName}
    </Text>
  </View>
}
