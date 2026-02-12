import { supabase } from "@/lib/supabase";
import { useJobStore } from "@/store/useJobStore";
import { Ionicons } from "@expo/vector-icons";
import { File as ExpoFile, Paths } from "expo-file-system";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Internal component for Image with Loading State
function ImageWithLoader({
    source,
    onPress,
    className,
    aspectRatioClass = "aspect-[3/4]",
    showExpandIcon = false,
}: {
    source: string | null | undefined;
    onPress?: () => void;
    className?: string;
    aspectRatioClass?: string;
    showExpandIcon?: boolean;
}) {
    const [isLoaded, setIsLoaded] = useState(false);

    if (!source) return null;

    return (
        <Pressable
            onPress={onPress}
            disabled={!isLoaded || !onPress}
            className={`${className} relative overflow-hidden`}
        >
            <Image
                source={source}
                className={`w-full ${aspectRatioClass} bg-white/5 ${!isLoaded ? "opacity-0" : "opacity-100"}`}
                contentFit="cover"
                onLoad={() => setIsLoaded(true)}
                transition={300}
            />
            {!isLoaded && (
                <View className="absolute inset-0 items-center justify-center bg-white/5">
                    <ActivityIndicator color="white" />
                </View>
            )}

            {isLoaded && showExpandIcon && (
                <View className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex-row items-center gap-1">
                    <Ionicons name="expand-outline" size={12} color="#fff" />
                    <Text className="text-white text-xs font-medium">Expand</Text>
                </View>
            )}
        </Pressable>
    );
}

