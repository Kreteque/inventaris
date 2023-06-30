import { Alert, StyleSheet, Text, View, Button, TouchableOpacity, Modal, Dimensions, ImageBackground } from 'react-native'
import { useState } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import {db} from '../database/Config';
import { ref, set, update, onValue, remove, push, child, database, getDatabase, DataSnapshot, query, orderByChild, orderByValue, orderByKey, startAt, limitToFirst, startAfter } from "firebase/database";
import { useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonGroup } from '@rneui/base';
import AddProduct from './AddProduct';
import BottomDrawer from "./BottomDrawer";
import { TextInput } from 'react-native-paper';





export default function AllProducts({navigation, props}) {


    const [prodItems, setProdItems] = useState([]);
    const [notNull, setNotNull] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [prevName, setPrevName] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
   
    const [isEditMode, setIsEditMode] = useState(true); 
    const [uniqID, setUniqID] = useState(""); 
    const [proName, setProName] = useState("");
    const [qtty, setQtty] = useState("");
    const [proDesc, setProDesc] = useState("");
    // const [buyRate, setBuyRate] = useState("");
    const [collapsedButton, setCollapsedButton] = useState(false);
    const [sortedBy, setSortedBy] = useState("");
    const [searchVal, setSearchVal] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [sortedObject, setSortedObject] = useState();
    const [prodTran, setProdTran] = useState([]);


    

    let totalQtty = [];
    // let totalBuyRate = [];
    
    
    // let totalProducts = [];
    const dateStamp = new Date();
    const month = dateStamp.getMonth() + 1;
    const updatedTimeStamp = String(dateStamp.getDate() + "/" + month + "/" + dateStamp.getFullYear());
    // const formatter = new Intl.NumberFormat('id-ID', {
    //     style: 'currency',
    //     currency: 'IDR',
      
    //   });

   
      
      

    
const getData = () => {
    const starCountRef = query(ref(db, 'products'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      
        if (data === null) {
            setProdItems("");
            setNotNull(false);
            
        } else {
            setProdItems(data);
            setNotNull(true);
            
        }
    })

}

useEffect(() => {
    getData();
    // setSortedObject(sortable);
    // checkSortedBy();
    // setSortedBy("sortable");
    
}, [])

const totalCount = Object.values(prodItems);
totalCount.map((item) => {
    totalQtty.push(item.qtty);
    // totalBuyRate.push(item.buyRate);
    // setSortedObject(item);
    // totalProducts.push(item.UID);
});

// const totBR = totalBuyRate.reduce((a, b) => a + b, 0);
//       let totBRnum = parseInt(totBR);

const delData = (param) => {

        const starCountRef = query(ref(db, 'transactions/'));
        onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setProdTran(data);
        });
        
    
        let searchTransac = prodTran ? Object.values(prodTran) : [];
        searchTransac = searchTransac.filter((item) => {return item.UID === param});
        let trIDs = searchTransac.map((item) => {return item.transacID});
        // console.log(trIDs);
        // console.log(trIDs.pop());
        // console.log(trIDs.pop());
        // console.log(trIDs.pop());
        // console.log(trIDs.length);

        while (trIDs.length !== 0) {
            let shiftedArr = trIDs.pop();
            remove(ref(db, 'transactions/' + shiftedArr));
            console.log(shiftedArr);
        }

        if (trIDs.length === 0) {
            remove(ref(db, 'products/' + param));
        }
   
    
  }

const updateData = () => {


    update(ref(db, 'products/' + uniqID), {
               
        UID: uniqID,
        proName: proName.charAt(0).toUpperCase() + proName.slice(1),
        qtty: parseInt(qtty),
        proDesc: proDesc.charAt(0).toUpperCase() + proDesc.slice(1),
        // buyRate: parseInt(buyRate),
        updatedTimeMark: updatedTimeStamp
      }).then(() => {
        
        handleCloseBottomSheet();
         
        
        alert('data updated!');
    }).catch((error) => {
        // The write failed...
        alert(error);
    });

}




    // notNull ? //  const obj = JSON.parse(prodItems);
    
    // : totalQtty.push(0) ;
   


// We need to get the height of the phone and use it relatively, 
// This is because height of phones vary
const windowHeight = Dimensions.get('window').height;

// This state would determine if the drawer sheet is visible or not

