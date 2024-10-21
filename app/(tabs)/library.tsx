import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default function Library() {
  return (
    <ScreenWrapper styles={styles.container}>
      <ScreenHeader name="Library" />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  }
})