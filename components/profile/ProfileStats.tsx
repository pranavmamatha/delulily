import { useJobStore } from "@/store/useJobStore";
import { Text, View } from "react-native";

export default function ProfileStats() {
    const { jobs } = useJobStore();

    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(job => job.jobStatus === "completed").length;
    const processingJobs = jobs.filter(job =>
        job.jobStatus === "processing" || job.jobStatus === "uploading"
    ).length;

    return (
        <View className="flex-row mx-6 bg-gray-900/90 border border-white/10 rounded-2xl py-4 shadow-xl shadow-black/50 justify-between px-8 items-center">
            <StatItem value={totalJobs} label="Total" />
            <View className="h-8 w-[1px] bg-white/10" />
            <StatItem value={completedJobs} label="Completed" />
            <View className="h-8 w-[1px] bg-white/10" />
            <StatItem value={processingJobs} label="Processing" />
        </View>
    );
}

function StatItem({ value, label }: { value: number, label: string }) {
    return (
        <View className="items-center min-w-[64px]">
            <Text className="text-xl font-bold text-white mb-1">{value}</Text>
            <Text className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</Text>
        </View>
    );
}
