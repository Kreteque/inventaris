import { StyleSheet, Text, View, Alert } from 'react-native';
import { useState } from 'react/cjs/react.development';
import { ref, set, update, onValue, remove } from "firebase/database";
import { db } from '../database/Config';
import uuid from 'react-native-uuid';
import { color } from '@rneui/base';
import { TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



export default function App() {

  const [uniqID, setUniqID] = useState(""); 
  const [proName, setProName] = useState("");
  const [qtty, setQtty] = useState("");
  const [proDesc, setProDesc] = useState("");
  const [buyRate, setBuyRate] = useState("");

  const [textError, setTextError] = useState();
  


  function createData() {
    
            // const newKey = push(child(ref(database), 'users')).key;

           
              set(ref(db, 'products/' + uniqID ), {          
                UID: uniqID,
                proName: proName,
                qtty: qtty,
                proDesc: proDesc,
                buyRate: buyRate,
              }).then(() => {
                // Data saved successfully!
                setUniqID("");
                setProName("");
                setProDesc("");
                setQtty("");
                setBuyRate("");

                // alert('data updated!');    
            })  
                .catch((error) => {
                    // The write failed...
                    alert(error);
                });
  
            

            
              
  }

  function updateData () {

            // const newKey = push(child(ref(database), 'users')).key;

    update(ref(db, 'users/' + uniqID), {          
      ID: uniqID,
      proName: proName  
    }).then(() => {
      // Data saved successfully!
       
      
      alert('data updated!');

  })  
      .catch((error) => {
          // The write failed...
          alert(error);
      });


  };

  function readData() {

    const starCountRef = ref(db, 'users/' + uniqID);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setProName(data.proName);
      // setEmail(data.email);   

    });

  }

  function deleteData () {

    remove(ref(db, 'users/' + uniqID));
    alert('removed');
  }

  return (

  
    <View style={styles.container}> 

        {!!textError && (
          <Text style={{ color: "red" }}>{textError}</Text>
        )}

        {textError === null && (
          <Text style={{ color: "green" }}>Data berhasil ditambahkan!</Text>
        )}

<ScrollView style={{width: "100%", marginLeft: "10%" }}>
      

      <View style={styles.uniqueIdBox}>
      <TextInput  
          value={uniqID}
          onChangeText={(uniqID) => {setUniqID(uniqID)}}
          placeholder= {"Contoh unique ID: 3e5dd0a6-192e"}
          mode='outlined'
          style={styles.specializedTextBox}
          maxLength={13}>

      </TextInput>
        <Button type="clear" title='random id' onPress={(uniqID) => {setUniqID(String(uuid.v4().slice(0, 13)))}} > 
          <MaterialCommunityIcons name="dice-3" color="rgba(78, 116, 289, 1)" size={50} /> 
        </Button>
      </View>
      
      
      <TextInput 
          value={proName}
          onChangeText={(proName) => {setProName(proName)}}
          placeholder={"Nama Produk" }
          mode='outlined' 
          style={styles.textBoxes}
          maxLength={36}>
      </TextInput>

      <TextInput 
          value={proDesc}
          onChangeText={(proDesc) => {setProDesc(proDesc)}}
          placeholder="Deskripsi Produk"
          mode='outlined'
          style={styles.textBoxes}
          maxLength={36}>
      </TextInput>

      <TextInput 
          value={qtty}
          onChangeText={(qtty) => {setQtty(qtty)}}
          placeholder="Kuantitas"
          mode='outlined'
          style={styles.textBoxes}
          keyboardType='numeric'
          maxLength={9007199254740991}>
      </TextInput>

      <TextInput
          value={buyRate}
          onChangeText={(buyRate) => {setBuyRate(buyRate)}}
          placeholder="Harga Beli"
          mode='outlined'
          style={styles.textBoxes}
          keyboardType='numeric'
          maxLength={9007199254740991}>
      </TextInput>
</ScrollView>

      {/* Need improvement */}
      <Button color={'rgba(78, 116, 289, 1)'} title='Masukan Produk' onPress={() => {
        if (uniqID.trim() === ""){
          setUniqID(String(uuid.v4()).slice(0, 13));
        } else if (proName.trim() === ""){
            setTextError('Nama Produk Diperlukan!');
          } else if (qtty.trim() === "" | NaN){
            setTextError('Masukan kuantitas!');
            } else if (buyRate.trim() === ""){
              setTextError('Masukan harga produk!');
              } else {
                setTextError(null);
                createData();
              }
          
      }}> <Icon name="save" color="white" /> Simpan </Button> 

    </View>
  );  
}

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'space-around',
    margin: 10,
    
  },
  textBoxes: {
    width: '90%', 
    // height: '10%',
    fontSize: 15,
     padding:5,
     marginBottom : 5,
    // borderColor: 'gray', 
    // borderWidth: 0.2,
     borderRadius: 10,
     
  },

  buttonStyle: {
    borderRadius: 100,
    width: 100,
    margin: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
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
});