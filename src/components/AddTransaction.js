import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import React from 'react'
// import { TextInput } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter, equalTo, get } from "firebase/database";
import {db} from '../database/Config';
import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid'; 

export default function AddTransaction({navigation, route}) {

const [prodItems, setProdItems] = useState([]);
const [notNull, setNotNull] = useState(true);
const [searchVal, setSearchVal] = useState("");
const [isEditMode, setIsEditMode] = useState(true); 
const [prevName, setPrevName] = useState([]);
const [transacIn, setTransacIn] = useState("");
const [displayLastTran, setDisplayLastTran] = useState(true);
const [tranOut, setTranOut] = useState("");
const [tranRet, setTranRet] = useState("");
const [transacOut, setTransacOut] = useState("0");
const [transacRet, setTransacRet] = useState("0");
const [disableTexIn, setDisableTexIn] = useState("0");
const [trData, setTrData] = useState([]);
const [admin, setAdmin] = useState("");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const dateStamp = new Date();
const month = dateStamp.getMonth() + 1;
const timeStamp = String(dateStamp.getDate() + "/" + month + "/" + dateStamp.getFullYear());

useEffect(() => {
    readData();
    getTrData();
    // console.log(route.params);
    if (route.params.id == undefined) {
        setSearchVal("");
        
    } else {
        setSearchVal(route.params.id);
    }
}, []);


const readData = () => {
    const starCountRef = query(ref(db, 'products'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setProdItems(data);
    });

    
}

const getTrData = () => {
    const starCountRef = query(ref(db, 'transactions'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setTrData(data);
      
    })
  }

  let totalOUT = trData ? Object.values(trData) : [];
  totalOUT = totalOUT.filter((item) => {return item.status === "Keluar"});

  console.log(totalOUT);
// const readTrData = () => {
//     const prodCount = get(ref(db, 'transactions'));
//         onValue(prodCount, (snapshot) => {
//         const data = snapshot.val();
//         setProdTran(data);
//         });
// }


const transacID = () => {
    const trID = timeStamp.replace(/\//g, '') + "-" + String(uuid.v4()).slice(32 );
    return trID;
}
const trUID = transacID();

const createData = () => {
    
    // const newKey = push(child(ref(database), 'users')).key;

   
      if (parseInt(transacIn) > 0 && admin !== "") {
        set(ref(db, 'transactions/' + String(trUID) ), {       
            transacID: String(trUID),   
            UID: prevName.UID,
            proName: prevName.proName.charAt(0).toUpperCase() + prevName.proName.slice(1),
            qtty:  parseInt(prevName.qtty) + parseInt(transacIn),
            proDesc: prevName.proDesc.charAt(0).toUpperCase() + prevName.proDesc.slice(1),
            // buyRate: parseInt(prevName.buyRate) * parseInt(transacIn),
            timeMark: prevName.timeMark,
            Exp: prevName.Exp,
            
            trQtty: parseInt(transacIn),
            addedQtty : parseInt(transacIn),
            transactionTimeMark : timeStamp,
            status: "Masuk",
            icon: "arrow-bottom-left-thick",
            color: "rgba(4, 135, 46, 0.68)",
            admin: admin
          }).then(() => {
            alert("transaksi ditambah");
            // setIsEditMode(true);
            setTransacIn("");
            // setSearchVal("");
            setTranRet('');
    
            update(ref(db, 'products/' + prevName.UID), {
                qtty : parseInt(prevName.qtty + parseInt(transacIn))
            });
          })
      } else {
        alert("Tidak dapat menambahkan barang kurang dari 1!");
        setTranRet('');
      }
    

    
      
}

const createDataOut = () => {
    
        
       if (parseInt(transacOut) > 0 && parseInt(transacOut) < prevName.qtty && admin !== "" ) {
        set(ref(db, 'transactions/' + trUID ), {    
        
            transacID: trUID,   
            UID: prevName.UID,
            proName: prevName.proName.charAt(0).toUpperCase() + prevName.proName.slice(1),
            qtty:  parseInt(prevName.qtty) - parseInt(transacOut),
            proDesc: prevName.proDesc.charAt(0).toUpperCase() + prevName.proDesc.slice(1),
            // buyRate: parseInt(prevName.buyRate) - parseInt(transacOut),
            timeMark: prevName.timeMark,
            Exp: prevName.Exp,
            trQtty: parseInt(transacOut),
            subbsQtty: parseInt(transacOut),
            transactionTimeMark : timeStamp,
            status : "Keluar",
            icon: "arrow-top-right-thick",
            color: "rgba(135, 4, 4, 0.68)",
            admin: admin
          }).then(() => {
            alert("transaksi ditambah");
            // setIsEditMode(true);
            setTransacOut("");
            
            update(ref(db, 'products/' + prevName.UID), {
                qtty : parseInt(prevName.qtty - parseInt(transacOut))
            });
          })
       } else {
        alert("Jumlah transaksi keluar tidak valid!");
        setTransacOut("");
       }
        
        
    
}

// console.log(Object.values(prodTran).filter((item) => {return item.UID === prevName.UID}));
// console.log(searchVal)

// const searchTransacOut = Object.values(prodTran);
// const takeTheSubbs = searchTransacOut.filter((item) => {return item.subbsQtty !== undefined});
const extractedArr = totalOUT.map((item) => {return item.subbsQtty});

const prodOutVal = extractedArr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  console.log(prodOutVal);
const createDataRet = () => {

    const extractedArr = totalOUT.map((item) => {return item.subbsQtty});

    const prodOutVal = extractedArr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
    
      console.log(prodOutVal);

            // console.log(prodOutVal)


// //     const searchTransacOut = Object.values(prodTran);
// //     const takeTheSubbs = searchTransacOut.filter((item) => {return item.subbsQtty !== undefined});
// //     const extractedArr = takeTheSubbs.map((item) => {return item.subbsQtty});

// //     const prodOutVal = extractedArr.reduce(
// //     (accumulator, currentValue) => accumulator + currentValue,
// //     0
// //   );

       
        
//         // console.log(prevName);
//         // searchTransacOut = searchTransacOut.filter((item) => {return item.status === "Keluar"});
//         // let totalQttyOut =searchTransacOut.map((item) => {return parseInt(item.subbsQtty)});
//         // console.log(searchTransacOut.map((item) => {return item.subbsQtty}));
        
        if (parseInt(transacRet) < prodOutVal ){
            // console.log(searchTransacOut.map((item) => {return parseInt(item.subbsQtty)}))
            if (parseInt(transacRet) < 0) {
                setTransacRet(NaN);
                alert("Jumlah transaksi retur harus lebih dari 0 dan jumlah transaksi keluar!");
            } else{
                set(ref(db, 'transactions/' + trUID ), {    
        
                    transacID: trUID,   
                    UID: prevName.UID,
                    proName: prevName.proName.charAt(0).toUpperCase() + prevName.proName.slice(1),
                    qtty:  0,
                    proDesc: prevName.proDesc.charAt(0).toUpperCase() + prevName.proDesc.slice(1),
                    // buyRate: parseInt(prevName.buyRate) - parseInt(transacOut),
                    timeMark: prevName.timeMark,
                    Exp: prevName.Exp,
                    
                    
                    trQtty: parseInt(transacRet),
                    qttyOnhold :parseInt(transacRet),
                    transactionTimeMark : timeStamp,
                    status : "Retur",
                    icon: "arrow-u-right-bottom-bold",
                    color: "rgba(243, 134, 0, 0.7)",
                    admin: admin
                  }).then(() => {
                    alert("transaksi ditambah");
                    // setIsEditMode(true);
                    setTransacRet("");
                    
                    // update(ref(db, 'products/' + prevName.UID), {
                    //     qtty : parseInt(prevName.qtty - parseInt(transacOut))
                    // });
                  })
            }
            
            
        } 
        else {
            alert("Jumlah transaksi retur harus lebih dari 0 dan jumlah transaksi keluar!");
            // console.log();
        } 
        
    
}

let prodList = prodItems ?  Object.values(prodItems) : [];
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





const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
const handleOpenBottomSheet = (param) => {
  
  setIsBottomSheetOpen(true);
  setPrevName(param);
  if (param.qtty > 0) {
    setDisableTexIn(false);
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
      <TextInput 
          outlineColor='rgba(17, 2, 158, 0.25)' 
          activeOutlineColor="rgba(17, 2, 158, 0.25)" 
          mode='outlined' 
          value={searchVal} 
          onChangeText={
            (searchVal) => {
                setSearchVal(searchVal); 
                setDisplayLastTran(false);
                }
            }
            onEndEditing={() => {
                if (searchVal !== "")
                {
                    setDisplayLastTran(false);
                } else {
                    setDisplayLastTran(true);
                }
                }
            }
            // onBlur={() => {setSearchVal(""); prodList = []}}
          placeholder='Cari barang berdasarkan semua properti barang' 
          style={styles.specializedTextBox}>

      </TextInput>

      {/* <View>
        {searchById}
      </View> */}


      <ScrollView style={styles.containerChildTwo}>
      { prodList ? prodList.map((item) => {
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

                    <Text style={{color : "grey"}}><Text style={{color : "black"}}>UID:</Text> ({item.UID.toUpperCase()})</Text>
                    <Text style={{color : "grey"}}><Text style={{color : "black"}}>Tersimpan: </Text>{item.qtty}</Text>
                    
                   
                    </View>

                    
                    
                </TouchableOpacity>
            )
        }) : null }
        
        
        </ScrollView>

        <TouchableOpacity onPress={() => {navigation.navigate("Scan Barcode")}} style={{
            // flex :1,
            backgroundColor: "rgba(22, 125, 203, 0.9)",
            width: 70,
            height: 70,
            position: "absolute",
            // alignSelf: "flex-end",
            marginTop: windowHeight -170,
            margin: 20
            
        }}>
            <MaterialCommunityIcons name='barcode-scan' size={45} style={{
                alignSelf:"center",
                margin: 10
                }}/>
        </TouchableOpacity>
                
        
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
                        <SubText text={"Detail Barang"} family={'Poppins-med'} size={16} color={'#86827e'} />
                        <TouchableOpacity onPress={() => {handleCloseBottomSheet()}}>
                        <MaterialCommunityIcons color={"grey"} name='close' size={28}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                
                
                    <View style={{ paddingVertical: 16 }}>
                            <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} />
                            <SubText text={prevName.proDesc} family={'Poppins'} color={'#86827e'} size={15} />
                            
                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.UID} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (UID)</Text>
                            </View>

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.qtty)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (tersimpan)</Text>
                            </View>

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            {/* <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.buyRate)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (harga beli)</Text>
                            </View> */}

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.admin)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (Admin)</Text>
                            </View>

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.timeMark} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (tgl masuk)   ||   </Text>  
                                <SubText text={prevName.Exp} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text  style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (EXP)</Text>
                            </View>
                    </View>
                        
                            <View style={{
                                // flex: 1,
                                alignSelf:"flex-end",
                                // justifyContent: "space-between",
                                width: Dimensions.get("screen").width - 50,
                                // height: 150,
                                // backgroundColor: "grey",
                                flexDirection: "row",
                                position:"absolute",
                                marginTop: windowHeight - 380,
                                // paddingRight: 15,
                                
                                }} >

                                <TouchableOpacity onPress={() => {setTranRet("lol")}} style={{
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
                                <MaterialCommunityIcons name='arrow-u-down-left-bold' color={"rgba(243, 134, 0, 0.7)"} size={40}/>
                                <Text style={{
                                    fontWeight: "bold",
                                    color: "rgba(243, 134, 0, 0.7)"
                                }}>Retur</Text>

                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={() => {setIsEditMode(false)}} style={{
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

                                </TouchableOpacity>
                            </View>
                    </View>
       
                

        </Modal>: <Modal
            animationType="fade"
            transparent={true}
            // We use the state here to toggle visibility of Bottom Sheet 
            visible={isBottomSheetOpen}
            // We pass our function as default function to close the Modal
            onRequestClose={handleCloseBottomSheet} >
            
                <View style={[styles.bottomSheet, { height: windowHeight * 0.7 }]}>
                    {/* //  First Section of Bottom sheet with Header and close button */}

                    <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{fontWeight:"bold", fontSize:20, color:"rgba(rgba(4, 112, 4, 0.77)"}}>Transaksi Masuk</Text>
                        <TouchableOpacity onPress={() => {handleCloseBottomSheet(); setIsEditMode(true)}}>
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
                                    value={transacIn}
                                    // placeholder={String(prevName.qtty)}
                                    onChangeText={(transacIn) => {setTransacIn(transacIn)}}
                                    keyboardType='numeric'
                                    maxLength={9007199254740991}
                                    
                                ></TextInput>
                                <Text style={{color : "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (tambahkan jumlah stok)</Text>
                            </View>

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <TextInput 
                                    value={admin}
                                    // placeholder={String(prevName.qtty)}
                                    onChangeText={(admin) => {setAdmin(admin)}}
                                    // keyboardType='numeric'
                                    maxLength={26}
                                ></TextInput>
                                <Text style={{color : "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (admin pencatat)</Text>
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
                                        handleCloseBottomSheet()
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
                                    <MaterialCommunityIcons name='archive-arrow-down' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(4, 112, 4, 0.77)"} onPress={() => {

                                    if(admin === ""){
                                        alert("Silakan lengkapi formulir")
                                    } else {
                                    setIsEditMode(true); 
                                    createData(); 
                                    handleCloseBottomSheet()
                                    }

                                    }}></MaterialCommunityIcons>
                                </TouchableOpacity>
                            </View>
                    </View>
       
                

        </Modal>}

        {!!tranOut && <Modal
            animationType="fade"
            transparent={true}
            
            visible={isBottomSheetOpen}
            
            onRequestClose={handleCloseBottomSheet} >
            
                <View style={[styles.bottomSheet, { height: windowHeight * 0.7 }]}>

                    <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{fontWeight:"bold", fontSize:20, color:"rgba(136, 8, 4, 0.68)"}}>Transaksi Keluar</Text>
                        <TouchableOpacity onPress={() => {handleCloseBottomSheet(); setIsEditMode(true); setTranOut(""); setTransacOut(""); }}>
                        <MaterialCommunityIcons color={"grey"} name='close' size={28}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                
                
                    <View style={{ paddingVertical: 16 }}>
                            <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} />
                            <SubText text={prevName.proDesc} family={'Poppins'} color={'#86827e'} size={15} />
                            
                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.UID} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text color={'#86827e'} size={14} family={'Poppins-med'}> (UID)</Text>
                            </View>

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                { disableTexIn ? <Text style={{color:"red"}}>Masukan barang terlebih dahulu!</Text> : <TextInput 
                                    value={transacOut}
                                    // placeholder={String(prevName.qtty)}
                                    onChangeText={(transacOut) => {setTransacOut(transacOut)}}
                                    keyboardType='numeric'
                                    maxLength={9007199254740991}
                                    
                                ></TextInput>}
                                { disableTexIn? null : <Text style={{color : "grey"}} color={'rgba(136, 8, 4, 0.68)'} size={14} family={'Poppins-med'}> (jumlah stok keluar)</Text>}
                            </View>

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                { disableTexIn ? <Text style={{color:"rgba(203, 114, 4, 0.69)"}}>Silakan kembali lalu pilih opsi "Masuk"</Text> : <TextInput 
                                    value={admin}
                                    // placeholder={String(prevName.qtty)}
                                    onChangeText={(admin) => {setAdmin(admin)}}
                                    // keyboardType='numeric'
                                    maxLength={26}
                                    
                                ></TextInput>}
                                { disableTexIn? null : <Text style={{color : "grey"}} color={'rgba(136, 8, 4, 0.68)'} size={14} family={'Poppins-med'}> (admin pencatat)</Text>}
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
                                    }} size={40} color={"rgba(136, 8, 4, 0.68)"} onPress={() => {

                                        if(admin === ""){
                                            alert("Silakan lengkapi formulir!")
                                        } else {
                                            setIsEditMode(true); 
                                            createDataOut(); 
                                            handleCloseBottomSheet(); 
                                            setTranOut("")
                                        }
                                        
                                        }}></MaterialCommunityIcons>
                                </TouchableOpacity>
                            </View>
                    </View>
       
                

        </Modal>}

        {!!tranRet && <Modal
            animationType="fade"
            transparent={true}
            
            visible={isBottomSheetOpen}
            
            onRequestClose={handleCloseBottomSheet} >
            
                <View style={[styles.bottomSheet, { height: windowHeight * 0.7 }]}>

                    <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{fontWeight:"bold", fontSize:20, color:"rgba(243, 134, 0, 0.7)"}}>Transaksi Retur</Text>
                        <TouchableOpacity onPress={() => {handleCloseBottomSheet(); setIsEditMode(true); setTranRet(""); setTransacRet(""); }}>
                        <MaterialCommunityIcons color={"grey"} name='close' size={28}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                
                
                    <View style={{ paddingVertical: 16 }}>
                            <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} />
                            <SubText text={prevName.proDesc} family={'Poppins'} color={'#86827e'} size={15} />
                            
                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.UID} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text color={'#86827e'} size={14} family={'Poppins-med'}> (UID)</Text>
                            </View>

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <TextInput 
                                    value={transacRet}
                                    // placeholder={String(prevName.qtty)}
                                    onChangeText={(transacRet) => {setTransacRet(transacRet)}}
                                    keyboardType='numeric'
                                    maxLength={9007199254740991}
                                    
                                ></TextInput>
                                <Text style={{color : "grey"}} color={'rgba(136, 8, 4, 0.68)'} size={14} family={'Poppins-med'}> (jumlah stok diretur)</Text>
                            </View>

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <TextInput 
                                    value={admin}
                                    // placeholder={String(prevName.qtty)}
                                    onChangeText={(admin) => {setAdmin(admin)}}
                                    // keyboardType='numeric'
                                    maxLength={26}
                                    
                                ></TextInput>
                                <Text style={{color : "grey"}} color={'rgba(136, 8, 4, 0.68)'} size={14} family={'Poppins-med'}> (admin pencatat)</Text>
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
                                        setTranRet("");
                                        setTransacRet("");
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
                                    <MaterialCommunityIcons name='arrow-u-down-left-bold' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(243, 134, 0, 0.7)"} onPress={() => {  

                                    if(admin === ""){
                                        alert("Silakan lengkapi formulir!")
                                    } else {
                                        setIsEditMode(true); 
                                        createDataRet(); 
                                        handleCloseBottomSheet(); 
                                        setTranRet("")
                                    }
                                    
                                    }}></MaterialCommunityIcons>
                                </TouchableOpacity>
                            </View>
                    </View>
       
                

        </Modal>}

        {displayLastTran ? <View style={{
            backgroundColor: "rgba(5, 107, 122, 0.59)",
            width: windowWidth - 100,
            height: 140,
            position: "absolute",
            marginTop: windowHeight - 240,
            alignSelf:"flex-end",
            padding: 5,
            paddingLeft: 20,
            marginRight: 20,
            borderBottomLeftRadius: 50
        }}>

            <Text style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold"
            }}>
                Mencari Data Barang menggunakan: UID, nama barang, harga, jumlah tersimpan, tanggal transaksi, dan tanggal diupdate! atau langsung scan kode barcode!
            </Text>

            <Text style={{
                position: "absolute",
                alignSelf: "flex-end",
                marginTop: 70,
                padding: 15,
                fontSize: 35,
                color: "rgba(5, 107, 122, 0.86)"
            }}>👨‍💻</Text>

        </View> : <View></View>}


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