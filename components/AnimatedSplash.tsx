import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AnimatedSplashProps {
    isReady: boolean;
    onFinish: () => void;
}

export default function AnimatedSplash({ isReady, onFinish }: AnimatedSplashProps) {
    // Animation values
    const logoScale = useSharedValue(0.3);
    const logoOpacity = useSharedValue(0);
    const glowOpacity = useSharedValue(0);
    const glowScale = useSharedValue(0.8);
    const exitOpacity = useSharedValue(1);
    const exitScale = useSharedValue(1);
    const ringScale = useSharedValue(0);
    const ringOpacity = useSharedValue(0);

    useEffect(() => {
        // Phase 1: Logo entrance — scale up + fade in
        logoScale.value = withTiming(1, {
            duration: 800,
            easing: Easing.out(Easing.back(1.2)),
        });
        logoOpacity.value = withTiming(1, {
            duration: 600,
            easing: Easing.out(Easing.ease),
        });

        // Phase 2: Golden glow pulse (starts after logo lands)
        glowOpacity.value = withDelay(
            600,
            withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.15, { duration: 1200, easing: Easing.inOut(Easing.ease) })
                ),
                -1, // infinite
                true
            )
        );
        glowScale.value = withDelay(
            600,
            withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.85, { duration: 1200, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            )
        );

        // Phase 2b: Ring expanding outward
        ringScale.value = withDelay(
            500,
            withRepeat(
                withSequence(
                    withTiming(0, { duration: 0 }),
                    withTiming(2.5, { duration: 2000, easing: Easing.out(Easing.ease) })
                ),
                -1,
                false
            )
        );
        ringOpacity.value = withDelay(
            500,
            withRepeat(
                withSequence(
                    withTiming(0.4, { duration: 0 }),
                    withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) })
                ),
                -1,
                false
            )
        );
    }, []);

    // Phase 3: Exit animation when app is ready
    useEffect(() => {
        if (isReady) {
            // Small delay to ensure a smooth transition
            const timeout = setTimeout(() => {
                exitScale.value = withTiming(1.15, {
                    duration: 500,
                    easing: Easing.in(Easing.ease),
                });
                exitOpacity.value = withTiming(
                    0,
                    {
                        duration: 500,
                        easing: Easing.in(Easing.ease),
                    },
                    (finished) => {
                        if (finished) {
                            runOnJS(onFinish)();
                        }
                    }
                );
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [isReady]);

    // Animated styles
    const logoStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: logoScale.value * exitScale.value },
        ],
        opacity: logoOpacity.value * exitOpacity.value,
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value * exitOpacity.value,
        transform: [{ scale: glowScale.value }],
    }));

    const containerStyle = useAnimatedStyle(() => ({
        opacity: exitOpacity.value,
    }));

    const ringStyle = useAnimatedStyle(() => ({
        opacity: ringOpacity.value * exitOpacity.value,
        transform: [{ scale: ringScale.value }],
    }));

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            {/* Subtle radial glow behind logo */}
            <AnimatedLinearGradient
                colors={["rgba(139,105,20,0.3)", "rgba(139,105,20,0.05)", "transparent"]}
                style={[styles.glow, glowStyle]}
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Expanding ring */}
            <Animated.View style={[styles.ring, ringStyle]} />

            {/* Logo */}
            <Animated.View style={[styles.logoContainer, logoStyle]}>
                <Image
                    source={require("@/assets/images/splash-icon.png")}
                    style={styles.logo}
                    contentFit="contain"
                />
            </Animated.View>

            {/* Subtle bottom shimmer line */}
            <View style={styles.bottomShimmer}>
                <LinearGradient
                    colors={["transparent", "rgba(139,105,20,0.15)", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shimmerGradient}
                />
            </View>
        </Animated.View>
    );
}

const LOGO_SIZE = 160;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },
    logoContainer: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        borderRadius: LOGO_SIZE / 2,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
    },
    glow: {
        position: "absolute",
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8,
        borderRadius: SCREEN_WIDTH * 0.4,
    },
    ring: {
        position: "absolute",
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        borderRadius: LOGO_SIZE / 2,
        borderWidth: 1.5,
        borderColor: "rgba(139,105,20,0.4)",
    },
    bottomShimmer: {
        position: "absolute",
        bottom: SCREEN_HEIGHT * 0.12,
        width: SCREEN_WIDTH * 0.5,
        height: 1,
    },
    shimmerGradient: {
        flex: 1,
    },
});
