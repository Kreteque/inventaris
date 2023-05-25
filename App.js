import { StyleSheet, Text, View, Button, Linking } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HelpScreen from './src/screens/HelpScreen';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import ProductsScreen from './src/screens/ProductsScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import LowStocksScreen from './src/screens/LowStocksScreen';
import ProductInScreen from './src/screens/ProductInScreen';
import ProductOutScreen from './src/screens/ProductOutScreen';
import Dashboard from './src/components/Dashboard';
import AllProducts from './src/components/AllProducts';
import AddProduct from './src/components/AddProduct';
import BottomDrawer from './src/components/BottomDrawer';
import { createStackNavigator } from '@react-navigation/stack';




//ToDos:
//1. make more screens
//2. 



function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Github" onPress={() => Linking.openURL('https://github.com/Kreteque')} />
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
      backgroundColor: '#c6cbef',
      width: 240,
      
    }
  }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="view-dashboard" color={'#0b5394'} size={15} Padding={0} />
        )}} />

      <Drawer.Screen 
        name="Semua Produk"
        component={AllProducts}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="package-variant" color={'#e69138'} size={15} />
      )}} />

      <Drawer.Screen 
        name="Semua Transaksi"
        component={BottomDrawer}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="file-document-multiple-outline" color={'#38761d'} size={15} />
      )}} />

      <Drawer.Screen
        name="Stok Rendah"
        component={LowStocksScreen}
        options={{drawerIcon : () => (
          <MaterialCommunityIcons name="package-down" color={'#f82222'}  size={15} />
        )}} />

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
                   }} />

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
    </Stack.Navigator>
  );
}

export default function App() {
  return (

    <NavigationContainer>

      {/* <MyDrawer/> */}
      <MyStack/>

    </NavigationContainer>
    
  )
}

const styles = StyleSheet.create({})
