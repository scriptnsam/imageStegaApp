import { Pressable, Image, StyleSheet } from "react-native"
import { View, Text } from "./Themed"
import { useNavigation } from "expo-router"
import Colors from "@/constants/Colors"
import { StatusBar } from "expo-status-bar"

type Props = {
  name: string
}
export function ScreenHeader(Props: Props) {
  const navigation = useNavigation()

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => navigation.goBack()}
      >
        <Image style={styles.back} source={require('@/assets/images/Back.png')} />
      </Pressable>
      <Text style={{ fontFamily: 'InclusiveSans', fontSize: 24, color: Colors.primary }}>{Props.name}</Text>
      <StatusBar backgroundColor={Colors.accent} style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  back: {
    width: 50,
    height: 50,
  },
  header: {
    marginTop: 3,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    backgroundColor: 'transparent'
  },
})