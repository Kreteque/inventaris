import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'


export default function HelpPage() {
  return (
    <View style={{
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        backgroundColor: "grey",
        justifyContent: "center"
    }}>
      <ScrollView style={{
        width: Dimensions.get("screen").width - 50,
        height: Dimensions.get("screen").height - 50,
        backgroundColor: "white",
        alignSelf: "center",
        padding: 50,
        margin: 30,
        
      }}>

      <Text style={{color : "black"}}>
        A. Menambah Produk
      </Text>

      <Image source={{uri:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fanimal%2Fcat&psig=AOvVaw2uh0l-pglqeF0D8Q2FSHjj&ust=1686022741093000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCOi9y6aaq_8CFQAAAAAdAAAAABAE"}} />

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({})