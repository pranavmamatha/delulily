import { useTemplates } from "@/hooks/templates/use-templates";
import { TemplateType, useTemplateStore } from "@/store/useTemplateStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Home() {
  const { loadMore, hasMore, isLoading, isRefreshing, pullToRefresh, search } = useTemplates();
  const templates = useTemplateStore((s) => s.templates);
  const searchQuery = useTemplateStore((s) => s.searchQuery);

  const [inputValue, setInputValue] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((text: string) => {
    setInputValue(text);

    // Debounce: wait 400ms after user stops typing
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      search(text);
    }, 400);
  }, [search]);

  const handleClearSearch = useCallback(() => {
    setInputValue("");
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    search("");
  }, [search]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const showEmptySearch = !isLoading && templates.length === 0 && searchQuery.trim().length > 0;
  const showEmpty = !isLoading && templates.length === 0 && searchQuery.trim().length === 0;

  return (
    <View className="flex-1 bg-gray-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setInputValue("");
              pullToRefresh();
            }}
            tintColor="#fff"
          />
        }
      >
        {/* Header */}
        <SafeAreaView edges={["top"]} className="px-6 pt-4 pb-2">
          <Animated.View entering={FadeInDown.duration(600)}>
            <Text className="text-white/50 text-sm font-medium uppercase tracking-widest mb-1">
              Choose a style
            </Text>
            <Text className="text-white text-3xl font-bold tracking-tight">
              Templates
            </Text>
          </Animated.View>
        </SafeAreaView>

        {/* Search Bar */}
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center bg-white/8 rounded-2xl border border-white/10 px-4 py-0">
            <Ionicons
              name="search"
              size={18}
              color="rgba(255,255,255,0.4)"
            />
            <TextInput
              className="flex-1 text-white text-base py-3.5 px-3"
              placeholder="Search templates..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={inputValue}
              onChangeText={handleSearchChange}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {inputValue.length > 0 && (
              <Pressable
                onPress={handleClearSearch}
                className="bg-white/10 w-7 h-7 rounded-full items-center justify-center active:bg-white/20"
              >
                <Ionicons name="close" size={12} color="rgba(255,255,255,0.6)" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Loading State */}
        {isLoading && templates.length === 0 && (
          <View className="px-6 pt-4">
            <View className="flex-row flex-wrap gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View key={i} className="flex-1 min-w-[45%]">
                  <SkeletonCard />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty Search State */}
        {showEmptySearch && (
          <View className="py-20 items-center px-6">
            <View className="bg-white/5 w-16 h-16 rounded-full items-center justify-center mb-4">
              <Ionicons name="search" size={28} color="rgba(255,255,255,0.3)" />
            </View>
            <Text className="text-white/50 text-base font-semibold">No results found</Text>
            <Text className="text-white/30 text-sm mt-2 text-center">
              Try searching with different keywords
            </Text>
          </View>
        )}

        {/* Empty State */}
        {showEmpty && (
          <View className="py-20 items-center">
            <Text className="text-white/50 text-base">No templates available</Text>
            <Text className="text-white/30 text-sm mt-2">Check back later!</Text>
          </View>
        )}

        {/* Template Grid */}
        {templates.length > 0 && (
          <View className="px-6 pt-4">
            <View className="flex-row flex-wrap gap-4">
              {templates.map((template, index) => (
                <TemplateCard key={template.id} template={template} index={index} />
              ))}
            </View>

            {/* Load More */}
            {hasMore && (
              <Pressable
                onPress={loadMore}
                className="w-full py-4 items-center justify-center bg-white/5 rounded-2xl border border-white/10 mt-4 active:bg-white/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Load More</Text>
                )}
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function TemplateCard({ template, index }: { template: TemplateType; index: number }) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/template/${template.id}`);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(500).springify()}
      className="flex-1 min-w-[45%]"
    >
      <Pressable
        className="active:scale-95"
        onPress={handlePress}
        style={{ transform: [{ scale: 1 }] }}
      >
        <View className="relative overflow-hidden rounded-2xl border border-white/10">
          {template.previewUrl ? (
            <ImageWithShimmer source={template.previewUrl} />
          ) : (
            <SkeletonCard />
          )}
          {/* Gradient Overlay with Name */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.85)"]}
            className="absolute bottom-0 left-0 right-0 px-4 pt-12 pb-4"
          >
            <Text className="text-white font-bold text-base" numberOfLines={1}>
              {template.name}
            </Text>
          </LinearGradient>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function ImageWithShimmer({ source }: { source: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View className="relative">
      <Image
        source={source}
        className={`h-64 w-full bg-white/5 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
        contentFit="cover"
        transition={300}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <View className="absolute inset-0">
          <ShimmerPlaceholder />
        </View>
      )}
    </View>
  );
}

function ShimmerPlaceholder() {
  const shimmer = useSharedValue(0.3);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <Animated.View
      className="h-64 w-full rounded-2xl bg-white/10 items-center justify-center"
      style={animatedStyle}
    >
      <ActivityIndicator color="rgba(255,255,255,0.3)" />
    </Animated.View>
  );
}

function SkeletonCard() {
  return <ShimmerPlaceholder />;
}
