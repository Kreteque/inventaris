import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { ref, set, update, onValue, remove } from "firebase/database";
import { db } from '../database/Config';
import uuid from 'react-native-uuid';
import { TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';



export default function AddProduct() {

  const [uniqID, setUniqID] = useState(""); 
  const [proName, setProName] = useState("");
  const [qtty, setQtty] = useState("");
  const [proDesc, setProDesc] = useState("");
  const [admin, setAdmin] = useState("");
  const [expired, setExpired] = useState("");
  // const [buyRate, setBuyRate] = useState("");
  const [textError, setTextError] = useState();
  const [prodCode, setProdCode] = useState("");
  const [key, setKey] = useState(0);
  const [prodList, setProdlist] = useState({});
  const dateStamp = new Date();
  const month = dateStamp.getMonth() + 1;
  const [selectedUnit, setSelectedUnit] = useState();
  const [fQtty, setFQtty] = useState(0);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false)
  const windowHeight = Dimensions.get('window').height;
  
  const timeStamp = String(dateStamp.getDate() + "/" + month + "/" + dateStamp.getFullYear());
  const searchAndDestroy = String(date).split(' ');
  const monthToNumber = () => {

    
    switch (searchAndDestroy[1]) {
      case "Jan":
        searchAndDestroy[1] = "01"
        break;
      case "Feb":
        searchAndDestroy[1] = "02"
        break;
      case "Mar":
        searchAndDestroy [1] = "03"
        break;
      case "Apr":
        searchAndDestroy[1] = "04"
        break;
      case "May": 
        searchAndDestroy[1] = "05"
        break;
      case "Jun":
        searchAndDestroy[1] = "06"
        break;
      case "Jul":
        searchAndDestroy[1] = "07"
        break;
      case "Aug":
        searchAndDestroy[1] = "08"
        break;
      case "Sep":
        searchAndDestroy[1] = "09"
        break;
      case "Oct":
        searchAndDestroy[1] = "10"
        break;
      case "Nov":
        searchAndDestroy[1] = "11"
        break;
      case "Des":
        searchAndDestroy[1] = "12"
        break;
      
    }

    let reFormatedExp = searchAndDestroy[2] + "/" + searchAndDestroy[1] + "/" + searchAndDestroy[3];


    if(reFormatedExp === timeStamp){
      return reFormatedExp = "Non-Expired";
    } else{
      return setExpired(reFormatedExp);
    }
  }
  
  useEffect(() => {
    
    readData();
    console.log(Object.values(prodList).length);
  
    setUniqID("kyk_" + String(dateStamp.getMonth() + 1) + "_" + String(dateStamp.getFullYear()) + "_" +  String(dateStamp.getMilliseconds()));
    
}, []);


const pickerRef = useRef();

function openPicker() {
  pickerRef.current.focus();
}

function closePicker() {
  pickerRef.current.blur();
}


  function createData() {
    
            // const newKey = push(child(ref(database), 'users')).key;
            
           
              set(ref(db, 'products/' + uniqID ), {          
                UID: uniqID,
                proName: proName.charAt(0).toUpperCase() + proName.slice(1),
                qtty: parseInt(0),
                proDesc: proDesc.charAt(0).toUpperCase() + proDesc.slice(1),
                // buyRate: parseInt(buyRate),
                timeMark: timeStamp,
                // Exp: date,
                admin: admin,
                addedQtty : 0,
                subbsQtty : 0,
                qttyOnhold: 0,
                // prodCode : prodCode,
                unit : selectedUnit,
                fQtty: parseInt(fQtty),
                restok: 0,
                reject: 0
              }).then(() => {
                // Data saved successfully!
                setUniqID("");
                setProName("");
                setProDesc("");
                setQtty("");
                setProdCode("");
                setExpired("");
                setFQtty();
                // setBuyRate("");
                update(ref(db, 'products/' + uniqID), {          
                  qtty: parseInt(fQtty)  
                })
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

    const starCountRef = ref(db, 'products/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setProdlist(data);
      // setEmail(data.email);   

    });

  }

  function deleteData () {

    remove(ref(db, 'users/' + uniqID));
    alert('removed');
  }

  return (

  
    <View style={styles.container}> 

        { !!textError && (
          <Text style={{ color: "red" }}>{textError}</Text>
        )}

        {textError === null && (
          <Text style={{ color: "green" }}>Data berhasil ditambahkan!</Text>
        )}

<ScrollView style={{width: "100%", marginLeft: "10%",}}>
      

      {/* <View style={styles.uniqueIdBox}>
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
      </View> */}
      {/* <TextInput 
          value={prodCode}
          onChangeText={(prodCode) => {setProdCode(prodCode)}}
          placeholder={"Kode Produksi" }
          mode='outlined' 
          style={styles.textBoxes}
          maxLength={36}
          onFocus={() => {setKey(key + 1);}}>
      </TextInput> */}
      
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
          placeholder="Deskripsi Produk (dapat kosong)"
          mode='outlined'
          style={styles.textBoxes}
          maxLength={60}>
      </TextInput>

      <TextInput 
          value={admin}
          onChangeText={(admin) => {setAdmin(admin)}}
          placeholder="Admin Harus Diisi!"
          mode='outlined'
          style={styles.textBoxes}
          maxLength={60}>
      </TextInput>

      <TextInput 
          value={fQtty}
          onChangeText={(fQtty) => {setFQtty(fQtty)}}
          placeholder="Stok Awal (0 jika dikosongkan)"
          mode='outlined'
          style={styles.textBoxes}
          maxLength={60}>
      </TextInput>
      {/* <TextInput 
          value={qtty}
          onChangeText={(qtty) => {setQtty(qtty)}}
          placeholder="Kuantitas"
          mode='outlined'
          style={styles.textBoxes}
          keyboardType='numeric'
          maxLength={9007199254740991}>
      </TextInput> */}

      {/* <TextInput
          value={buyRate}
          onChangeText={(buyRate) => {setBuyRate(buyRate)}}
          placeholder="Harga Beli satuan (kosongkan jika tdk perlu)"
          mode='outlined'
          style={styles.textBoxes}
          keyboardType='numeric'
          maxLength={9007199254740991}>
      </TextInput> */}

      {/* <TouchableOpacity style={{
        // backgroundColor: "green",
        height: 50,
        width: 100,
        marginTop: 10,
        flexDirection: "row"

      }} onPress={() => {setOpen(true)}}> 
        <MaterialCommunityIcons color={"grey"} name='calendar-multiselect' size={40}/>
        <Text style={{color: "grey"}}>Pilih tanggal EXPIRED</Text>
        
      </TouchableOpacity>

      <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={(date) => {
                setOpen(false);
                setDate(date);
                // setExpired(date)
              }}
              onCancel={() => {
                setOpen(false)
              }}
              mode='date'
              
            /> */}
      
            <Text style={{color: "rgba(52, 162, 40, 0.8)", fontWeight: "600"}}>Satuan Unit :</Text>
                  <Picker
                      ref={pickerRef}
                      selectedValue={selectedUnit}
                      onValueChange={(itemValue, itemIndex) =>
                      setSelectedUnit(itemValue)}
                      style={{
                      width: 100,
                      height: 60}}>
                                
                  <Picker.Item style={{color: "black"}} label="Pilih" value="" />
                  <Picker.Item style={{color: "black"}} label="Buah" value="buah" />
                  <Picker.Item style={{color: "black"}} label="Gram" value="gram" />
                  </Picker>

                  

</ScrollView>

      {/* Need improvement */}
    
      <MaterialCommunityIcons name='content-save' color={"rgba(2, 121, 6, 0.8)"} size={50} style={{
        position:"absolute",
        alignSelf: "center",
        marginTop: windowHeight - 180,
        // marginRight: 30,
        width: 70,
        backgroundColor:"rgba(2, 121, 6, 0.29)",
        padding: 10,
        height: 70,
        borderRadius: 50
        
        
      }} onPress={() => {
        // if (prodCode.trim() === ""){
        //   setTextError('Kode Produk Diperlukan!');
         if (proName.trim() === ""){
            setTextError('Nama Produk Diperlukan!');
          }  else if (admin.trim() === ""){
            setTextError('Admin pencatat diperlukan!');
          }  else if (selectedUnit === undefined){
            setTextError('Silakan memilih satuan unit!');
          }  
          // else if (buyRate.trim() === ""){
          //   setBuyRate("0");
          // } 
          
          else {
                setTextError(null);
                createData();
              }
          
      }}/> 

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
    height: 400
    
  },
  textBoxes: {
    width: '90%', 
    height: 50,
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