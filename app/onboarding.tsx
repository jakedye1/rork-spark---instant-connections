import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Video, Users, Zap, ArrowRight } from "lucide-react-native";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "welcome",
    title: "Where Real People\nConnect Fast.",
    subtitle: "Swipe. Match. Go Live.\nMake sparks happen.",
  },
  {
    id: "features",
    title: "Meet real humans\nin real time.",
    features: [
      { icon: <Video size={32} color={Colors.white} />, label: "Live Video\nMatching", color: Colors.babyBlue },
      { icon: <Zap size={32} color={Colors.white} />, label: "Instant\nConnections", color: Colors.pastelYellow },
      { icon: <Users size={32} color={Colors.white} />, label: "Group Match\nMode", color: Colors.accent },
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/profile-setup");
    }
  };

  const renderItem = ({ item, index }: { item: typeof SLIDES[0], index: number }) => {
    return (
      <View style={{ width, alignItems: "center", paddingHorizontal: 24 }}>
        <View style={styles.slideContent}>
          {item.id === "welcome" ? (
             <View style={styles.welcomeContainer}>
                {/* Background silhouette/gradient effect could be added here */}
                <View style={styles.spacer} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
             </View>
          ) : (
            <View style={styles.featuresContainer}>
               <Text style={[styles.title, { marginBottom: 40 }]}>{item.title}</Text>
               <View style={styles.featuresGrid}>
                  {item.features?.map((feature, i) => (
                    <GlassCard key={i} style={styles.featureCard} intensity={30} variant="default">
                       <View style={styles.featureContent}>
                          <View style={[styles.iconBubble, { shadowColor: feature.color, borderColor: feature.color }]}>
                             {feature.icon}
                          </View>
                          <Text style={styles.featureLabel}>{feature.label}</Text>
                       </View>
                    </GlassCard>
                  ))}
               </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.background]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <FlatList
            ref={slidesRef}
            data={SLIDES}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(e) => {
              setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
            }}
            keyExtractor={(item) => item.id}
          />

          <View style={styles.footer}>
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {SLIDES.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const widthAnim = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 32, 8],
                  extrapolate: "clamp",
                });
                const colorAnim = scrollX.interpolate({
                  inputRange,
                  outputRange: [Colors.glassBorder, Colors.babyBlue, Colors.glassBorder],
                  extrapolate: "clamp",
                });

                return (
                  <Animated.View
                    key={i}
                    style={[
                      styles.dot,
                      { width: widthAnim, backgroundColor: colorAnim },
                    ]}
                  />
                );
              })}
            </View>

            <GlassButton
              title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
              onPress={handleNext}
              size="large"
              variant="primary"
              style={styles.button}
              icon={currentIndex === SLIDES.length - 1 ? <ArrowRight size={24} color={Colors.charcoal} /> : undefined}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  welcomeContainer: {
    alignItems: "center",
    gap: 24,
  },
  featuresContainer: {
    alignItems: "center",
    width: "100%",
  },
  spacer: {
    height: 100, // Placeholder for illustration/graphic
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: Colors.white,
    textAlign: "center",
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 28,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  featureCard: {
    width: width * 0.4, // 40% of screen width
    aspectRatio: 1,
    borderRadius: 24,
    marginBottom: 16,
  },
  featureContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 16,
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  featureLabel: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
  },
  footer: {
    padding: 24,
    gap: 32,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    width: "100%",
  },
});
