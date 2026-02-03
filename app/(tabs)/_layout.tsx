import { Tabs } from "expo-router"
import { useProfile } from "@/hooks/profile/use-profile";
const _layout = () => {
  useProfile();
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  )
}

export default _layout;