// Function to open the bottom sheet 
const handleOpenBottomSheet = (param) => {
  setIsBottomSheetOpen(true);
  setPrevName(param);
};

// Function to close the bottom sheet
const handleCloseBottomSheet = () => {
  setIsBottomSheetOpen(false);
  setIsEditable(false);
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

const handleEditIcon = () => {
    alert("wow")
    setIsEditMode(false)
}


let prodList = prodItems ? Object.values(prodItems) : [];
prodList = prodList.filter(function(item){
  return item.UID == searchVal 
          | item.proName == searchVal.charAt(0).toUpperCase() + item.proName.slice(1) 
          | item.proDesc == searchVal.charAt(0).toUpperCase() + item.proName.slice(1) 
          | item.qtty == searchVal 
        //   | item.buyRate == searchVal;
});



let prodSortedByQtty = Object.values(prodItems);
prodSortedByQtty = prodSortedByQtty.sort((a, b) => a.qtty - b.qtty);

let sortable = Object.values(prodItems);



let prodSortedByName = Object.values(prodItems);
prodSortedByName = prodSortedByName.sort((a, b) => {
    const nameA = a.proName.toUpperCase(); // ignore upper and lowercase
    const nameB = b.proName.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  
    // names must be equal
    return 0;
  });

// console.log(sortedObject);


const checkSortedBy = () => {
    switch (sortedBy) {
        case "sortable":
            sortable = prodSortedByName
            // setSortedBy([]);
            break;
        case "qtty":
            sortable = prodSortedByQtty
            // setSortedBy([]);
            break;
        case "name":
            setSortedObject(prodSortedByName);
            // setSortedBy([]);
            break;
    
        default:
            setSortedObject(sortable)
            break;
    }
    
    
}
    
  return (

    <View style={styles.container}>

        <View style={styles.containerChild}>

        <ImageBackground 
        source={{uri: "https://img.freepik.com/premium-vector/large-set-business-themed-items-business-partnership-business-concept-vector-illustration_666729-190.jpg?w=2000"}}
        style={{
          flex: 1,
          justifyContent: "center",
        }}
        resizeMode='cover'
        blurRadius={1}
        
        ></ImageBackground>

            {/* <View style={styles.infoCard}>

            <View>
            <Text style={styles.infoCardText}>
                    Total Kuantitas 
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

                   
                    <Text style={styles.totalText}> : {Object.keys(prodItems).length}
                    </Text>
            </View>

            </View> */}

        </View>

        {/* <View style={{
            height:30,
            width: 300,
            backgroundColor: "grey",
            flexDirection: "row"
        }}>
        <TouchableOpacity style={{width: 60, height: 30, backgroundColor: "green"}} onPress={() => {setSortedBy("qtty"); checkSortedBy();}}/>
        <TouchableOpacity style={{width: 60, height: 30, backgroundColor: "brown"}} onPress={() => {setSortedBy("name"); checkSortedBy()}}/>

        </View> */}

        {isSearching ?<View>
            <TextInput 
                blurOnSubmit={true}
                onChangeText={(searchVal) => {setSearchVal(searchVal); setNotNull(false)}} 
                placeholder= {"Cari barang berdasarkan semua properti barang"} 
                style={styles.specializedTextBox}
                >

            </TextInput>
            <MaterialCommunityIcons 
                onPress={() => {setIsSearching(false); setNotNull(true)}} 
                size={32} color={"rgba(214, 10, 10, 0.73)"} 
                name='close-box-outline' style={{
                // backgroundColor: "green",
                width: 50,
                height: 35,
                alignSelf: "flex-end",
                position: "absolute",
                paddingTop: 3
            }}>

            </MaterialCommunityIcons>



        </View> : <View>
                        {/* <Text style={{
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
                            }}>masukan dahulu! 🤨🙏 </Text></Text> */}
        </View>}

        
        
        <ScrollView style={styles.containerChildTwo}>

        {notNull ? sortable.map((item) => {
            const firstLetter = item.proName;
            {/* console.log(item); */}
            
            return (
                <TouchableOpacity style={styles.productListCard} key={item.UID} onPress={() => {handleOpenBottomSheet(item); setCollapsedButton(false)}}>

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

                    <Text style={{color : "grey"}}><Text style={{color : "black"}}>PID:</Text> ({item.UID.toUpperCase()})</Text>
                    <View>
                    <Text style={{color : "grey"}}><Text style={{color : "black"}}>Tersimpan: </Text>{item.qtty} {item.unit}</Text>
                    <View style={{ marginTop: 2, opacity: .60, height: 1, borderWidth: 1, borderColor: 'rgba(78, 116, 289, 1)', width: 270 }} />
                    </View>
                    
                   
                    </View>
                    
                    
                </TouchableOpacity>
                
            )
        }) : <View>

        <ScrollView style={styles.containerChildTwo}>
                {prodList.map((item) => {
                        const firstLetter = item.proName;
                        
                        
                        return (
                            <TouchableOpacity style={styles.productListCard} key={item.UID} onPress={() => {handleOpenBottomSheet(item)}} >

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
                    }) }
        
        

        </ScrollView>

        </View>}
        
        

        </ScrollView>
        
        

        {isEditMode ? <Modal
            animationType="slide"
            transparent={true}
            // We use the state here to toggle visibility of Bottom Sheet 
            visible={isBottomSheetOpen}
            // We pass our function as default function to close the Modal
            onRequestClose={handleCloseBottomSheet} >
            
                <View style={[styles.bottomSheet, { height: windowHeight * 0.7 }]}>
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
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (PID)</Text>
                            </View>

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.qtty)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> <Text style={{fontWeight: "500", color: "#292929"}}>{prevName.unit}</Text> (tersimpan)</Text>
                            </View>

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            {/* <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.buyRate)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (harga beli)</Text>
                            </View> */}

                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.admin)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (admin)</Text>
                            </View>

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={prevName.timeMark} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (tgl masuk)  </Text>  
                                <SubText text={prevName.Exp} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                {/* <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (EXP)</Text> */}
                            </View>
                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            {/* <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <SubText text={String(prevName.prodCode)} color={'#292929'} family={'PoppinsSBold'} size={20} />
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (kode produksi)</Text>
                            </View> */}
                    </View>
                        
                            <View style={{
                                // flex: 1,
                                alignSelf:"flex-end",
                                justifyContent:"center",
                                width: 200,
                                height: 150,
                                // backgroundColor: "grey",
                                flexDirection: "row",
                                position:"absolute",
                                marginTop: windowHeight - 380,
                                paddingRight: 50
                                }} >
                                
                                <TouchableOpacity>

                                    <MaterialCommunityIcons name='delete-circle' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90
                                    }} size={40} color={"rgba(218, 26, 11, 0.8)"} onPress={() => {
                                        Alert.alert(prevName.proName + " akan dihapus!", 'Data terkait produk ini (termasuk semua transaksinya) akan hilang selamanya!', [
                                            {
                                                text: 'Batal',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            {text: 'Hapus', onPress: () => delData(prevName.UID.toLowerCase())},
                                            ]);
                                         
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
                                    <MaterialCommunityIcons name='circle-edit-outline' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(9, 200, 91, 0.8)"} onPress={() => {
                                        setIsEditMode(false);
                                        setUniqID(prevName.UID);
                                        setProName(prevName.proName);
                                        setProDesc(prevName.proDesc);
                                        setQtty(String(prevName.qtty));
                                        // setBuyRate(String(prevName.buyRate));
                                    }}></MaterialCommunityIcons>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                        navigation.navigate("Tambah Transaksi", {
                                            id : prevName.UID
                                        }
                                        );
                                        handleCloseBottomSheet();
                                        // setIsEditMode(false);
                                        }} 
                                //     style={{
                                //     width: 100,
                                //     height: 50,
                                //     alignSelf: "flex-end",
                                //     flex: 1,
                                //     flexDirection: "row",
                                //     justifyContent: "center",
                                //     alignItems : "center"
                                // }}
                                >
                                <MaterialCommunityIcons name='book-plus-multiple' color={"rgba(4, 112, 4, 0.77)"} size={40} style={{
                                    alignSelf:"flex-end",
                                    marginTop:90,
                                    marginLeft:15
                                }}/>
                                

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
                        <Text style={{fontWeight:"bold", fontSize:20, color:"rgba(rgba(4, 112, 4, 0.77)"}}>Edit Barang</Text>
                        <TouchableOpacity onPress={() => {handleCloseBottomSheet(); setIsEditMode(true)}}>
                        <MaterialCommunityIcons color={"grey"} name='close' size={28}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                
                
                    <View style={{ paddingVertical: 16 }}>
                            {/* <SubText text={prevName.proName} family={'PoppinsSBold'} color={'#292929'} size={25} /> */}
                            <TextInput 
                            style={{color: "black"}}
                            value={proName}
                            placeholder={prevName.proName}
                            onChangeText={(proName) => {setProName(proName)}}
                            ></TextInput>
                            <TextInput 
                            style={{color: "black"}}
                            value={proDesc}
                            placeholder={prevName.proDesc}
                            onChangeText={(proDesc) => {setProDesc(proDesc)}}
                            ></TextInput>
                            
                            {/* <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput 
                            style={{color: "black"}}
                            value={uniqID}
                            placeholder={prevName.UID}
                            onChangeText={(uniqID) => {setUniqID(uniqID)}}
                            ></TextInput>
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (UID)</Text>
                            </View> */}

                            {/* <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput 
                            style={{color: "black"}}
                            value={qtty}
                            placeholder={String(prevName.qtty)}
                            onChangeText={(qtty) => {setQtty(qtty)}}
                            keyboardType='numeric'
                            maxLength={9007199254740991}
                            ></TextInput>
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (tersimpan)</Text>
                            </View> */}

                            <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: 'grey', marginVertical: 16, width: 340 }} />
                            {/* <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput 
                            style={{color: "black"}}
                            value={buyRate}
                            placeholder={String(prevName.buyRate)}
                            onChangeText={(buyRate) => {setBuyRate(buyRate)}}
                            keyboardType='numeric'
                            maxLength={9007199254740991}
                            ></TextInput>
                                <Text style={{color: "grey"}} color={'#86827e'} size={14} family={'Poppins-med'}> (harga beli)</Text>
                            </View> */}
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

                                    <MaterialCommunityIcons name='delete-circle' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90
                                    }} size={40} color={"rgba(218, 26, 11, 0.8)"} onPress={() => {
                                        Alert.alert(prevName.proName + " akan dihapus!", 'Data akan hilang selamanya!', [
                                            {
                                                text: 'Batal',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            {text: 'Hapus', onPress: () => delData(prevName.proName)},
                                            ]);
                                        
                                        // handleCloseBottomSheet();
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
                                    <MaterialCommunityIcons name='content-save' style={{
                                        alignSelf:"flex-end",
                                        marginTop:90,
                                        marginLeft:15
                                    }} size={40} color={"rgba(6, 53, 186, 0.8)"} onPress={() => {
                                        
                                        Alert.alert(prevName.proName + " akan diubah!", 'Kamu yaqin?', [
                                            {
                                                text: 'Batal',
                                                onPress: () => console.log('dia yaqueen'),
                                                style: 'cancel',
                                            },
                                            {text: 'Yakin', onPress: () => {setIsEditMode(true); updateData(); handleCloseBottomSheet()}},
                                            ]);
                                    }}></MaterialCommunityIcons>
                                </TouchableOpacity>
                            </View>
                    </View>
       
                

        </Modal>}
       
        {collapsedButton ? <View style={{
            // width: 150,
            height: 250,
            // backgroundColor: "grey",
            position: "absolute",
            alignSelf: "flex-end",
            marginTop: windowHeight - 350,
            justifyContent: "space-between",
            paddingRight: 25,
            width: 230
        }}>

            <TouchableOpacity onPress={() => {navigation.navigate("Buat Barcode"); setCollapsedButton(false)}} style={{
                backgroundColor: "rgba(245, 141, 12, 0.44)",
                flexDirection: "row",
                alignSelf: "flex-end",
                width: 160,
                height: 55,
                justifyContent: "center",
                borderRadius: 50,
                alignItems: "center",
                
                }}>

                

                <MaterialCommunityIcons 
                    name="barcode"
                    size={40}
                    color={"rgba(183, 101, 0, 0.81)"}
                    />
                <Text style={{
                    alignSelf:"center",
                    color: "rgba(183, 101, 0, 0.81)",
                    fontWeight: "bold"
                }}>Buat Barcode</Text>
                
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {navigation.navigate("Tambah Produk"); setCollapsedButton(false)}} style={{
                backgroundColor: "rgba(5, 200, 235, 0.21)",
                flexDirection: "row",
                alignSelf: "flex-end",
                width: 160,
                height: 55,
                justifyContent: "center",
                borderRadius: 50,
                alignItems: "center",
                
                }}>

                

                <MaterialCommunityIcons 
                    name="archive-plus"
                    size={40}
                    color={"rgba(3, 93, 183, 0.71)"}
                    />
                <Text style={{
                    alignSelf:"center",
                    color: "rgba(3, 93, 183, 0.71)",
                    fontWeight: "bold"
                }}>Tambah Produk</Text>
                
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {navigation.navigate("Tambah Transaksi", prevName); setCollapsedButton(false)}} style={{
                backgroundColor: "rgba(8, 148, 3, 0.29)",
                flexDirection: "row",
                alignSelf: "flex-end",
                width: 160,
                height: 55,
                justifyContent: "center",
                borderRadius: 50,
                alignItems: "center",
            }}>
                <MaterialCommunityIcons
                    name='book-plus-multiple'
                    size={40}
                    color={"rgba(8, 148, 3, 0.71)"}
                />

                <Text style={{
                    alignSelf:"center",
                    color: "rgba(8, 148, 3, 0.71)",
                    fontWeight: "bold"
                    
                }}>Transaksi Baru</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {setCollapsedButton(false)}} style={{
                backgroundColor: "rgba(8, 148, 3, 0.29)",
                flexDirection: "row",
                alignSelf: "flex-end",
                width: 55,
                height: 55,
                justifyContent: "center",
                borderRadius: 50,
                alignItems: "center",
            }}>
                <MaterialCommunityIcons
                    name='menu-open'
                    size={40}
                    color={"rgba(8, 148, 3, 0.71)"}
                />

                
            </TouchableOpacity>

            <View style={{
                // flex: 1,
                // backgroundColor: "green",
                position: 'absolute',
                height: 0,
                width: 140,
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 193,
                
                alignSelf: "flex-start",
                // marginTop: 10,
                // margin: 10
                // opacity: 0,
                
                
                
            }}>

            

            <TouchableOpacity onPress={() => {setCollapsedButton(false); setIsSearching(true)}} style={{
                backgroundColor: "rgba(39, 36, 98, 0.29)",
                flexDirection: "row",
                // alignSelf: "flex-end",
                width: 55,
                height: 55,
                justifyContent: "center",
                borderRadius: 50,
                alignItems: "center",
                // position: "absolute"
                
                }}>
                <MaterialCommunityIcons 
                    name="layers-search-outline"
                    size={40}
                    color={"rgba(39, 36, 98, 0.64)"}
                    />
                
                
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => {setCollapsedButton(false); navigation.navigate("Scan Barcode")}} style={{
                backgroundColor: "rgba(8, 148, 3, 0.29)",
                flexDirection: "row",
                // alignSelf: "flex-start",
                width: 55,
                height: 55,
                justifyContent: "center",
                borderRadius: 50,
                alignItems: "center",
                // position: "absolute",
                // opacity: 1,
                
                
                }}>
                <MaterialCommunityIcons 
                    name="barcode-scan"
                    size={40}
                    color={"rgba(8, 148, 3, 0.71)"}
                    />
                
                
            </TouchableOpacity>

            </View>

        </View>: <View style={{
            // width: 150,
            height: 50,
            // backgroundColor: "grey",
            position: "absolute",
            alignSelf: "flex-end",
            marginTop: windowHeight - 150,
            justifyContent: "flex-end",
            paddingRight: 25
        }}>
            

            <TouchableOpacity onPress={() => {setCollapsedButton(true)}} style={{
                backgroundColor: "rgba(39, 36, 98, 0.29)",
                flexDirection: "row",
                alignSelf: "flex-end",
                width: 55,
                height: 55,
                justifyContent: "center",
                borderRadius: 50,
                alignItems: "center",
                
                }}>
                <MaterialCommunityIcons 
                    name="menu-open"
                    size={40}
                    color={"rgba(39, 36, 98, 0.64)"}
                    />
                
                
            </TouchableOpacity>
            

        </View> }
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
        // borderBottomColor: "rgba(44, 98, 169, 0.8)",
        // borderBottomWidth: 1,
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
        width: '100%', 
        height: 38,
        fontSize: 15,
         padding:5,
         marginBottom : 5,
        // borderColor: 'gray', 
        // borderWidth: 0.2,
         borderRadius: 10,
        //  color: "grey"
      }
     
})