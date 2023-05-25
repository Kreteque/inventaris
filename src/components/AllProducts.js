import { Alert, StyleSheet, Text, View, Button, TouchableOpacity, Modal, Dimensions } from 'react-native'
import { useState } from 'react/cjs/react.development';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import {db} from '../database/Config';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot } from "firebase/database";
import { useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonGroup } from '@rneui/base';





export default function AllProducts({navigation, props}) {


    const [prodItems, setProdItems] = useState([]);
    const [notNull, setNotNull] = useState(false);
    let totalQtty = [];
    let totalBuyRate = [];
    // let totalProducts = [];
    
const getData = () => {
    const starCountRef = ref(db, 'products/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
        if (data === null) {
            setProdItems("");
            setNotNull(false);
        } else {
            setProdItems(data);
            setNotNull(true);
        }
    });

}

const delData = (param) => {
    
    remove(ref(db, 'products/' + param));
    alert('removed');
  }



useEffect(() => {
    getData();
    
}, [])

    notNull ? //  const obj = JSON.parse(prodItems);
    Object.values(prodItems).map((item) => {
        totalQtty.push(item.qtty);
        totalBuyRate.push(item.buyRate);
        // totalProducts.push(item.UID);
    }) : totalQtty.push(0) ;
   

// We need to get the height of the phone and use it relatively, 
// This is because height of phones vary
const windowHeight = Dimensions.get('window').height;

// This state would determine if the drawer sheet is visible or not
const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
const [prevName, setPrevName] = useState([]);

// Function to open the bottom sheet 
const handleOpenBottomSheet = (param) => {
  setIsBottomSheetOpen(true);
  setPrevName(param);
};

// Function to close the bottom sheet
const handleCloseBottomSheet = () => {
  setIsBottomSheetOpen(false);
};

