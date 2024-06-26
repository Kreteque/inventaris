import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  Linking, 
  Dimensions, 
  TouchableOpacity, 
  Alert,
  BackHandler,
  ImageBackground,
 } from 'react-native'
import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Dashboard from './src/components/Dashboard';
import AllProducts from './src/components/AllProducts';
import AddProduct from './src/components/AddProduct';
import BottomDrawer from './src/components/BottomDrawer';
import { createStackNavigator } from '@react-navigation/stack';
import AddTransaction from './src/components/AddTransaction';
import AllTransaction from './src/components/AllTransaction';
import MakeBarcode from './src/components/MakeBarcode';
import ScanBarcode from './src/components/ScanBarcode';
import { useState } from 'react';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter } from "firebase/database";
import { useEffect } from 'react';
import { db } from './src/database/Config';
import { TextInput } from 'react-native-gesture-handler';
import UserConfig from './src/components/UserConfig';
import uuid from 'react-native-uuid';
import LowStock from './src/components/LowStock';
import ProductOut from './src/components/ProductOut';
import ProductIn from './src/components/ProductIn';
import HelpPage from './src/components/additional/HelpPage';
import Returnproduct from './src/components/ReturnProduct';
import GestureHandlerRootView from 'react-native-gesture-handler';
import { BackgroundImage } from '@rneui/base';
import MakeReport from './src/components/MakeReport';


function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props}  />
      
        {/* <MaterialCommunityIcons name='github' size={25} color={"red"}/> */}
      
      {/* <DrawerItem label="Github" onPress={() => {Linking.openURL('https://github.com/Kreteque')}} />
      <DrawerItem label="Bantuan" onPress={() => {}} /> */}
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      // useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
      drawerStyle: {
      backgroundColor: 'white',
      width: 240,
      
    }
  }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="view-dashboard" color={'#0b5394'} size={25} Padding={0} />
        )}} />

      <Drawer.Screen 
        name="Semua Produk"
        component={AllProducts}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="package-variant" color={'rgba(211, 121, 8, 0.69)'} size={25} />
      )}} />

      <Drawer.Screen 
        name="Semua Transaksi"
        component={AllTransaction}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="file-document-multiple-outline" color={'#38761d'} size={25} />
      )}} />

      <Drawer.Screen
        name="Stok Rendah"
        component={LowStock}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="gauge-low" color={'rgba(247, 140, 54, 0.93)'}  size={25} />
        )}} />

      <Drawer.Screen
        name="Transaksi Keluar"
        component={ProductOut}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="arrow-top-right-bold-box-outline" color={'#f82222'}  size={25} />
        )}} />

      <Drawer.Screen
        name="Transaksi Masuk"
        component={ProductIn}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="arrow-bottom-left-bold-box-outline" color={'#38761d'}  size={25} />
        )}} />

      <Drawer.Screen
        name="Produk Retur"
        component={Returnproduct}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="arrow-u-right-bottom-bold" color={'rgba(200, 165, 0, 0.83)'}  size={25} />
        )}} />

      {/* <Drawer.Screen
        name="Buat Laporan"
        component={MakeReport}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="arrow-u-right-bottom-bold" color={'rgba(200, 165, 0, 0.83)'}  size={25} />
        )}} /> */}
        

        {/* <Drawer.Screen name='Github'>
        <View style={{
          width: 50,
          height: 50,
          backgroundColor: "grey"
        }}>

        </View>
        </Drawer.Screen> */}

      {/* 

      <Drawer.Screen
        name="Produk Masuk"
        component={ProductInScreen}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="arrow-bottom-left-bold-box-outline" color={'#38761d'}  size={15} />
        )}} />

      <Drawer.Screen
        name="Produk Keluar"
        component={ProductOutScreen}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="arrow-top-right-bold-box-outline" color={'#ff8d31'} size={15} />
        ), drawerItemStyle: {borderBottomWidth : 3, borderBottomColor : '#2493f6'}}} />

      <Drawer.Screen 
        name="Bantuan"
        component={HelpScreen}
        options={{drawerIcon : () => (
                  <MaterialCommunityIcons name="help" size={15} />)
                   }} /> */}

      {/* <Drawer.Screen 
      name='Tambah Produk'
      component={AddProduct}
       /> */}

    </Drawer.Navigator>

    
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Drawer" component={MyDrawer} options={{ headerShown: false }} />
      <Stack.Screen name='Tambah Produk' component={AddProduct}/>
      <Stack.Screen name='Tambah Transaksi' component={AddTransaction}  />
      <Stack.Screen name='Buat Barcode' component={MakeBarcode}/>
      <Stack.Screen name='Scan Barcode' component={ScanBarcode}/>
      <Stack.Screen name='Pengaturan Pengguna' component={UserConfig}/>
      <Stack.Screen name='Halaman Bantuan' component={HelpPage}/>
      <Stack.Screen name='Buat Laporan' component={MakeReport}/>
      
    </Stack.Navigator>
  );
}



