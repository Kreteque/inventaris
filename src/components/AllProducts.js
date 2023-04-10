import { Alert, StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import {db} from '../database/Config';
import { ref, set, update, onValue, remove, push, child, database } from "firebase/database";

function createData() {
    
    // const newKey = push(child(ref(database), 'users')).key;

    set(ref(db, '/users'), {          
    
    }).then(() => {
      // Data saved successfully!
      alert('data updated!');    
  })  
      .catch((error) => {
          // The write failed...
          alert(error);
      });
}

export default function AllProducts({navigation}) {
  return (
    <View style={styles.container}>

        <View style={styles.containerChild}>

            <View style={styles.infoCard}>

            </View>

        </View>

        <ScrollView style={styles.containerChildTwo}>
            <View style={styles.productListCard}>

            </View>

            <View style={styles.productListCard}>

            </View>
        </ScrollView>

        <Button title='Masukan Produk' color={'#b45f06'} onPress={() => navigation.navigate('Tambah Produk')}/>
       
      
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        display : 'flex',
        flexDirection: 'column'
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
        height : "75%"
     },

     productListCard : {
        flexDirection: 'row',
        backgroundColor: "white",
        padding : 20,
        borderBottomColor: "grey",
        borderBottomWidth: 2,
        height: 100,
     },
     buttonStyle : {
        borderRadius: 100,
        width: 50,
        margin: 20,
        alignSelf: 'center',
        // backgroundColor: 'white',
     }
})