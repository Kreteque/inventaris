// import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
// import React, { useEffect } from 'react'
// import BarcodeCreatorViewManager, { BarcodeFormat } from 'react-native-barcode-creator';
// import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter } from "firebase/database";
// import { useState } from 'react/cjs/react.development';
// import {db} from '../database/Config';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Page, Document } from '@react-pdf/renderer';
// import ReactPDF from '@react-pdf/renderer';
// import { Button } from 'react-native-paper';
// import { FlatGrid } from 'react-native-super-grid';


// const MyDocument = () => (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.section}>
//           <Text>Section #1</Text>
//         </View>
//         <View style={styles.section}>
//           <Text>Section #2</Text>
//         </View>
//       </Page>
//     </Document>
//   );



// export default function MakeBarcode() {

//     const [prodItems, setProdItems] = useState([]);
//     const prodList =  Object.values(prodItems);
//     const [messageOn, setMessageOn] = useState(false);
//     const [codeType, setCodeType] = useState();


//     const readData = () => {
//         const starCountRef = query(ref(db, 'products/' ));
//         onValue(starCountRef, (snapshot) => {
//           const data = snapshot.val();
//           setProdItems(data);
//         //   console.log(data)
//         })
//     }

//     useEffect(() => {
//         readData();
//         console.log(prodList)
        
//     }, []);


//   return (
    
//     <View>
//     <FlatGrid
//       itemDimension={130}
//       data={prodList}
//       style={styles.gridView}
//       // staticDimension={300}
//       // fixed
//       spacing={10}
//       renderItem={({ item }) => (
//         <View style={styles.itemContainer}>
//           <Text style={styles.itemName}>{item}</Text>
//           {/* <Text style={styles.itemCode}>{item.code}</Text> */}
//         </View>
//       )}
//     />
//     </View>

//   );
// }

// const styles = StyleSheet.create({});




import {React, useEffect, useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter } from "firebase/database";
// import React, { useEffect } from 'react'
import {db} from '../database/Config';
// import { Item } from 'react-native-paper/lib/typescript/src/components/Drawer/Drawer';
import BarcodeCreatorViewManager, { BarcodeFormat } from 'react-native-barcode-creator';
// import ReactPDF from '@react-pdf/renderer';

export default function Example() {
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