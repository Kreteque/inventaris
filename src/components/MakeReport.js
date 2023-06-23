import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { FlatGrid } from 'react-native-super-grid';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter } from "firebase/database";
import {db} from '../database/Config';
import BarcodeCreatorViewManager, { BarcodeFormat } from 'react-native-barcode-creator';

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

export default function MakeReport() {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica';
                font-size: 12px;
              }
              header, footer {
                height: 50px;
                background-color: #fff;
                color: #000;
                display: flex;
                justify-content: center;
                padding: 0 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                padding: 10px;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #000;
                padding: 5px;
              }
              th {
                background-color: #ccc;
              } h1 {
                text-align: center;
              }
            </style>
          </head>
          <body>
            <header>
              <h1>DAFTAR INVENTARIS KYK SUKSES MAKMUR<br>PERIODE </h1>
            </header>
            ${<Grid/>}
            
            <footer>
              <p>Thank you for your business!</p>
            </footer>
          </body>
        </html>
      `;
      const options = {
        html,
        fileName: `test`,
        directory: 'inventaris/barcode',
      };
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Success', `PDF saved to ${file.filePath}`);
      
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading) {
    return <Text>Generating PDF...</Text>;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => generatePDF()}>
        <Text style={styles.text}>Buat PDF</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
  button: {
    backgroundColor: '#6c8ee3',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
});
