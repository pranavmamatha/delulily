import { useJobs } from "@/hooks/jobs/use-jobs";
import { JobType, useJobStore } from "@/store/useJobStore";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Jobs() {
  const { loadMore, hasMore } = useJobs();
  const { jobs, isLoading } = useJobStore();

  if (isLoading && jobs.length === 0) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white/50 text-sm mt-4">Loading your creations...</Text>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View className="py-12 items-center">
        <Text className="text-white/50 text-base">No creations yet</Text>
        <Text className="text-white/30 text-sm mt-2">Start creating amazing images!</Text>
      </View>
    );
  }

  return (
    <View className="pb-8">
      <View className="flex-row flex-wrap gap-3">
        {
          jobs.map((job, index) =>
            <Job key={job.jobId} job={job} index={index} />
          )
        }
      </View>

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
  )
}

function ImageWithLoader({ source }: { source: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View className="relative">
      <Image
        source={source}
        className={`h-56 w-full rounded-2xl bg-white/5 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
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

function Job({ job, index }: { job: JobType; index: number }) {
  const router = useRouter();
  const isProcessing = job.jobStatus === "processing" || job.jobStatus === "uploading" || job.jobStatus === "created";

  const imageUrl = job.jobStatus === "completed" ? job.generatedImageUrl : job.inputImageUrl;
  const isImageReady = !!imageUrl;

  const handlePress = () => {
    if (job.jobStatus === "completed" && job.jobId && isImageReady) {
      router.push(`/job/${job.jobId}`);
    }
  };

  return (
    <AnimatedPressable
      entering={FadeInUp.delay(index * 100).duration(600).springify()}
      className="flex-1 min-w-[45%] active:opacity-80"
      onPress={handlePress}
      disabled={!isImageReady || isProcessing}
    >
      <View className="relative">
        {isImageReady ? (
          <ImageWithLoader source={imageUrl} />
        ) : (
          <SkeletonCard />
        )}

        {/* Status Badge */}
        {isProcessing && (
          <View className="absolute top-3 right-3 bg-orange-500/90 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white text-xs font-semibold">Processing</Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  )
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
      className="h-56 w-full rounded-2xl bg-white/10 items-center justify-center"
      style={animatedStyle}
    >
      <ActivityIndicator color="rgba(255,255,255,0.3)" />
    </Animated.View>
  );
}

function SkeletonCard() {
  return <ShimmerPlaceholder />;
}
