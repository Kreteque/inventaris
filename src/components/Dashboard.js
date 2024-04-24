import { Alert, StyleSheet, Text, View, TouchableOpacity, Dimensions, Pressable, ActivityIndicator, PermissionsAndroid } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, TouchableRipple } from 'react-native-paper';
import AllProducts from './AllProducts';
import { ref, set, update, onValue, remove, query, limitToFirst } from "firebase/database";
import { useState } from 'react';
import { db } from '../database/Config';
import { useEffect } from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import  ManageExternalStorage  from 'react-native-manage-external-storage';
const totalProduk = 100.0;
// const productItems = firebase.firestore().collection('products');


export default function Dashboard({navigation, props}) {
  const [usrData, setUsrData] = useState([]);
  const [trData, setTrData] = useState([]);
  const [prData, setPrData] = useState([]);
  const [isNull, setIsnull] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(false);
  const dateStamp = new Date();
  // console.log(usrData);
  // console.log(trData);
  useEffect(() => {
    getUsrData();
    getTrData();
    getPrData();
    if (trData !== null) {
      setIsnull(false);
    } 

    async function AskPermission() {
      await ManageExternalStorage.checkAndGrantPermission(
             err => { 
               setResult(false)
            },
            res => {
             setResult(true)
            },
          )
     }
       AskPermission()
}, []);

const updatePeriod = () => {
  update(ref(db, 'products/'), {
    fQtty: Object.values(prData).map((item) => {return item.qtty})
  })
}

const requestExternalPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      
    );
    if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
     generatePDF();
    } else {
      Alert.alert('Izin Ditolak!', `PDF gagal dibuat.`);
      console.log(granted);
    }
  } catch (err) {
    Alert.alert(err);
  }
  
};

