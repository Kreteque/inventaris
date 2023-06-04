import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, TouchableRipple } from 'react-native-paper';
import AllProducts from './AllProducts';
import { ref, set, update, onValue, remove, query, limitToFirst } from "firebase/database";
import { useState } from 'react/cjs/react.development';
import { db } from '../database/Config';
import { useEffect } from 'react';

const totalProduk = 100.0;
// const productItems = firebase.firestore().collection('products');


export default function Dashboard({navigation, props}) {
  const [usrData, setUsrData] = useState([]);
  const [trData, setTrData] = useState([]);
  const [prData, setPrData] = useState([]);
  const [isNull, setIsnull] = useState(true);

  // console.log(usrData);
  console.log(trData);
  useEffect(() => {
    getUsrData();
    getTrData();
    getPrData();
    if (trData !== null) {
      setIsnull(false);
    } 
}, [])


  const getUsrData = () => {
    const starCountRef = query(ref(db, 'userAtr'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setUsrData(data);
    })
  }

  const getTrData = () => {
    const starCountRef = query(ref(db, 'transactions'), limitToFirst(5));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setTrData(data);
      
    })
  }

  const getPrData = () => {
    const starCountRef = query(ref(db, 'products'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setPrData(data);
    })
  }

  let dataTR = trData ? Object.values(trData) : [];
  dataTR = dataTR.map((item) => {
    const firstLetter = item.proName;

    return (
    <TouchableOpacity style={styles.productListCard} key={item.transacID} onPress={() => {}}>

              <View style={{
                  width: 56,
                  height: "100%",
                  backgroundColor: item.color,
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

              <Text><Text style={{color : "black"}}>TrID:</Text> ({item.transacID.toUpperCase()})</Text>

              <View style={{
                  flexDirection : "row",
              }}>
              
              <Text><Text style={{color : "black"}}><MaterialCommunityIcons name={item.icon} size={15} color={item.color}/>{item.status} </Text></Text>
              {/* <Text><Text style={{color : "black", }}>  <MaterialCommunityIcons name='arrow-up-bold-box' size={15} color={"brown"}/>Keluar: </Text>{item.qtty}</Text> */}
              </View>
              
             
              </View>

              
              
          </TouchableOpacity>)
  })  ;

  let totalIN = trData ? Object.values(trData) : [];
  totalIN = totalIN.filter((item) => {return item.status === "Masuk"});

  let totalOUT = trData ? Object.values(trData) : [];
  totalOUT = totalOUT.filter((item) => {return item.status === "Keluar"});

  let lowStock = prData ?  Object.values(prData) : [];
  lowStock = lowStock.filter((item) => {return item.qtty <= 5});

  let dataUser = Object.values(usrData);
  let companyName = dataUser.map((item) => {return item.compName});
  let companyLocation = dataUser.map((item) => {return item.location});

  // console.log(companyName, companyLocation);
  return (
    <View style={[styles.container]}>
        
      <View style={styles.containerChild}>

            <View style={styles.companyCard}>

                  <View style={styles.companyNameBordered}>
                        <MaterialCommunityIcons name="office-building" color={'rgba(49, 199, 207, 1)'} size={25} />
                        <Text style={styles.productCardTitle}>{companyName}</Text>
                  </View>

                  <View style={styles.companyName}>
                        <MaterialCommunityIcons name="pin" color={'rgba(255, 106, 106, 0.85)'} size={25} style={styles.icon} />
                        <Text style={styles.productCardTitle}>{companyLocation}</Text>
                  </View>
              </View>
       
            <View style={styles.productCard}>

                <MaterialCommunityIcons name="package" color={'rgba(194, 82, 29, 0.62)'} size={30} />
                <Text style={styles.productCardTitle}>Produk Tersimpan</Text>
                <Text style={styles.productTotal}>{prData ? Object.values(prData).length : 0}</Text>
                
            </View>

            <View style={styles.dashButtonsCard}>

             
                {/* <Button style={styles.dashButtons} onPress={() => Alert.alert('TOTAL MASUK')} title='TOTAL MASUK'>TOTAL MASUK</Button> */}
                <TouchableRipple style={styles.dashButtons} onPress={() => Alert.alert('TOTAL MASUK')} rippleColor="rgba(238, 238, 238, .128)" >
                  <View style={{
                    fontWeight: "bold", 
                    color: "white",
                    position: "absolute",
                    flexDirection: "row",
                    alignItems: "center"
                    }}><MaterialCommunityIcons color={"rgba(154, 251, 157, 0.65)"} name='arrow-down-bold-box' size={40}/>
                    <View style={{flexDirection: "column"}}>
                    <Text style={{fontWeight: "bold", color: "rgba(154, 251, 157, 0.65)"}}>{totalIN.length}</Text>
                    <Text style={{fontWeight: "bold", color: "rgba(154, 251, 157, 0.65)"}}>TOTAL MASUK</Text>
                    </View>
                  </View>

                  
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => navigation.navigate('Semua Produk')} rippleColor="rgba(238, 238, 238, .128)" >
                <View style={{
                    fontWeight: "bold", 
                    color: "white",
                    position: "absolute",
                    flexDirection: "row",
                    alignItems: "center"
                    }}><MaterialCommunityIcons color={"rgba(245, 195, 128, 0.97)"} name='file-table-box' size={40}/>
                    <View>
                    <Text style={{fontWeight: "bold", color: "rgba(245, 195, 128, 0.97)"}}>{ prData ? Object.values(prData).length : 0}</Text>
                    <Text style={{fontWeight: "bold", color: "rgba(245, 195, 128, 0.97)"}}>TOTAL PRODUK</Text>
                    </View>
                  </View>
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => Alert.alert('TOTAL KELUAR')} rippleColor="rgba(238, 238, 238, .128)" >
                <View style={{
                    fontWeight: "bold", 
                    color: "white",
                    position: "absolute",
                    flexDirection: "row-reverse",
                    alignItems: "center"
                    }}><MaterialCommunityIcons color={"rgba(251, 154, 154, 0.65)"} name='arrow-down-bold-box' size={40}/>
                    <View style={{flexDirection: "column"}}>
                    <Text style={{fontWeight: "bold", color: "rgba(251, 154, 154, 0.65)", alignSelf:"flex-end"}}>{totalOUT.length}</Text>
                    <Text style={{fontWeight: "bold", color: "rgba(251, 154, 154, 0.65)"}}>TOTAL KELUAR</Text>
                    </View>
                  </View>
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => Alert.alert('STOK RENDAH')} rippleColor="rgba(238, 238, 238, .128)" >
                <View style={{
                    fontWeight: "bold", 
                    color: "white",
                    position: "absolute",
                    flexDirection: "row-reverse",
                    alignItems: "center"
                    }}><MaterialCommunityIcons color={"rgba(251, 244, 154, 0.97)"} name='gauge-low' size={40}/>
                    <View style={{flexDirection: "column"}}>
                    <Text style={{fontWeight: "bold", color: "rgba(251, 244, 154, 0.97)", alignSelf: "flex-end"}}>{lowStock.length}</Text>
                    <Text style={{fontWeight: "bold", color: "rgba(251, 244, 154, 0.97)"}}>STOK RENDAH</Text>
                    </View>
                  </View>
                </TouchableRipple>

                
             </View>

             <View style={styles.underText}>
                <TouchableOpacity onPress={() => {navigation.navigate("Semua Transaksi")}}><Text style={{color: "blue"}}>TRANSAKSI TERAKHIR</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {navigation.navigate("Semua Transaksi")}}><Text style={{color: "blue"}}>LIHAT SEMUA REKAM{'>>>'}</Text></TouchableOpacity>
             </View>

        <ScrollView style={styles.containerChildTwo}>
        
        { isNull ? <View style={{
            margin: 75,
            height: 150,
            width: 250,
            backgroundColor: "rgba(32, 45, 85, 0.49)",
            borderBottomStartRadius: 50
        }}>
        <Text style={{
          margin: 15,
          fontWeight: "500",
          color: "white",
          textAlign: "justify",
        }}>Hai, saat ini belum ada transaksi. Untuk membuat transaksi silahkan masuk laman semua produk lalu pilih tambah transaksi! atau baca panduan di laman bantuan.</Text>
        <Text style={{
          fontSize : 45,
          color: "white",
          alignSelf: "flex-end",
          fontWeight: "bold",
          position: "absolute",
          marginTop: 100
        }}>👩‍💻</Text>
        </View> : dataTR
        }
          
        </ScrollView>

        </View>

        
     

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        
        flex: 1,
        
      },

      containerChild : {
         flex: 1,
         backgroundColor :'rgba(172, 176, 215, 0.65)',
        //  height: "30%",
      },

      productTotal: {
        marginLeft : '30%',
        alignSelf: 'center',
        color :'rgba(9, 98, 105, 0.58)',
        fontWeight : '700',
        fontSize : 16,
      },
      productCard: {
        flexDirection: 'row',
        marginBottom: 6,
        // backgroundColor: "#5b5b5b",
        padding : 20,
        margin : 20,
        borderRadius : 15,
        marginTop : 3,
        backgroundColor: "white"
        
      },
    
      productCardTitle: {
        fontSize: 16,
        marginTop: 5,
        color :'rgba(9, 98, 105, 0.58)',
        marginLeft : 5,
        fontWeight: "bold"
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
        backgroundColor: 'rgba(32, 45, 85, 0.49)',
        width: "50%",
        height: 75,
        // borderRadius : 1,
        borderWidth : 15,
        borderColor: "rgba(178, 197, 255, 0.49)",
        alignItems: 'baseline'
      },

      companyCard : {
        flexDirection: 'column',
        marginBottom: 6,
        backgroundColor: "white",
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
        borderBottomColor: 'rgba(9, 98, 105, 0.58)',
        borderStyle: 'dotted',
        
      },

      underText : {
        flexDirection:'row',
        marginTop: -20,
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor:"white"
      },
      productListCard : {
        flexDirection: 'row',
        backgroundColor: "white",
        padding : 20,
        borderBottomColor: "rgba(44, 98, 169, 0.8)",
        borderBottomWidth: 1,
        height: 100,
     },
     containerChildTwo : {
      flex: 1,
      backgroundColor :'white',
      
   },

})