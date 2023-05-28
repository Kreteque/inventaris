import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react'
// import { TextInput } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter, equalTo } from "firebase/database";
import {db} from '../database/Config';
import { useState } from 'react/cjs/react.development';
import { TextInput } from 'react-native-paper';



export default function AddTransaction({navigation, props}) {

const [prodItems, setProdItems] = useState([]);
const [notNull, setNotNull] = useState(true);
const [searchVal, setSearchVal] = useState("");



const readData = () => {
    const starCountRef = query(ref(db, 'products'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setProdItems(data);
    });
}

let prodList = Object.values(prodItems);
prodList = prodList.filter(function(item){
  return item.UID == searchVal 
          | item.proName == searchVal.charAt(0).toUpperCase() + item.proName.slice(1) 
          | item.proDesc == searchVal.charAt(0).toUpperCase() + item.proName.slice(1) 
          | item.qtty == searchVal 
          | item.buyRate == searchVal;
})
// .map(function({id, name, city}){
//    return {id, name, city};
// });


useEffect(() => {
    readData();
    
}, []);

  return (
    <View style={styles.container}>
      <TextInput 
          outlineColor='rgba(17, 2, 158, 0.25)' 
          activeOutlineColor="rgba(17, 2, 158, 0.25)" 
          mode='outlined' 
          value={searchVal} 
          onChangeText={(searchVal) => {setSearchVal(searchVal)}} 
          placeholder='Cari barang berdasarkan (UID, Nama Produk, harga beli, dll)' 
          style={styles.specializedTextBox}>

      </TextInput>

      {/* <View>
        {searchById}
      </View> */}


      <ScrollView style={styles.containerChildTwo}>
      {prodList.map((item) => {
            const firstLetter = item.proName;
            
            
            return (
                <TouchableOpacity style={styles.productListCard} key={item.UID} >

                    <View style={{
                        width: 56,
                        height: "100%",
                        backgroundColor: "rgba(78, 116, 289, 1)",
                        marginRight: 10,
                        borderRadius: 50
                    }}>
                        <Text style={{
                            alignSelf: 'center',
                            margin: 15,
                            fontSize: 22,
                            fontWeight: "bold",
                            color: "white"
                        }}>{firstLetter.charAt(0).toUpperCase()}</Text>
                    </View>
                    
                    <View>
                    <Text style={{
                        fontSize: 19,
                        color: "black",
                        fontWeight: "bold",
                        
                    }}>{item.proName.charAt(0).toUpperCase() + item.proName.slice(1)}
                    
                    </Text>

                    <Text><Text style={{color : "black"}}>UID:</Text> ({item.UID.toUpperCase()})</Text>
                    <Text><Text style={{color : "black"}}>Masuk: </Text>{item.qtty}</Text>
                    
                   
                    </View>

                    
                    
                </TouchableOpacity>
            )
        }) }
        
        

        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
      flex : 1,
      display : 'flex',
      flexDirection: 'column',
      backgroundColor: "white"
  },

  containerChild : {
      backgroundColor :'#d0e0e3',
      height: 150
   },

   containerChildTwo : {
      flex: 1,
      backgroundColor :'white',
      
   },

   infoCard : {
      flexDirection: 'row',
      backgroundColor: "white",
      padding : 20,
      margin : 20,
      borderRadius : 15,
      height : "75%",
      width: "90%"
   },

   productListCard : {
      flexDirection: 'row',
      backgroundColor: "white",
      padding : 20,
      borderBottomColor: "rgba(44, 98, 169, 0.8)",
      borderBottomWidth: 1,
      height: 100,
   },
   buttonStyle : {
      borderRadius: 100,
      width: 50,
      margin: 20,
      alignSelf: 'center',
      // backgroundColor: 'white',
   },
   infoCardText : {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
      width: "100%"
   },
   totalText : {
      fontWeight: "bold",
      color: "rgba(78, 116, 289, 1)",
      fontSize: 16,
   },
   containerBotDraw: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  bottomSheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      justifyContent: 'flex-start',
      alignItems: "flex-start",
      backgroundColor: 'white',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingVertical: 23,
      paddingHorizontal: 25,
      bottom: 0,
      borderWidth: 1.5,
      borderColor: 'rgba(9, 130, 200, 0.8)',
      
  },
  uniqueIdBox : {
      flexDirection: 'row',
      width: "90%",
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    specializedTextBox:{
      // width: '90%', 
      // height: '10%',
      fontSize: 15,
       padding:5,
       marginBottom : 5,
      // borderColor: 'gray', 
      // borderWidth: 0.2,
       borderRadius: 10,
    }
   
})