import {React, useEffect, useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity,Pressable } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter } from "firebase/database";
// import React, { useEffect } from 'react'
import {db} from '../database/Config';
// import { Item } from 'react-native-paper/lib/typescript/src/components/Drawer/Drawer';
import BarcodeCreatorViewManager, { BarcodeFormat } from 'react-native-barcode-creator';
// import ReactPDF from '@react-pdf/renderer';


function Grid () {
  const [items, setItems] = useState([]);

    const readData = () => {
        const starCountRef = query(ref(db, 'products/' ));
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          setItems(data);
        //   console.log(data)
        })
    }

    useEffect(() => {
        readData();
        // console.log(Object.values(items).map((item) => {return item}))
        
    }, []);
  return (
    <FlatGrid
      itemDimension={130}
      data={ items ? Object.values(items): []}
      style={styles.gridView}
      // staticDimension={300}
      // fixed
      spacing={30}
    //   maxItemsPerRow={4}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
        <BarcodeCreatorViewManager
        value={"100"}
        background={"#FFFFFF"}
        foregroundColor={"#000000"}
        format={BarcodeFormat.QR}
        style={{width: 120, height: 120, alignSelf: "center"}} />
          {/* <Text style={styles.itemName}>{item.name}</Text> */}
          <Text style={{
            color: "black",
            textAlign: "center"
          }}>{item.proName}</Text>

            <Text style={{
            color: "black",
            textAlign: "center"
          }}>{item.UID}</Text>
        </View>
      )}
    />
  );
}

export default function MakeBarcode() {

  return (
    <Grid/>
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#000',
  },
});