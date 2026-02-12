import { supabase } from "@/lib/supabase";
import { useJobStore } from "@/store/useJobStore";
import * as FileSystem from 'expo-file-system';
import { Image } from "expo-image";
import * as MediaLibrary from 'expo-media-library';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Internal component for Image with Loading State
function ImageWithLoader({
    source,
    onPress,
    className,
    aspectRatioClass = "aspect-[3/4]",
    showExpandIcon = false
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
                className={`w-full ${aspectRatioClass} bg-white/5 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
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
                    <SymbolView name="arrow.up.left.and.arrow.down.right" size={12} tintColor="#fff" />
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

    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [viewerImage, setViewerImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    useEffect(() => {
        let isMounted = true;
        const fetchTemplate = async () => {
            if (!job?.templateId) return;
            try {
                const { data, error } = await supabase
                    .from('templates')
                    .select('image_url')
                    .eq('id', job.templateId)
                    .single();

                if (isMounted) {
                    if (data) {
                        setTemplateUrl(data.image_url);
                    } else if (error) {
                        const { data: allData } = await supabase
                            .from('templates')
                            .select('*')
                            .eq('id', job.templateId)
                            .single();
                        if (allData && isMounted) {
                            setTemplateUrl(allData.image_url || allData.url || allData.preview_url || null);
                        }
                    }
                }
            } catch (e) {
                console.error("Error fetching template:", e);
            }
        };

        if (job?.templateId) {
            fetchTemplate();
        }

        return () => { isMounted = false; };
    }, [job?.templateId]);

    const handleDownload = async () => {
        if (!viewerImage) return;

        if (permissionResponse?.status !== 'granted') {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                Alert.alert("Permission required", "Please allow access to your photos to download images.");
                return;
            }
        }

        setSaving(true);
        try {
            // @ts-ignore
            // eslint-disable-next-line import/namespace
            const folder = FileSystem.documentDirectory || FileSystem.cacheDirectory;
            const fileUri = folder + `delulily_${Date.now()}.jpg`;

            const downloadResumable = FileSystem.createDownloadResumable(
                viewerImage,
                fileUri,
                {},
            );

            const result = await downloadResumable.downloadAsync();
            if (result && result.uri) {
                await MediaLibrary.saveToLibraryAsync(result.uri);
                Alert.alert("Saved!", "Image saved to your gallery.");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to save image.");
        } finally {
            setSaving(false);
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
                        <SymbolView name="arrow.left" size={20} tintColor="#fff" />
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

                        {/* Template Reference */}
                        <View className="flex-1">
                            <View className="bg-white/5 p-3 rounded-2xl border border-white/10 items-center gap-3">
                                {templateUrl ? (
                                    <Image
                                        source={templateUrl}
                                        className="w-full aspect-square rounded-xl bg-white/5"
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View className="w-full aspect-square rounded-xl bg-white/5 items-center justify-center">
                                        <SymbolView name="photo" size={24} tintColor="#ffffff40" />
                                    </View>
                                )}
                                <Text className="text-white/80 text-xs font-semibold">Template</Text>
                            </View>
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
                            <SymbolView name="xmark" size={20} tintColor="#fff" />
                        </Pressable>
                    </View>

                    {/* Full Screen Image - Standard Image since viewing library might be complex */}
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
                            className={`nav-button overflow-hidden rounded-full py-4 items-center justify-center flex-row gap-2 ${saving ? 'opacity-70' : ''}`}
                            style={{ backgroundColor: 'white' }}
                        >
                            {saving ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <>
                                    <SymbolView name="arrow.down.to.line" size={18} tintColor="#000" />
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