const SubText = ({ borderWidth, borderColor, text, size, color, family, letterSpacing, align = 'left', leading }) => {
    return (
        <Text 
          style={{ 
              fontSize: size, 
              color: color, 
              fontFamily: family, 
              letterSpacing: letterSpacing ? letterSpacing : -0.02, 
              textAlign: align, 
              lineHeight: leading, 
              borderWidth: borderWidth, 
              borderColor: borderColor }}>
                
              {text}
          
          </Text>
    )
}
    
  return (

    <View style={styles.container}>

        <View style={styles.containerChild}>

            <View style={styles.infoCard}>

            <View>
            <Text style={styles.infoCardText}>
                    Total Kuantitas 
                </Text>

                <Text style={styles.infoCardText}>
                    Total Harga beli 
                </Text>

                <Text style={styles.infoCardText}>
                    Total Jumlah Barang 
                </Text>
            </View>

            <View>
                    <Text style={styles.totalText}> : {totalQtty.reduce((a, b) => {
                        return a + b;
                    }, 0)}
                    </Text>

                    <Text style={styles.totalText}> : Rp. {totalBuyRate.reduce((a, b) => {
                        return a + b;
                    }, 0)}
                    </Text>

                    <Text style={styles.totalText}> : {Object.keys(prodItems).length}
                    </Text>
            </View>

            </View>

        </View>
        
        <ScrollView style={styles.containerChildTwo}>

        {notNull ? Object.values(prodItems).map((item) => {
            const firstLetter = item.proName;
            
            return (
                <TouchableOpacity style={styles.productListCard} key={item.UID} onPress={() => {handleOpenBottomSheet(item)}}>

                    <View style={{
                        width: 56,
                        height: "100%",
                        backgroundColor: "rgba(78, 116, 289, 1)",
                        marginRight: 10,
                        borderRadius: 50
                    }}>
                        <Text style={{
                            alignSelf: 'center',
                            margin: 15,
                            fontSize: 22,
                            fontWeight: "bold",
                            color: "white"
                        }}>{firstLetter.charAt(0).toUpperCase()}</Text>
                    </View>
                    
                    <View>
                    <Text style={{
                        fontSize: 19,
                        color: "black",
                        fontWeight: "bold",
                        
                    }}>{item.proName.charAt(0).toUpperCase() + item.proName.slice(1)}
                    
                    </Text>

                    <Text><Text style={{color : "black"}}>UID:</Text> ({item.UID})</Text>
                    <Text><Text style={{color : "black"}}>Masuk: </Text>{item.qtty}</Text>
                    
                   
                    </View>

                    
                    
                </TouchableOpacity>
            )
        }) : <Text style={{
            fontSize: 30,
            margin: 10,
            padding: 10,
            color: "rgba(235, 67, 9, 0.8)"
            }}><Text style={{
                color: "rgba(222, 98, 20, 0.8)",
                fontSize: 45,
            }}>Oops!🙊</Text> Tidak ada data! <Text style={{
                fontSize: 45,
                color: "rgba(78, 116, 289, 0.8)"
            }}>Silakan</Text> <Text style={{
                color: "rgba(78, 116, 289, 1)"
            }}>masukan dahulu! 🤨🙏 </Text></Text>}
        
            

        </ScrollView>

        <Button title='Masukan Produk' color={'rgba(78, 116, 289, 1)'} onPress={() => navigation.navigate('Tambah Produk')}/>

        <Modal
            animationType="slide"
            transparent={true}
            // We use the state here to toggle visibility of Bottom Sheet 
            visible={isBottomSheetOpen}
            // We pass our function as default function to close the Modal
            onRequestClose={handleCloseBottomSheet} >
            
                <View style={[styles.bottomSheet, { height: windowHeight * 0.6 }]}>
                    {/* //  First Section of Bottom sheet with Header and close button */}

                        <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                            <SubText text={'Detail Barang'} family={'Poppins-med'} size={16} color={'#86827e'} />
                            <TouchableOpacity onPress={handleCloseBottomSheet}>
                            <MaterialCommunityIcons name='close' size={20}></MaterialCommunityIcons>
                            </TouchableOpacity>
                        </View>
                
                
                    <View style={{ paddingVertical: 16 }}>
                        <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} />
                        <SubText text={"Deskripsi: " + prevName.proDesc} family={'Poppins'} color={'#86827e'} size={15} />
                        
                        <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                        <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                            <SubText text={prevName.UID} color={'#292929'} family={'PoppinsSBold'} size={20} />
                            <SubText text={' (UID)'} color={'#86827e'} size={14} family={'Poppins-med'} />
                        </View>

                        <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                        <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                            <SubText text={prevName.qtty} color={'#292929'} family={'PoppinsSBold'} size={20} />
                            <SubText text={' (tersimpan)'} color={'#86827e'} size={14} family={'Poppins-med'} />
                        </View>

                        <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                        <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                            <SubText text={prevName.buyRate} color={'#292929'} family={'PoppinsSBold'} size={20} />
                            <SubText text={' (harga beli)'} color={'#86827e'} size={14} family={'Poppins-med'} />
                        </View>

                    
                
                        
                    </View>
                            <View style={{
                                // flex: 1,
                                alignSelf:"flex-end",
                                justifyContent:"center",
                                width: 150,
                                height: 150,
                                // backgroundColor: "grey",
                                flexDirection: "row",
                                // position:"relative"
                                }} >
                                
                                <TouchableOpacity>

                                    <MaterialCommunityIcons name='delete-circle' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90
                                    }} size={40} color={"rgba(218, 26, 11, 0.8)"} onPress={() => {
                                        alert("Anda yakin?");
                                        delData(prevName.UID.toLowerCase()); 
                                        handleCloseBottomSheet()
                                    }}></MaterialCommunityIcons>

                                </TouchableOpacity>
                                

                                <TouchableOpacity>
                                    <MaterialCommunityIcons name='plus-circle' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(9, 130, 200, 0.8)"} onPress={() => {alert("Mari Menyerah!")}}></MaterialCommunityIcons>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <MaterialCommunityIcons name='circle-edit-outline' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(9, 200, 91, 0.8)"}></MaterialCommunityIcons>
                                </TouchableOpacity>
                            </View>
                    </View>
       
                

        </Modal>
       
      
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
        height : "75%",
        width: "90%"
     },

     productListCard : {
        flexDirection: 'row',
        backgroundColor: "white",
        padding : 20,
        borderBottomColor: "rgba(44, 98, 169, 0.8)",
        borderBottomWidth: 1,
        height: 100,
     },
     buttonStyle : {
        borderRadius: 100,
        width: 50,
        margin: 20,
        alignSelf: 'center',
        // backgroundColor: 'white',
     },
     infoCardText : {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
        width: "100%"
     },
     totalText : {
        fontWeight: "bold",
        color: "rgba(78, 116, 289, 1)",
        fontSize: 16,
     },
     containerBotDraw: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 23,
        paddingHorizontal: 25,
        bottom: 0,
        borderWidth: 1.5,
        borderColor: 'rgba(9, 130, 200, 0.8)',
        
    },
     
})