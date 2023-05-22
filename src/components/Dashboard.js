import { Alert, StyleSheet, Text, View, } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, TouchableRipple } from 'react-native-paper';
import AllProducts from './AllProducts';


const totalProduk = 100.0;
// const productItems = firebase.firestore().collection('products');


export default function Dashboard({navigation}) {
  return (
    <View style={[styles.container]}>
        
      <View style={styles.containerChild}>

            <View style={styles.companyCard}>

                  <View style={styles.companyNameBordered}>
                        <MaterialCommunityIcons name="office-building" color={'#bcbcbc'} size={25} />
                        <Text style={styles.productCardTitle}>Nama Usaha</Text>
                  </View>

                  <View style={styles.companyName}>
                        <MaterialCommunityIcons name="pin" color={'#bcbcbc'} size={25} style={styles.icon} />
                        <Text style={styles.productCardTitle}>Lokasi Usaha</Text>
                  </View>
              </View>
       
            <View style={styles.productCard}>

                <MaterialCommunityIcons name="package" color={'#bcbcbc'} size={30} />
                <Text style={styles.productCardTitle}>Produk Tersimpan</Text>
                <Text style={styles.productTotal}>{totalProduk}</Text>
                
            </View>

            <View style={styles.dashButtonsCard}>

             
                {/* <Button style={styles.dashButtons} onPress={() => Alert.alert('TOTAL MASUK')} title='TOTAL MASUK'>TOTAL MASUK</Button> */}
                <TouchableRipple style={styles.dashButtons} onPress={() => Alert.alert('TOTAL MASUK')} rippleColor="rgba(238, 238, 238, .128)" >
                  <Text>TOTAL MASUK</Text>
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => navigation.navigate('Semua Produk')} rippleColor="rgba(238, 238, 238, .128)" >
                  <Text>TOTAL PRODUK</Text>
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => Alert.alert('TOTAL KELUAR')} rippleColor="rgba(238, 238, 238, .128)" >
                  <Text>TOTAL KELUAR</Text>
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => Alert.alert('STOK RENDAH')} rippleColor="rgba(238, 238, 238, .128)" >
                  <Text>STOK RENDAH</Text>
                </TouchableRipple>

                
             </View>

             <View style={styles.underText}>
                <Button onPress={() => Alert.alert('TRANSAKSI TERAKHIR')}>TANSAKSI TERAKHIR</Button>
                <Button onPress={() => Alert.alert('LIHAT SEMUA REKAM')}>LIHAT SEMUA REKAM{'>>>'}</Button>
             </View>

        </View>

        <ScrollView>
          
        </ScrollView>
     

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        
        flex: 1,
        
      },

      containerChild : {
         flex: 1,
         backgroundColor :'#d0e0e3',
        //  height: "30%",
      },

      productTotal: {
        marginLeft : '30%',
        alignSelf: 'center',
        color :'white',
        fontWeight : '700',
        fontSize : 16,
      },
      productCard: {
        flexDirection: 'row',
        marginBottom: 6,
        backgroundColor: "#5b5b5b",
        padding : 20,
        margin : 20,
        borderRadius : 15,
        marginTop : 3,
        
      },
    
      productCardTitle: {
        fontSize: 16,
        marginTop: 5,
        color :'white',
        marginLeft : 5,
      },
      
      dashButtonsCard : {
        display : 'flex',
        justifyContent : "space-between",
        flexWrap: 'wrap',
        margin : 20,
        height: 150,
        marginTop: 3,
      },

      dashButtons : {
        backgroundColor: '#eeeeee',
        width: "50%",
        height: 75,
        borderRadius : 5,
        borderWidth : 5,
        borderColor: "#d0e0e3",
        alignItems: 'baseline'
      },

      companyCard : {
        flexDirection: 'column',
        marginBottom: 6,
        backgroundColor: "#5b5b5b",
        padding : 20,
        margin : 20,
        borderRadius : 15,
        marginTop: 6,
      },

      companyName : {
        flexDirection: 'row',
        marginTop: 5
      },

      companyNameBordered : {
        flexDirection: 'row',
        borderBottomWidth: 3,
        borderBottomColor: 'white',
        borderStyle: 'dotted',
        
      },

      underText : {
        flexDirection:'row',
        marginTop: -20,
        justifyContent: 'space-between'
      }

})