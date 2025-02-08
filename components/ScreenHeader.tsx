import { Pressable, Image, StyleSheet, Touchable, TouchableOpacity } from "react-native"
import { View, Text } from "./Themed"
import { useNavigation } from "expo-router"
import Colors from "@/constants/Colors"
import { StatusBar } from "expo-status-bar"

type ButtonProps = {
  name: string,
  onPress: () => void
}

type Props = {
  name: string,
  button?: ButtonProps
}
export function ScreenHeader({ name, button }: Props) {
  const navigation = useNavigation()

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => navigation.goBack()}
      >
        <Image style={styles.back} source={require('@/assets/images/Back.png')} />
      </Pressable>

      <View style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontFamily: 'InclusiveSans', fontSize: 24, color: Colors.primary }}>{name}</Text>

        {button?.name && button?.name !== undefined && (
          <TouchableOpacity onPress={button.onPress} style={{ alignSelf: "flex-end", backgroundColor: Colors.light.tint, padding: 2, borderRadius: 2 }} >
            <Text>{button.name}</Text>
          </TouchableOpacity>
        )}

      </View>

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