export default function JobDetails() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { jobs } = useJobStore();
    const job = jobs.find((j) => j.jobId === id);

    const [templatePreviewUrl, setTemplatePreviewUrl] = useState<string | null>(null);
    const [viewerImage, setViewerImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
        granularPermissions: ['photo'],
    });

    // Fetch template preview from storage bucket
    useEffect(() => {
        let isMounted = true;
        const fetchTemplatePreview = async () => {
            if (!job?.templateId) return;
            try {
                const path = `${job.templateId}/preview.png`;
                const { data, error } = await supabase.storage
                    .from("templates")
                    .createSignedUrl(path, 3600);

                if (isMounted && data?.signedUrl) {
                    setTemplatePreviewUrl(data.signedUrl);
                }
                if (error) {
                    console.error("Error fetching template preview:", error);
                }
            } catch (e) {
                console.error("Error fetching template preview:", e);
            }
        };

        if (job?.templateId) {
            fetchTemplatePreview();
        }

        return () => {
            isMounted = false;
        };
    }, [job?.templateId]);

    const handleDownload = async () => {
        if (!viewerImage) return;

        if (permissionResponse?.status !== "granted") {
            const { status } = await requestPermission();
            if (status !== "granted") {
                Alert.alert("Permission required", "Please allow access to your photos to download images.");
                return;
            }
        }

        setSaving(true);
        try {
            // Download file directly to cache
            const fileName = `delulily_${Date.now()}.jpg`;
            const file = new ExpoFile(Paths.cache, fileName);

            await ExpoFile.downloadFileAsync(viewerImage, file);

            // Save to media library
            const asset = await MediaLibrary.createAssetAsync(file.uri);
            const album = await MediaLibrary.getAlbumAsync("delulily");
            if (album == null) {
                await MediaLibrary.createAlbumAsync("delulily", asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
            Alert.alert("Saved!", "Image saved to 'delulily' album.");
        } catch (e) {
            console.error("Download error:", e);
            Alert.alert("Error", "Failed to save image.");
        } finally {
            setSaving(false);
        }
    };

    const handleTemplatePress = () => {
        if (job?.templateId) {
            router.push(`/template/${job.templateId}`);
        }
    };

    if (!job) {
        return (
            <SafeAreaView className="flex-1 bg-gray-950 px-4 items-center justify-center">
                <Text className="text-white text-lg">Job not found</Text>
                <Pressable onPress={() => router.back()} className="mt-4 bg-white/10 px-6 py-3 rounded-full">
                    <Text className="text-white font-semibold">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-gray-950">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <SafeAreaView className="px-6 pb-4 flex-row justify-between items-center z-10">
                    <Pressable
                        onPress={() => router.back()}
                        className="bg-white/10 w-10 h-10 rounded-full items-center justify-center border border-white/10 active:bg-white/20"
                    >
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </Pressable>
                    <Text className="text-white text-lg font-bold">Details</Text>
                    <View className="w-10" />
                </SafeAreaView>

                {/* Main Generated Image */}
                <View className="px-6 mb-8">
                    <ImageWithLoader
                        source={job.generatedImageUrl}
                        onPress={() => setViewerImage(job.generatedImageUrl)}
                        className="rounded-3xl border border-white/10 w-full"
                        aspectRatioClass="aspect-[3/4]"
                        showExpandIcon={true}
                    />
                </View>

                {/* Info Section */}
                <View className="px-6">
                    <Text className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">References</Text>

                    <View className="flex-row gap-4">
                        {/* Input Image */}
                        <View className="flex-1">
                            <View className="bg-white/5 p-3 rounded-2xl border border-white/10 items-center gap-3">
                                <ImageWithLoader
                                    source={job.inputImageUrl}
                                    onPress={() => setViewerImage(job.inputImageUrl)}
                                    className="rounded-xl w-full"
                                    aspectRatioClass="aspect-square"
                                />
                                <Text className="text-white/80 text-xs font-semibold">Input Image</Text>
                            </View>
                        </View>

                        {/* Template Reference — tappable, navigates to template page */}
                        <View className="flex-1">
                            <Pressable
                                onPress={handleTemplatePress}
                                disabled={!job.templateId}
                                className="bg-white/5 p-3 rounded-2xl border border-white/10 items-center gap-3 active:bg-white/10"
                            >
                                {templatePreviewUrl ? (
                                    <Image
                                        source={templatePreviewUrl}
                                        className="w-full aspect-square rounded-xl bg-white/5"
                                        contentFit="cover"
                                        transition={300}
                                    />
                                ) : (
                                    <View className="w-full aspect-square rounded-xl bg-white/5 items-center justify-center">
                                        <ActivityIndicator color="rgba(255,255,255,0.3)" />
                                    </View>
                                )}
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-white/80 text-xs font-semibold">Template</Text>
                                    <Ionicons name="arrow-forward" size={10} color="rgba(255,255,255,0.5)" />
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Image Viewer Modal */}
            <Modal visible={!!viewerImage} transparent={true} animationType="fade" onRequestClose={() => setViewerImage(null)} statusBarTranslucent>
                <View className="flex-1 bg-black justify-center items-center relative">
                    {/* Close Button */}
                    <View className="absolute left-0 right-0 z-50 flex-row justify-between px-6" style={{ top: insets.top + 10 }}>
                        <Pressable
                            onPress={() => setViewerImage(null)}
                            className="bg-black/40 w-10 h-10 rounded-full items-center justify-center"
                        >
                            <Ionicons name="close" size={20} color="#fff" />
                        </Pressable>
                    </View>

                    {/* Full Screen Image */}
                    {viewerImage && (
                        <Image
                            source={viewerImage}
                            className="w-full h-full"
                            contentFit="contain"
                        />
                    )}

                    {/* Download Button */}
                    <SafeAreaView className="absolute bottom-8 w-full px-8">
                        <Pressable
                            onPress={handleDownload}
                            disabled={saving}
                            className={`overflow-hidden rounded-full py-4 items-center justify-center flex-row gap-2 ${saving ? "opacity-70" : ""}`}
                            style={{ backgroundColor: "white" }}
                        >
                            {saving ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <>
                                    <Ionicons name="download-outline" size={18} color="#000" />
                                    <Text className="text-black font-bold text-base">Download Image</Text>
                                </>
                            )}
                        </Pressable>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
}
