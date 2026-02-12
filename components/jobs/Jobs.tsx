import { useJobs } from "@/hooks/jobs/use-jobs";
import { JobType, useJobStore } from "@/store/useJobStore";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Jobs() {
  useJobs();
  const { jobs } = useJobStore();

  if (jobs.length === 0) {
    return (
      <View className="py-12 items-center">
        <Text className="text-white/50 text-base">No creations yet</Text>
        <Text className="text-white/30 text-sm mt-2">Start creating amazing images!</Text>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-3">
      {
        jobs.map((job, index) =>
          <Job key={job.jobId} job={job} index={index} />
        )
      }
    </View>
  )
}

function Job({ job, index }: { job: JobType; index: number }) {
  const isProcessing = job.jobStatus === "processing" || job.jobStatus === "uploading";

  return (
    <AnimatedPressable
      entering={FadeInUp.delay(index * 100).duration(600).springify()}
      className="flex-1 min-w-[45%] active:opacity-80"
    >
      <View className="relative">
        {/* Image */}
        <Image
          source={job.jobStatus === "completed" ? job.generatedImageUrl : job.inputImageUrl}
          className="h-56 w-full rounded-2xl"
          contentFit="cover"
        />

        {/* Status Badge */}
        {isProcessing && (
          <View className="absolute top-3 right-3 bg-orange-500/90 px-3 py-1.5 rounded-full">
            <Text className="text-white text-xs font-semibold">Processing</Text>
          </View>
        )}



        {/* Gradient Overlay for depth */}
        <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent rounded-b-2xl" />
      </View>
    </AnimatedPressable>
  )
}
