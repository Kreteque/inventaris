import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import React from 'react'

import { useEffect } from 'react';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter, equalTo } from "firebase/database";
import {db} from '../database/Config';
import { useState } from 'react/cjs/react.development';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid'; 


export default function AllTransaction({navigation}) {

const [prodItems, setProdItems] = useState([]);
const [notNull, setNotNull] = useState(true);
const [searchVal, setSearchVal] = useState("");
const [isEditMode, setIsEditMode] = useState(true); 
const [prevName, setPrevName] = useState([]);
const [transacIn, setTransacIn] = useState("");
const [displayLastTran, setDisplayLastTran] = useState(true);
const [isSearching, setIsSearching] = useState(false);
const [tranOut, setTranOut] = useState("");
const [statusIcon, setStatusIcon] = useState();
const [statusStran, setStatusTran] = useState();
const [statusColor, setStatusColor] = useState();
const [transacOut, setTransacOut] = useState("0");
const [addOrSubb, setAddOrSubb] = useState();
const [isNull, setIsNull] = useState(false);
const [isThere, setIsThere] = useState(true);
const [routeParams, setRouteParams] = useState("");
const [data, setData] = useState([]);
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const dateStamp = new Date();
const month = dateStamp.getMonth() + 1;
const timeStamp = String(dateStamp.getDate() + "/" + "0" + month + "/" + dateStamp.getFullYear());



const readData = () => {
    const starCountRef = query(ref(db, 'products/' ));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setProdItems(data);
    //   console.log(data)
    })
}

const delData = (param) => {
    
    remove(ref(db, 'transactions/' + param));
    alert('removed');
  }

