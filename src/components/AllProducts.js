import { Alert, StyleSheet, Text, View, Button } from 'react-native'
import { useState } from 'react/cjs/react.development';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import {db} from '../database/Config';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot } from "firebase/database";
import { useEffect } from 'react';

let initialArray = [
    {
        id : 1,
        text : "one",
        other: "once",
    },
    {
        id : 2,
        text: "two",
        other: "twice",
    },
    {
        id: 3,
        text: "three",
        other: "third",
    },
    {
        id: 4,
        text: "four",
        other: "forth",
    },
    {
        id: 5,
        text: "five",
        other: "fifth",
    },
    {
        id: 6,
        text: "six",
        other: "sixth",
    },
    {
        id: 7,
        text: "seven",
        other: "third",
    }
];



export default function AllProducts({navigation}) {


    const [prodItems, setProdItems] = useState([]);
    
const getData = () => {
    const starCountRef = ref(db, 'products/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setProdItems(data);
      console.log(data);
    });

}
    
useEffect(() => {
    getData();
}, [])

    //  const obj = JSON.parse(prodItems);
    

  return (

    <View style={styles.container}>

        <View style={styles.containerChild}>

            <View style={styles.infoCard}>
                
            </View>

        </View>
        
        <ScrollView style={styles.containerChildTwo}>

            
        {/* <View style={styles.productListCard}>
           <Text>{prodItems.proName}</Text>
           <Text>{prodItems.UID}</Text>
        </View> */}
        {Object.values(prodItems).map((item) => {
            return (
                <View style={styles.productListCard}>
                    <Text>{item.proName}</Text>
                    
                </View>
            )
        })}
        
            

        </ScrollView>

        <Button title='Masukan Produk' color={'rgba(78, 116, 289, 1)'} onPress={() => navigation.navigate('Tambah Produk')}/>
       
      
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