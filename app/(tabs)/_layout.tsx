import { useProfile } from "@/hooks/profile/use-profile";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";

export default function TabLayout() {
  useProfile();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#030712', // gray-950
          borderTopWidth: 0,
          elevation: 0,
          height: 84,
          paddingTop: 8,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#6b7280', // gray-500
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="house.fill"
              size={24}
              tintColor={color}
              fallback={<View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />}
            />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="person.fill"
              size={24}
              tintColor={color}
              fallback={<View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />}
            />
          )
        }}
      />
    </Tabs>
  )
}

