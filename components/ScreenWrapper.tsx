import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  styles: any,
  children: React.ReactNode
}

export function ScreenWrapper({ styles, children }: Props) {
  return (
    <SafeAreaView style={styles}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}