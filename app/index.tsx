import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isUserAuthenticated } from "../src/services/authStorage";
import SplashIcon from "../assets/splash2.svg";

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const [authenticated, origin] = await Promise.all([
        isUserAuthenticated(),
        AsyncStorage.getItem("deep_link_origin"),
      ]);
      setTarget(origin || authenticated ? "/wallet" : "/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!target) {
    return (
      <View style={styles.container}>
        <SplashIcon width={250} height={250} />
      </View>
    );
  }

  return <Redirect href={target as any} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
