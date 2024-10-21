import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  styles: any,
  children: React.ReactNode
}

export function ScreenWrapper(props: Props) {
  return (
    <SafeAreaView style={props.styles}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {props.children}
      </ScrollView>
    </SafeAreaView>
  )
}