export default function App({navigation}) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAtributes, setUserAtributes] = useState([]);
  const [usrId, setUsrId] = useState("");
  const [usrEmail, setUsrEmail] = useState("");
  const [usrPin, setUsrPin] = useState("");
  const [addUser, setAddUser] = useState ("");
  const [login, setLogin] = useState("");
  const [errText, setErrText] = useState('');
 
  const usrID = String(uuid.v4());
  const netInfo = useNetInfo();

  const getData = () => {
    
    const starCountRef = query(ref(db, 'userAtr'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      
      setUserAtributes(data);
      setLogin("")
    });
  
  }

  const atributUser = Object.values(userAtributes);

  useEffect(() => {
    getData();
    // console.log(login);
    // console.log(atributUser.map((item) => item.usrEmail));
    
    // console.log(netInfo.isConnected);
}, [])
 
const enter = () => {
  checkConnection();
  atributUser.map((item) => {if (item.usrPin === login) {
 
    setIsLoggedIn(true);
    setLogin("")
  } else {
    
    setErrText("Pin yang dimasukan salah!\nSilakan coba kembali");
    setLogin("");
  }

})
}

const checkConnection = () => {
  if (netInfo.isConnected === false) {
    Alert.alert("Tidak ada koneksi internet", 'silakan hubungkan perangkat ke internet', [
      {
          text: 'Tutup',
          style: 'cancel',
      },
      {text: 'Keluar', onPress: () => {BackHandler.exitApp()}},
      ]);
  }
  console.log(netInfo.isConnected?.toString());
};

function createData() {
    
  // const newKey = push(child(ref(database), 'users')).key;

 
    set(ref(db, 'userAtr/' + "0001" ), {          
      usrID: "0001",
      usrEmail: "Aldiryaldi20@gmail.com",
      usrPin: "87654321",
    }).then(() => {
      // Data saved successfully!
      setUsrId("");
      setUsrEmail("");
      setUsrPin("");
      
      // alert('data updated!');    
  })  
      .catch((error) => {
          // The write failed...
          alert(error);
      });

  

  
    
}

  return (

    <NavigationContainer>
    

      {/* <MyDrawer/> */}
      {isLoggedIn ? <MyStack/> : 
        <View style={{
          height: Dimensions.get("screen").height,
          width: Dimensions.get("screen").width,
          backgroundColor: "rgba(39, 245, 230, 0.08)",
          alignItems: "center",
          // mar: Dimensions.get("screen").width - 200,
          flexDirection: "column",
          // justifyContent: "space-evenly"
        }}>

        <ImageBackground 
        source={{uri: "https://static.vecteezy.com/system/resources/previews/005/647/959/original/isometric-illustration-concept-man-analyzing-goods-in-warehouse-free-vector.jpg"}}
        style={{
          flex: 1,
          justifyContent: "center",
        }}
        resizeMode='cover'
        blurRadius={4}
        
        >

        

          {!!errText && 
          <View style={{
            // position: "absolute",
            marginTop: 40
          }}>
            <Text style={{
              color: "red",
              fontWeight: "500",
              textAlign: "center"
            }}>
              {errText}
            </Text>
          </View>}

          <View>
          <Text style={{
            position: "absolute",
            alignSelf: "center",
            marginTop: 340,
            color: "grey"
          }} onPress={() => {Linking.openURL("https://github.com/Kreteque")}}>2023 © Kreteque</Text>
          </View>

          <TextInput  
          value={String(login)}
          onChangeText={(login) => {setLogin(String(login)); }}
          onEndEditing={() => {enter()}}
          placeholder= {"Masukan 8 digit PIN"}
          // mode='outlined'
          style={{
            height: 100,
            fontSize: 30,
            alignSelf : "center",
            // position: "absolute",
            margin: 50,
            marginTop: 50,
            textAlign: "center",
            borderBottomWidth: 3,
            borderBottomColor: "grey",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            fontWeight: "bold",
          

          }}
          maxLength={8}
          keyboardType="number-pad"
          secureTextEntry={true}>

      </TextInput>

      {/* <TouchableOpacity onPress={() => {createData()}} style={{
        height: 70,
        width: 70,
        // backgroundColor: "green",
        position: "absolute",
        alignSelf: "flex-end",
        marginStart: 310,

      }}>

        <MaterialCommunityIcons name='account-plus' size={50} color={"rgba(104, 94, 123, 0.83)"} style={{
          margin: 5
        }}/>


      </TouchableOpacity> */}
      
      </ImageBackground>
        </View>}

        

        { !!addUser && <View>
          
      {/* <TextInput 
          value={usrId}
          onChangeText={(usrId) => {setUsrId(usrId)}}
          placeholder={"id" }
          // mode='outlined' 
          // style={styles.textBoxes}
          maxLength={36}>
      </TextInput> */}

      <TextInput 
          value={usrEmail}
          onChangeText={(usrEmail) => {setUsrEmail(usrEmail)}}
          placeholder={"Email" }
          // mode='outlined' 
          // style={styles.textBoxes}
          maxLength={36}
          keyboardType="email-address">
      </TextInput>

      <TextInput 
          value={usrPin}
          onChangeText={(usrPin) => {setUsrPin(usrPin)}}
          placeholder={"id" }
          // mode='outlined' 
          // style={styles.textBoxes}
          maxLength={36}
          keyboardType='numeric'>
      </TextInput>
        </View> }
      
    </NavigationContainer>
    
  )
}

const styles = StyleSheet.create({})