const transacID = () => {
    const trID = timeStamp.replace(/\//g, '') + "-" + String(uuid.v4()).slice(32 );
    return trID;
}
const trUID = transacID();






// const similarityChecker = () => {
//     let dataCheck;
    
    
//         const starCountRef = query(ref(db, 'products/' ));
//         onValue(starCountRef, (snapshot) => {
//           const data = snapshot.val();
//            setData(data);
//         //   console.log(data)
//         });

//         let checkData = Object.values(data);
//         let dataToCheck = checkData.map((item) => {return item.UID});
//         dataToCheck = dataToCheck.filter((item) => {return item.UID == prevName.UID});

//         setIsThere(false);
//         return dataCheck;
// }

useEffect(() => {
    readData();
    // console.log(route);
    // checkStatus();
    if (prodItems ==  null) {
        setIsNull(true);
    } else {
        setIsNull(false)
    } 
}, []);

const createDataOut = () => {
    
        
        
        
        
            set(ref(db, 'transactions/' + trUID ), {    
                
                transacID: trUID,   
                UID: prevName.UID,
                proName: prevName.proName.charAt(0).toUpperCase() + prevName.proName.slice(1),
                qtty:  parseInt(prevName.qtty) - parseInt(transacOut),
                proDesc: prevName.proDesc.charAt(0).toUpperCase() + prevName.proDesc.slice(1),
                // buyRate: parseInt(prevName.buyRate) - parseInt(transacOut),
                timeMark: prevName.timeMark,
                Exp: prevName.Exp,
                subbsQtty: parseInt(transacOut),
                addedQtty: "0",
                transactionTimeMark : timeStamp,
                status : "Keluar",
                icon: "arrow-up-bold-box",
                color: "rgba(135, 4, 4, 0.68)"
              }).then(() => {
                alert("transaksi ditambah");
                // setIsEditMode(true);
                setTransacIn("");
                
                update(ref(db, 'products/' + prevName.UID), {
                    qtty : parseInt(prevName.qtty - parseInt(transacOut))
                });
              })
              
            
}


let prodList = prodItems ? Object.values(prodItems) : [];
prodList = prodList.filter(function(item){
  return item.UID == searchVal 
          | item.proName == searchVal.charAt(0).toUpperCase() + item.proName.slice(1) 
          | item.proDesc == searchVal.charAt(0).toUpperCase() + item.proName.slice(1) 
          | item.qtty == searchVal 
        //   | item.buyRate == searchVal
          | item.Exp == searchVal
          | item.timeMark == searchVal
          | item.updatedTimeMark == searchVal
          | item.transacID == searchVal
})
// .map(function({id, name, city}){
//    return {id, name, city};
// });


const sortedTrList = prodItems ? Object.values(prodItems): [];
const sortedByAz = sortedTrList.sort((a,b) => {
    return b.qtty - a.qtty;
}).filter((item) => {return item.qtty <= 5});



const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
const handleOpenBottomSheet = (param) => {
  
  setIsBottomSheetOpen(true);
  setPrevName(param);
  setRouteParams(prevName.UID);

  if (param.addedQtty !== "0") {
    setAddOrSubb(param.addedQtty);
  } else {
    setAddOrSubb(param.subbsQtty);
  }
};

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
        <View>
            <TextInput 
                outlineColor='rgba(247, 140, 54, 0.93)' 
                activeOutlineColor="rgba(247, 140, 54, 0.93)" 
                mode='outlined' 
                value={searchVal} 
                onChangeText={(searchVal) => {setSearchVal(searchVal); setIsSearching(true)}} 
                placeholder='Cari barang berdasarkan semua properti barang' 
                style={styles.specializedTextBox} onBlur={() => {setIsSearching(true)}}>

            </TextInput>

             { isSearching ? <MaterialCommunityIcons onPress={() => {setIsSearching(false); setSearchVal("")}} color={"red"} name='close' size={30} style={{
                height: 50,
                width: 50,
                // backgroundColor: "green",
                position: "absolute",
                alignSelf: "flex-end",
                marginTop: 20,
                // marginRight: 200,
                
            }}/> : null }
      </View>

      {/* {!!isNull && (<View><Text>No product to display</Text></View>)} */}


      {isSearching ? <ScrollView style={styles.containerChildTwo}>
      { prodList ? prodList.map((item) => {
            const firstLetter = item.proName;
            
            
            return (
                <TouchableOpacity style={styles.productListCard} key={item.UID} onPress={() => {handleOpenBottomSheet(item)}}>

                    <View style={{
                        width: 56,
                        height: "100%",
                        backgroundColor: "rgba(247, 140, 54, 0.93)",
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

                    <Text><Text style={{color : "black"}}>UID:</Text> ({item.UID.toUpperCase()})</Text>
                    <Text><Text style={{color : "black"}}>Tersimpan:</Text> {item.qtty}</Text>
                    
                   
                    </View>


                    

                    
                    
                </TouchableOpacity>
            )
        }) : null}
        
        
        </ScrollView> : <ScrollView style={styles.containerChildTwo}>
      { isNull ? <View style={{
        alignSelf: "center",
        marginTop: 200
      }}>
      <Text style={{
        textAlign: "center",
        fontSize: 90
      }}>🕵️‍♀️</Text>
        <Text style={{fontSize: 30}}>Tidak <Text style={{fontSize: 15}}>ditemukan</Text></Text>
        <Text style={{fontSize: 35}}>apapun?!</Text>
      </View> : sortedByAz.map((item) => {
            const firstLetter = item.proName;
            
            
            return (
                <TouchableOpacity style={styles.productListCard} key={item.UID} onPress={() => {handleOpenBottomSheet(item)}}>

                    <View style={{
                        width: 56,
                        height: "100%",
                        backgroundColor: "rgba(247, 140, 54, 0.93)",
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

                    <Text><Text style={{color : "black"}}>UID:</Text> ({item.UID.toUpperCase()})</Text>

                    <View style={{
                        flexDirection : "row",
                    }}>
                    
                    {/* <Text style={{color : "grey"}}><Text style={{color : "black"}}>UID:</Text> ({item.UID.toUpperCase()})</Text> */}
                                <Text style={{color : "grey"}}><Text style={{color : "black"}}>Tersimpan: </Text>{item.qtty}</Text>
                    </View>

                    <View style={{
                        width: 80,
                        height: 50,
                        backgroundColor: "rgba(247, 140, 54, 0.29)",
                        position: "absolute",
                        alignSelf: "flex-end",
                        justifyContent: "center"
                        // alignContent: "center"
                        // marginLeft: 100
                    }}>

                    <Text style={{
                        color: "white",
                        alignSelf: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        fontStyle: "italic"
                        // marginTop: 15
                    }}>Rendah</Text>

                    </View>
                    
                   
                    </View>

                    
                    
                </TouchableOpacity>

                
            )

          
        }) }
        
        
                
        </ScrollView> }

        
        
        {isEditMode ? <Modal
            animationType="slide"
            transparent={true}
            // We use the state here to toggle visibility of Bottom Sheet 
            visible={isBottomSheetOpen}
            // We pass our function as default function to close the Modal
            onRequestClose={handleCloseBottomSheet} >
            
                <View style={[styles.bottomSheet, { height: windowHeight * 0.6 }]}>
                    {/* //  First Section of Bottom sheet with Header and close button */}

                    <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <SubText text={"Detail Transaksi " + prevName.status} family={'Poppins-med'} size={16} color={prevName.color} />
                        <TouchableOpacity onPress={() => {handleCloseBottomSheet()}}>
                        <MaterialCommunityIcons color={"grey"} name='close' size={28}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                
                
                    <View style={{ paddingVertical: 16 }}>
                            <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} />
                            <SubText text={prevName.proDesc} family={'Poppins'} color={'#86827e'} size={15} />
                            
                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.transacID} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (TrID)</Text>
                            </View>

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={addOrSubb} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> <MaterialCommunityIcons color={prevName.color} size={20} name={prevName.icon}/> {prevName.status}</Text>
                            </View>

                            {/* <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.buyRate)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text color={'#86827e'} size={14} family={'Poppins-med'}> (harga beli)</Text>
                            </View> */}

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.admin)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (admin)</Text>
                            </View>

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.transactionTimeMark} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (tgl transaksi)   ||   </Text>  
                                {/* <SubText text={prevName.Exp} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (EXP)</Text> */}
                            </View>
                    </View>
                        
                            <View style={{
                                // flex: 1,
                                alignSelf:"flex-end",
                                // justifyContent: "space-between",
                                width: Dimensions.get("screen").width - 150 ,
                                // height: 150,
                                // backgroundColor: "grey",
                                flexDirection: "row",
                                position:"absolute",
                                marginTop: windowHeight - 380,
                                // paddingRight: 15,
                                
                                }} >

                                {/* <TouchableOpacity onPress={() => {
                                    Alert.alert("Transaksi " + prevName.proName + " akan dihapus!", 'Data akan hilang selamanya!', [
                                            {
                                                text: 'Batal',
                                                
                                                style: 'cancel',
                                            },
                                            {text: 'Hapus', onPress: () => {delData(prevName.transacID.toLowerCase()); handleCloseBottomSheet();}},
                                            ]);
                                }} style={{
                                    // backgroundColor:"brown",
                                    // width: 100,
                                    height: 50,
                                    alignSelf: "flex-end",
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems : "center"
                                    // position: "absolute"
                                }}>
                                <MaterialCommunityIcons name='delete-restore' color={"rgba(218, 26, 11, 0.8)"} size={40}/>
                                <Text style={{
                                    fontWeight: "bold",
                                    color: "rgba(218, 26, 11, 0.8)"
                                }}>Hapus Transaksi</Text>

                                </TouchableOpacity>  */}

                                <TouchableOpacity onPress={() => {
                                        navigation.navigate("Tambah Transaksi", {
                                            id : prevName.UID
                                        }
                                        );
                                        handleCloseBottomSheet();
                                        // setIsEditMode(false);
                                        }} 
                                    style={{
                                    // backgroundColor:"brown",
                                    width: 100,
                                    height: 50,
                                    alignSelf: "flex-end",
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems : "center"
                                    // position: "absolute"
                                }}>
                                <MaterialCommunityIcons name='book-plus-multiple' color={"rgba(4, 112, 4, 0.77)"} size={40}/>
                                <Text style={{
                                    fontWeight: "bold",
                                    color: "rgba(4, 112, 4, 0.77)"
                                }}>Tambah Transaksi</Text>

                                </TouchableOpacity> 
                                
                                 {/* <TouchableOpacity onPress={() => {setIsEditMode(false)}} style={{
                                    // backgroundColor:"brown",
                                    width: 100,
                                    height: 50,
                                    alignSelf: "flex-end",
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems : "center"
                                    // position: "absolute"
                                }}>
                                <MaterialCommunityIcons name='archive-arrow-down' color={"rgba(4, 112, 4, 0.77)"} size={40}/>
                                <Text style={{
                                    fontWeight: "bold",
                                    color: "rgba(4, 112, 4, 0.77)"
                                }}>Masuk</Text>

                                </TouchableOpacity> 

                                <TouchableOpacity style={{
                                    // backgroundColor:"green",
                                    width: 160,
                                    height: 50,
                                    alignSelf: "flex-end",
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems : "center",
                                    flexDirection: "row",
                                    // position: "absolute"
                                }}>
                                <MaterialCommunityIcons onPress={() => {
                                    setTranOut("lol");
                                }} name='archive-arrow-up' color={"rgba(218, 26, 11, 0.8)"} size={40}/>
                                <Text style={{
                                    fontWeight: "bold",
                                    color : "rgba(218, 26, 11, 0.8)"
                                }}>Keluar</Text>

                                </TouchableOpacity> */}
                            </View>
                    </View>
       
                

        </Modal>:
        {/* <Modal
            animationType="fade"
            transparent={true}
            
            visible={isBottomSheetOpen}
            
            onRequestClose={handleCloseBottomSheet} >
            
                <View style={[styles.bottomSheet, { height: windowHeight * 0.7 }]}>
                    

                    <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{fontWeight:"bold", fontSize:20, color:"rgba(rgba(4, 112, 4, 0.77)"}}>Transaksi Masuk</Text>
                        <TouchableOpacity onPress={() => {handleCloseBottomSheet(); setIsEditMode(true); setTransacIn("")}}>
                        <MaterialCommunityIcons color={"grey"} name='close' size={28}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                
                
                    <View style={{ paddingVertical: 16 }}>
                            <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} />
                            <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} />
                            <SubText text={prevName.proDesc} family={'Poppins'} color={'#86827e'} size={15} />
                            
                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.UID} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text color={'#86827e'} size={14} family={'Poppins-med'}> (UID)</Text>
                            </View>

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <TextInput 
                                    value={transacIn}
                                    placeholder={String(prevName.qtty)}
                                    onChangeText={(transacIn) => {setTransacIn(transacIn)}}
                                    keyboardType='numeric'
                                    maxLength={9007199254740991}
                                    
                                ></TextInput>
                                <Text color={'#86827e'} size={14} family={'Poppins-med'}> (jumlah stok masuk)</Text>
                            </View>
                    </View>
                        
                            <View style={{
                                
                                alignSelf:"flex-end",
                                justifyContent:"center",
                                width: 150,
                                height: 150,
                                
                                flexDirection: "row",
                                position:"absolute",
                                marginTop: windowHeight - 400
                                }} >
                                
                                <TouchableOpacity>

                                    <MaterialCommunityIcons name='cancel' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90
                                    }} size={40} color={"rgba(218, 26, 11, 0.8)"} onPress={() => {
                                        setIsEditMode(true);
                                        handleCloseBottomSheet();
                                        setTransacIn("");
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
                                    <MaterialCommunityIcons name='archive-arrow-down' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(4, 112, 4, 0.77)"} onPress={() => {setIsEditMode(true); createData(); handleCloseBottomSheet()}}></MaterialCommunityIcons>
                                </TouchableOpacity>
                            </View>
                    </View>
       
                

        </Modal> */}
        }

        {!!tranOut && <Modal
            animationType="fade"
            transparent={true}
            // We use the state here to toggle visibility of Bottom Sheet 
            visible={isBottomSheetOpen}
            // We pass our function as default function to close the Modal
            onRequestClose={handleCloseBottomSheet} >
            
                <View style={[styles.bottomSheet, { height: windowHeight * 0.7 }]}>
                    {/* //  First Section of Bottom sheet with Header and close button */}

                    <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{fontWeight:"bold", fontSize:20, color:"rgba(136, 8, 4, 0.68)"}}>Transaksi Keluar</Text>
                        <TouchableOpacity onPress={() => {handleCloseBottomSheet(); setIsEditMode(true); setTranOut(""); setTransacOut(""); }}>
                        <MaterialCommunityIcons color={"grey"} name='close' size={28}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                
                
                    <View style={{ paddingVertical: 16 }}>
                            {/* <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} /> */}
                            <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} />
                            <SubText text={prevName.proDesc} family={'Poppins'} color={'#86827e'} size={15} />
                            
                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.UID} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text color={'#86827e'} size={14} family={'Poppins-med'}> (UID)</Text>
                            </View>

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <TextInput 
                                    value={transacOut}
                                    // placeholder={String(prevName.qtty)}
                                    onChangeText={(transacOut) => {setTransacOut(transacOut)}}
                                    keyboardType='numeric'
                                    maxLength={9007199254740991}
                                    
                                ></TextInput>
                                <Text color={'rgba(136, 8, 4, 0.68)'} size={14} family={'Poppins-med'}> (jumlah stok keluar)</Text>
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
                                position:"absolute",
                                marginTop: windowHeight - 400
                                }} >
                                
                                <TouchableOpacity>

                                    <MaterialCommunityIcons name='cancel' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90
                                    }} size={40} color={"rgba(218, 26, 11, 0.8)"} onPress={() => {
                                        setIsEditMode(true);
                                        handleCloseBottomSheet();
                                        setTranOut("");
                                        setTransacOut("");
                                    }}></MaterialCommunityIcons>

                                </TouchableOpacity>
                                

                                {/* <TouchableOpacity>
                                    <MaterialCommunityIcons name='plus-circle' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(9, 130, 200, 0.8)"} onPress={() => {alert("Mari Menyerah!")}}></MaterialCommunityIcons>
                                </TouchableOpacity> */}

                                <TouchableOpacity>
                                    <MaterialCommunityIcons name='archive-arrow-up' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(136, 8, 4, 0.68)"} onPress={() => {setIsEditMode(true); createDataOut(); handleCloseBottomSheet(); setTranOut("")}}></MaterialCommunityIcons>
                                </TouchableOpacity>
                            </View>
                    </View>
       
                

        </Modal>}
        
        <View style={{
            // width: 150,
            height: 50,
            // backgroundColor: "grey",
            position: "absolute",
            alignSelf: "flex-end",
            marginTop: windowHeight - 150,
            justifyContent: "flex-end",
            paddingRight: 25
        }}>
            

            <TouchableOpacity onPress={() => {navigation.navigate("Scan Barcode")}} style={{
                backgroundColor: "rgba(151, 214, 250, 0.5)",
                flexDirection: "row",
                alignSelf: "flex-end",
                width: 80,
                height: 80,
                justifyContent: "center",
                // borderRadius: 50,
                alignItems: "center",
                borderTopStartRadius: 50,
                borderBottomEndRadius: 50
                
                }}>
                <MaterialCommunityIcons 
                    name="barcode-scan"
                    size={40}
                    color={"white"}
                    style={{
                        backgroundColor: "rgba(0, 120, 120, 0.5)",
                        height: 60,
                        width: 60,
                        padding: 10,
                        borderRadius: 50
                    }}
                    />
                
                
            </TouchableOpacity>

            

        </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container : {
      flex : 1,
      display : 'flex',
      flexDirection: 'column',
      backgroundColor: "white"
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
      width: Dimensions.get("screen").width,
      flex:1
      
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
   
})