const generatePDF = async () => {
  setIsLoading(true);
  try {
    
    

    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet">
        <style>
          body {
            background: #fff;
            padding: 0 24px;
            margin: 0;
            height: 100vh;
            color: rgb(15, 13, 13);
            display: flex;
            
            align-items: center;
            flex-direction: column;
          } h2 {
            text-align: center;
          } table {
            counter-reset: rowNumber;
            text-align: center;
          } .rowNumbers {
            counter-reset: step;
            position: relative;
          } .rowNumbers td:first-child:before {
            counter-increment: step;
            content: counter(step, decimal);
            
          } div {
            align-self: flex-start;
            margin-top: 20px;
            font-size: 0.8em;
          }
        </style>
      </head>
      <body>
        <header>
        <table>
          <tr>
            <th colspan="2"><img style="width: 122px; height: 62px; padding-right: 30px" src="data:image/png;base64,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" /></th>
            <th colspan="2">DAFTAR INVENTARIS<br>KYK SUKSES MAKMUR PERIODE ${String(dateStamp.getDate()) + "/" + String(dateStamp.getMonth() + 1) + "/" + String(dateStamp.getFullYear())}</th>
          </tr>
        </table>
        </header>
        <table class="rowNumbers" style="width: 100%; margin-top: 10px; font-size: 0.8em;" border="1px">
        <tr align="center" >
            <th style="padding:2.5px; width: 5%;" rowspan="2">No</th>
            <th style="padding:2.5px; width: 20%;" rowspan="2">ID Barang</th>
            <th style="padding:2.5px; width: 30%;" rowspan="2">Nama Barang</th>
            <th style="padding:2.5px; width: 30%;" rowspan="2">Satuan</th>
            <th style="padding:2.5px;" colspan="6">Stok</th>
            
        </tr>
        <tr>
            
            <th>Awal*</th>
            <th>Masuk</th>
            <th>Keluar</th>
            <th>Retur**</th>
            <th>Akhir</th> 
           
        </tr>
    
        
        <tr>
        ${Object.values(prData).map((item) => {  return `
            <td></td>
            <td>${item.UID}</td>
            <td>${item.proName}</td>
            <td>${item.unit}</td>
            <td>${item.fQtty}</td>
            <td>${item.addedQtty}</td>
            <td>${item.subbsQtty}</td>
            <td>${item.reject + item.restok + item.qttyOnhold}</td>
            <td>${item.qtty}</td>
        </tr>`})}
    </table>

    <div>
      <span>
        Keterangan: <br><br>
        *Stok awal merupakan data dari stok akhir pada periode sebelumnya (jika ada),<br>
         atau berasal stok awal yang dimasukan.<br>

        **reject + restock + non-remark
      </span>
    </div
    
      </body>
    </html>
    `;
    const options = {
      html,
      fileName: `Daftar_inventaris_periode_${String(dateStamp.getDate()) + "-" + String(dateStamp.getMonth() + 1) + "-" + String(dateStamp.getFullYear())}`,
      directory: 'Inventaris',
    };

    
    
      const file = await RNHTMLtoPDF.convert(options);
      const path = RNFS.DownloadDirectoryPath;
      Alert.alert('Laporan dibuat!', `PDF disimpan di: penyimpanan internal/Documents/Inventaris/${options.fileName}`);
      console.log(file);
      // RNFS.writeFile(path, file)
      // .then(() => {
      //   console.log('FILE WRITTEN!' + path);
      //   Alert.alert('FILE WRITTEN!' + path);
      // })
      // .catch((err) => {
      //   console.log(err.message);
      // });
    
    
    setIsLoading(false);
  } catch (error) {
    Alert.alert('Error', error.message);
    setIsLoading(false);
  }
};

if (isLoading) {
  return <ActivityIndicator size="small" color="#0000ff" style={{
    position: "absolute",
    alignSelf: "center",
    marginTop: 300,
  }} />;
}

  const getUsrData = () => {
    const starCountRef = query(ref(db, 'userAtr'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setUsrData(data);
    })
  }

  const getTrData = () => {
    const starCountRef = query(ref(db, 'transactions'));
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
              
              <Text><Text style={{color : "black"}}><MaterialCommunityIcons name={item.icon} size={25} color={item.color}/>{item.trQtty} {item.status} </Text></Text>
              {/* <Text><Text style={{color : "black", }}>  <MaterialCommunityIcons name='arrow-up-bold-box' size={15} color={"brown"}/>Keluar: </Text>{item.qtty}</Text> */}
              </View>
              
             
              </View>

              
              
          </TouchableOpacity>)
  })  ;

  let totalIN = trData ? Object.values(trData) : [];
  totalIN = totalIN.filter((item) => {return item.status === "Masuk"});

  let totalOUT = trData ? Object.values(trData) : [];
  totalOUT = totalOUT.filter((item) => {return item.status === "Keluar"});

  let totalRET = trData ? Object.values(trData) : [];
  totalRET = totalRET.filter((item) => {return item.status === "Retur"});

  let lowStock = prData ?  Object.values(prData) : [];
  lowStock = lowStock.filter((item) => {return item.qtty <= 5});

  let dataUser = usrData ? Object.values(usrData) : [];
  let companyName = dataUser.map((item) => {return item.compName});
  let companyLocation = dataUser.map((item) => {return item.location});
  let idUsr = dataUser.map((item) => {return item.usrID});
  // console.log(idUsr);
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
                <TouchableRipple style={styles.dashButtons} onPress={() => {navigation.navigate("Transaksi Masuk")}} rippleColor="rgba(238, 238, 238, .128)" >
                  <View style={{
                    fontWeight: "bold", 
                    color: "white",
                    position: "absolute",
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center"
                    }}><MaterialCommunityIcons color={"rgba(5, 218, 56, 0.7)"} name='arrow-down-bold-box' size={40}/>
                    <View style={{flexDirection: "column"}}>
                    <Text style={{fontWeight: "bold", color: "rgba(5, 218, 56, 0.7)"}}>{totalIN.length}</Text>
                    <Text style={{fontWeight: "bold", color: "rgba(5, 218, 56, 0.7)"}}>Total Masuk</Text>
                    </View>
                  </View>

                  
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => navigation.navigate('Produk Retur')} rippleColor="rgba(238, 238, 238, .128)" >
                <View style={{
                    fontWeight: "bold", 
                    color: "white",
                    position: "absolute",
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center"
                    }}><MaterialCommunityIcons color={"rgba(211, 139, 0, 0.7)"} name='arrow-u-down-left-bold' size={40}/>
                    <View>
                    <Text style={{fontWeight: "bold", color: "rgba(211, 139, 0, 0.7)"}}>{ totalRET.length}</Text>
                    <Text style={{fontWeight: "bold", color: "rgba(211, 139, 0, 0.7)"}}>Produk Retur</Text>
                    </View>
                  </View>
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => {navigation.navigate("Transaksi Keluar")}} rippleColor="rgba(238, 238, 238, .128)" >
                <View style={{
                    fontWeight: "bold", 
                    color: "white",
                    position: "absolute",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    alignSelf: "center"
                    }}><MaterialCommunityIcons color={"rgba(218, 5, 5, 0.7)"} name='arrow-up-bold-box' size={40}/>
                    <View style={{flexDirection: "column"}}>
                    <Text style={{fontWeight: "bold", color: "rgba(218, 5, 5, 0.7)", alignSelf:"flex-end"}}>{totalOUT.length}</Text>
                    <Text style={{fontWeight: "bold", color: "rgba(218, 5, 5, 0.7)"}}>Total Keluar</Text>
                    </View>
                  </View>
                </TouchableRipple>

                <TouchableRipple style={styles.dashButtons} onPress={() => {navigation.navigate("Stok Rendah")}} rippleColor="rgba(238, 238, 238, .128)" >
                <View style={{
                    fontWeight: "bold", 
                    color: "white",
                    position: "absolute",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    alignSelf: "center"
                    }}><MaterialCommunityIcons color={"rgba(218, 162, 5, 0.7)"} name='gauge-low' size={40}/>
                    <View style={{flexDirection: "column"}}>
                    <Text style={{fontWeight: "bold", color: "rgba(218, 162, 5, 0.7)", alignSelf: "flex-end"}}>{lowStock.length}</Text>
                    <Text style={{fontWeight: "bold", color: "rgba(218, 162, 5, 0.7)"}}>Stok Rendah</Text>
                    </View>
                  </View>
                </TouchableRipple>

                
             </View>

             {/* <View style={styles.underText}>
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
          
        </ScrollView> */}

        <TouchableOpacity onPress={() => {navigation.navigate("Pengaturan Pengguna", {id : idUsr})}} style={{
            // flex :1,
            // backgroundColor: "rgba(22, 125, 203, 0.9)",
            width: 50,
            height: 50,
            position: "absolute",
            // alignSelf: "flex-end",
            // marginTop: windowHeight -170,
            margin: 15,
            marginLeft: Dimensions.get("screen").width - 90,
            
        }}>
            <MaterialCommunityIcons color={"rgba(22, 125, 203, 0.9)"} name='account-wrench' size={30} style={{
                alignSelf:"center",
                margin: 10
                }}/>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => {navigation.navigate("Halaman Bantuan")}} style={{
                backgroundColor: "rgba(151, 214, 250, 0.5)",
                flexDirection: "row",
                alignSelf: "flex-end",
                width: 80,
                height: 80,
                justifyContent: "center",
                // borderRadius: 50,
                alignItems: "center",
                borderTopStartRadius: 50,
                borderBottomStartRadius: 50,
                marginTop: 253
                
                }}>
                <MaterialCommunityIcons 
                    name="lifebuoy"
                    size={45}
                    color={"rgba(248, 129, 25, 0.83)"}
                    style={{
                        // backgroundColor: "rgba(219, 111, 16, 0.83)",
                        height: 60,
                        width: 60,
                        padding: 5,
                        borderRadius: 50
                    }}
                    />
                
                
            </TouchableOpacity> */}

            
            
        </View>

        <View>
        <TouchableOpacity onPress={() => {generatePDF()}} style={{
                backgroundColor: "rgba(151, 214, 250, 0.60)",
                flexDirection: "row",
                alignSelf: "flex-start",
                width: 80,
                height: 80,
                justifyContent: "center",
                // borderRadius: 50,
                alignItems: "center",
                borderTopEndRadius: 50,
                borderBottomEndRadius: 50,
                marginTop: 253
                
                }}>
                <Text style={{
                  textAlign: "center",
                  fontStyle: "normal",
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "rgba(56, 165, 162, 0.8)"
                }}>
                  Buat Laporan
                </Text>
                
                
            </TouchableOpacity>
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
         backgroundColor :'rgba(243, 248, 248, 0.38)',
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
        backgroundColor: 'white',
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