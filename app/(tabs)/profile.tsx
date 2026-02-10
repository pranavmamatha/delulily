import { useProfileStore } from "@/store/useProfileStore";
import { View, Text } from "react-native";
import { Image } from "expo-image"
import { useJobStore } from "@/store/useJobStore";
import { useJobs } from "@/hooks/jobs/use-jobs";

export default function Profile() {
  useJobs()
  const { fullName, avatarUrl } = useProfileStore();
  const { jobs } = useJobStore();
  console.log(avatarUrl)
  console.log(jobs)
  return <View className='flex flex-1 justify-center items-center'>
    <Image source={{ uri: avatarUrl ?? "" }}
      className="w-12 h-12 br-60"
      style={{ width: 120, height: 120, borderRadius: 60 }} />
    <Text>
      {fullName}
    </Text>
    {jobs?.map(job => <View key={job.jobId}><Text>{job.jobId}</Text></View>)}
  </View>
}
