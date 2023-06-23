import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { db } from '../database/Config'
import { ref, update } from 'firebase/database'
import React from 'react'
import { TextInput } from 'react-native-paper'

export default function UserConfig({navigation, route}) {
  const [updatePin, setUpdatePin] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");

  const updateUsrAtr = (param) => {
    update(ref(db, "usrAtr/" + param), {
      usrID: updatePin,
      usrEmail: updateEmail
    }).then(() => {
      alert('Pin diubah!'); 
      setUpdatePin("");
    })
  }


  // console.log(route.params.id)
  return (
    <View style={{
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        backgroundColor: "grey",
        justifyContent: "center"
    }}>

        <View style={{
          width: Dimensions.get("screen").width - 50,
          height: Dimensions.get("screen").height - 50,
          backgroundColor: "white",
          alignSelf: "center",
          padding: 50,
          margin: 30,
        }}>

            <TextInput
              value={updatePin}
              onChangeText={(updatePin) => {setUpdatePin(updatePin)}}
              placeholder='Masukan pin baru'
            >

            </TextInput>

            {/* <TextInput
              value={updateEmail}
              onChangeText={(updateEmail) => {setUpdatePin(updateEmail)}}
              placeholder='Masukan Email baru'
              style={{marginTop: 10}}
            >

            </TextInput> */}

            <TouchableOpacity
            onPress={() => {updateUsrAtr(route.params.id)}}
             style={{
              width: 100,
              height: 50,
              backgroundColor: "rgba(52, 143, 255, 0.83)",
              alignSelf: "center",
              marginTop: 10,
              alignItems: "center",
              borderRadius: 30
            }}>

              <Text style={{
                color: "white", 
                margin: 10, 
                fontWeight: "bold",
                fontSize: 17
                }}>Ubah Pin</Text>

            </TouchableOpacity>

        </View>
      
    </View>
  )
}

const styles = StyleSheet.create({})