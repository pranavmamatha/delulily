import { createClient } from "@supabase/supabase-js"
import { deleteItemAsync, setItemAsync, getItemAsync } from "expo-secure-store"

const ExpoSecureStore = {
  getItem: (key: string) => {
    return getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return deleteItemAsync(key);
  }
}


export const supabase = createClient(
  process.env.EXPO_PUBIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStore,
    }
  }
)
