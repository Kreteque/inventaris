
// import { View, Dimensions, Text } from 'react-native';
import { Button, Dialog } from '@rneui/themed';
// import styles from './../styles/Style'
import { RNCamera } from 'react-native-camera';
import { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { ref, onValue, query } from "firebase/database";


export default function ScanBarcode({navigation}) {
    const [prodItems, setProdItems] = useState([]);
    const [barValue, setBarValue] = useState('')
    const [barType, setBarType] = useState('')
    const [flash, setFlash] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [dialText, setDialText] = useState('');
    console.log(barValue);

    // const readData = () => {
    //     const starCountRef = query(ref(db, 'products/' ));
    //     onValue(starCountRef, (snapshot) => {
    //       const data = snapshot.val();
    //       setProdItems(data);
    //     //   console.log(data)
    //     })
    // }

    // let ProdIdentification = Object.values(prodItems);
    // ProdIdentification = ProdIdentification.filter((item) => {return item.UID === barValue});

    return (
    <View style={styles.container}>
        <RNCamera
            ref={ref => {this.camera = ref;}}
            captureAudio={false}
            autoFocus={RNCamera.Constants.AutoFocus.on}
            defaultTouchToFocus
            flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            mirrorImage={false}
            // onBarCodeRead={readBarcode}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
                // console.log(barcodes, barcodes.length)
                if (barcodes.length > 0){
                    setBarValue(barcodes[0].data)
                    setBarType(barcodes[0].format)
                    setShowDialog(true);
                    // readData();
                }
            }}
            style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width
            }}
            type={RNCamera.Constants.Type.back}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
        />
        <Button
            title={`Flash ${flash ? 'OFF' : 'ON'}`}
            onPress={() => setFlash(!flash)}
            icon={{ ...styles.iconButtonHome, size:25, name: 'flash' }}
            iconContainerStyle={styles.iconButtonHomeContainer}
            titleStyle={{ ...styles.titleButtonHome, fontSize: 20 }}
            buttonStyle={{...styles.buttonHome, height: 50}}
            containerStyle={{...styles.buttonHomeContainer, marginTop:20, marginBottom:10}}
        />
        <Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(!showDialog)}>
            <Dialog.Title titleStyle={{color:'#000', fontSize:25}} title="Kode barcode discan!:"/>
            <Text style={{color:'#000', fontSize: 20}}>
                {`Data: ${barValue}\nFormat: ${barType}`}
            </Text>
            <Dialog.Actions>
                <Dialog.Button title="Lakukan transaksi?" onPress={() => {
                    navigation.navigate("Tambah Transaksi", {id : barType, txt : dialText});
                    setShowDialog(false);
                }}/>
            </Dialog.Actions>
        </Dialog>

        {/* {showDialog ? navigation.navigate("Tambah Transaksi", {
            id: barValue,
            text : ""
        }) : navigation.navigate("Tambah Produk", {
            id: barValue,
            text : "??!!"
        })} */}
    </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 30,
    },
    iconButtonHomeContainer: { marginRight: 10 },
    iconButtonHome: {
        type: 'material-community',
        size: 50,
        color: 'white',
    },
    titleButtonHome: { 
        fontWeight: '700', 
        fontSize: 25 
    },
    buttonHome: {
        backgroundColor: '#0C8E4E',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
        height: 100,
    },
    buttonHomeContainer: {
        width: 200,
        marginHorizontal: 50,
        marginVertical: 20,
    },
});