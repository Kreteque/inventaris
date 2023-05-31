import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import BarcodeCreatorViewManager, { BarcodeFormat } from 'react-native-barcode-creator';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter } from "firebase/database";
import { useState } from 'react/cjs/react.development';
import {db} from '../database/Config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function MakeBarcode() {

    const [prodItems, setProdItems] = useState([]);
    const prodList = Object.values(prodItems);
    const [messageOn, setMessageOn] = useState(false);
    const [codeType, setCodeType] = useState();


    const readData = () => {
        const starCountRef = query(ref(db, 'products/' ));
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          setProdItems(data);
        //   console.log(data)
        })
    }

    useEffect(() => {
        readData();
        console.log(prodList)
        
    }, []);

  return (
    
    <View style={{
        flex : 1,
        display : 'flex',
        flexDirection: 'column',
        backgroundColor: "white",
        // alignContent: "space-around"
        // justifyContent: "space-evenly",
        // height: Dimensions.get("window").height,
    }}>

    {messageOn ? <View>

        <View style={{flexDirection: "row", alignItems: "center"}}>
        <MaterialCommunityIcons onPress={() => {setMessageOn(false)}} name='close-box' size={30} color={"rgba(148, 44, 44, 0.68)"} style={{
            margin: 20,
            // backgroundColor: "grey,"
            // alignSelf: "flex-end"
        }}/>

        <MaterialCommunityIcons onPress={() => {setMessageOn(false)}} name='close-box' size={30} color={"rgba(148, 44, 44, 0.58)"} style={{
            margin: 20,
            // backgroundColor: "grey,"
            // alignSelf: "flex-end"
        }}/>

        <MaterialCommunityIcons onPress={() => {setMessageOn(false)}} name='close-box' size={30} color={"rgba(155, 44, 44, 0.51)"} style={{
            margin: 20,
            // backgroundColor: "grey,"
            // alignSelf: "flex-end"
        }}/>

        <MaterialCommunityIcons onPress={() => {setMessageOn(false)}} name='close-box' size={30} color={"rgba(155, 44, 44, 0.44)"} style={{
            margin: 20,
            // backgroundColor: "grey,"
            // alignSelf: "flex-end"
        }}/>

        <MaterialCommunityIcons onPress={() => {setMessageOn(false)}} name='close-box' size={30} color={"rgba(155, 44, 44, 0.34)"} style={{
            margin: 20,
            // backgroundColor: "grey,"
            // alignSelf: "flex-end"
        }}/>

        <MaterialCommunityIcons onPress={() => {setMessageOn(false)}} name='close-box' size={30} color={"rgba(155, 44, 44, 0.2)"} style={{
            margin: 20,
            // backgroundColor: "grey,"
            // alignSelf: "flex-end"
        }}/>

        
        </View>

        <Text style={{
            alignSelf : "center",
            fontSize : 15,
            fontWeight: "600",
            padding: 5,
            textAlign : "center"
        }}>Halo, mohon maaf jika fitur ini kurang memusakan. untuk print barcode, silakan ambil screenshot lalu print dengan nyaman lewat galeri perangkat. terimaksih!</Text>
    </View> : <View style={{
        height: 50,
        width: Dimensions.get("window").width - 15,
        // backgroundColor: "grey",
        alignSelf: "center",
        flexDirection: "row"
    }}>

    <TouchableOpacity onPress={() => {setMessageOn(true)}} style={{
        flex: 1,
        width: 100,
        // backgroundColor: "green",
        alignItems: "flex-start"
    }}>

    <MaterialCommunityIcons name='comment-bookmark' size={40} color={"rgba(62, 148, 44, 0.68)"}/>

    </TouchableOpacity>

    {/* <TouchableOpacity onPress={() => {setCodeType(QR)}} style={{
        flex: 1,
        width: 100,
        // backgroundColor: "brown",
        alignItems: "center"
    }}>

    <MaterialCommunityIcons name='qrcode' size={50}/>

    </TouchableOpacity>

    <TouchableOpacity onPress={() => {setCodeType(AZTEC)}} style={{
        flex: 1,
        width: 100,
        // backgroundColor: "blue",
        alignItems: "center"
    }}>

    <MaterialCommunityIcons name='align-horizontal-distribute' size={50}/>

    </TouchableOpacity> */}

    </View>}
    <ScrollView>
        { prodList.map((item) => {
            return (<View key={item.UID} style={{
                // flex: 1,
                // position: "absolute",
                alignSelf: "center",
                // height: Dimensions.get("window").height,
                paddingTop: 5,
                // backgroundColor: 'grey',
                // justifyContent: "space-evenly"
                }}>
            
            <BarcodeCreatorViewManager
                value={item.UID}
                background={"#000000"}
                foregroundColor={"#FFFFFF"}
                format={BarcodeFormat.CODE128}
                style={{
                    // backgroundColor: "grey",
                    width: 300,
                    height: 70,
                    

                }} />
                <Text style={{
                    alignSelf: "center",
                    padding: 5,
                    color: "black",
                    fontWeight: "bold"
                }}>{item.UID}</Text>

            
            
        </View>)
        }) }
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({});