import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useTemplateStore } from "@/store/useTemplateStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemplateDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { templates } = useTemplateStore();
    const { session } = useAuthStore();
    const template = templates.find((t) => t.id === id);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCreatingJob, setIsCreatingJob] = useState(false);

    const handlePickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission Required",
                    "Please allow access to your photos to upload an image."
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: false,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (e) {
            console.error("Error picking image:", e);
            Alert.alert("Error", "Failed to pick image.");
        }
    };

    const handleCreateJob = async () => {
        if (!selectedImage || !id || !session?.user?.id) return;

        setIsCreatingJob(true);
        try {
            const { data: jobId, error: rpcError } = await supabase.rpc("create_job", {
                template_id: id,
            });

            if (rpcError || !jobId) {
                console.error("Error creating job:", rpcError);
                Alert.alert("Error", "Failed to create job. Please try again.");
                setIsCreatingJob(false);
                return;
            }

            await supabase.rpc("update_job_status", {
                job_id: jobId,
                new_status: "uploading",
            });

            const userId = session.user.id;
            const storagePath = `${userId}/${jobId}/input.png`;

            const fileResponse = await fetch(selectedImage);
            const arrayBuffer = await fileResponse.arrayBuffer();

            const { error: uploadError } = await supabase.storage
                .from("jobs")
                .upload(storagePath, arrayBuffer, {
                    contentType: "image/png",
                    upsert: true,
                });

            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                await supabase.rpc("update_job_status", {
                    job_id: jobId,
                    new_status: "failed",
                    error_msg: "Failed to upload input image",
                });
                Alert.alert("Error", "Failed to upload image. Please try again.");
                setIsCreatingJob(false);
                return;
            }

            await supabase.rpc("update_job_status", {
                job_id: jobId,
                new_status: "processing",
            });

            supabase.functions.invoke("main", {
                body: { job_id: jobId },
            }).catch((err) => {
                console.error("Error invoking edge function:", err);
            });

            router.replace("/(tabs)/profile");
        } catch (e) {
            console.error("Error in job creation:", e);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setIsCreatingJob(false);
        }
    };

    if (!template) {
        return (
            <SafeAreaView className="flex-1 bg-gray-950 px-4 items-center justify-center">
                <Text className="text-white text-lg">Template not found</Text>
                <Pressable onPress={() => router.back()} className="mt-4 bg-white/10 px-6 py-3 rounded-full">
                    <Text className="text-white font-semibold">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-gray-950">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Full-screen preview image */}
            <View className="flex-1">
                {template.previewUrl ? (
                    <Image
                        source={template.previewUrl}
                        className="flex-1 w-full"
                        contentFit="cover"
                        transition={300}
                    />
                ) : (
                    <View className="flex-1 bg-white/5 items-center justify-center">
                        <ActivityIndicator color="white" />
                    </View>
                )}

                {/* Gradient overlay at top for back button */}
                <LinearGradient
                    colors={["rgba(3,7,18,0.8)", "transparent"]}
                    className="absolute top-0 left-0 right-0 h-32"
                />

                {/* Gradient overlay at bottom for buttons */}
                <LinearGradient
                    colors={["transparent", "rgba(3,7,18,0.9)", "#030712"]}
                    className="absolute bottom-0 left-0 right-0 h-64"
                />

                {/* Back button + Title */}
                <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 px-5 pt-2">
                    <View className="flex-row justify-between items-center">
                        <Pressable
                            onPress={() => router.back()}
                            disabled={isCreatingJob}
                            className="bg-black/40 w-10 h-10 rounded-full items-center justify-center border border-white/15 active:bg-white/20"
                        >
                            <Ionicons name="arrow-back" size={18} color="#fff" />
                        </Pressable>
                        <View className="bg-black/40 px-4 py-2 rounded-full border border-white/15">
                            <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                                {template.name}
                            </Text>
                        </View>
                        <View className="w-10" />
                    </View>
                </SafeAreaView>

                {/* Bottom section */}
                <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 px-6 pb-2">
                    {/* Selected image thumbnail + change */}
                    {selectedImage && (
                        <View className="flex-row items-center gap-3 mb-4 bg-white/10 p-3 rounded-2xl border border-white/10">
                            <Image
                                source={selectedImage}
                                className="w-14 h-14 rounded-xl"
                                contentFit="cover"
                            />
                            <View className="flex-1">
                                <Text className="text-white font-semibold text-sm">Photo selected</Text>
                                <Text className="text-white/40 text-xs">Tap to change</Text>
                            </View>
                            <Pressable
                                onPress={handlePickImage}
                                disabled={isCreatingJob}
                                className="bg-white/10 px-3 py-2 rounded-full active:bg-white/20"
                            >
                                <Text className="text-white text-xs font-semibold">Change</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Main CTA */}
                    {selectedImage ? (
                        <Pressable
                            onPress={handleCreateJob}
                            disabled={isCreatingJob}
                            className={`bg-white rounded-full py-4 items-center justify-center flex-row gap-2 active:opacity-80 ${isCreatingJob ? "opacity-70" : ""}`}
                        >
                            {isCreatingJob ? (
                                <>
                                    <ActivityIndicator color="black" />
                                    <Text className="text-black font-bold text-base">Creating...</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="sparkles" size={20} color="#000" />
                                    <Text className="text-black font-bold text-base">Generate</Text>
                                </>
                            )}
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={handlePickImage}
                            className="bg-white rounded-full py-4 items-center justify-center flex-row gap-2 active:opacity-80"
                        >
                            <Ionicons name="image-outline" size={20} color="#000" />
                            <Text className="text-black font-bold text-base">Choose Photo</Text>
                        </Pressable>
                    )}
                </SafeAreaView>
            </View>
        </View>
    );
}
