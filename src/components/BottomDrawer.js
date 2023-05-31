import { useState } from 'react'; 
import {  Image, Modal, View, Button, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';




export default function BottomDrawer() {

 
const windowHeight = Dimensions.get('window').height;
const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
const handleOpenBottomSheet = () => {
  setIsBottomSheetOpen(true);
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
    <TouchableOpacity onPress={handleOpenBottomSheet} style={{ width: '90%', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#86827e', paddingVertical: 12, borderRadius: 8 }}>
        <SubText text={'Open Drawer'} color={'#86827e'} size={16} family={'PoppinsSBold'} />
    </TouchableOpacity>

<Modal
  animationType="slide"
  transparent={true}
  visible={isBottomSheetOpen}
  onRequestClose={handleCloseBottomSheet} >

    <View style={[styles.bottomSheet, { height: windowHeight * 0.6 }]}>
    

      <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
        <SubText text={'Preview'} family={'Poppins-med'} size={16} color={'#86827e'} />
        <TouchableOpacity onPress={handleCloseBottomSheet}>
        <MaterialCommunityIcons name='close' size={20}></MaterialCommunityIcons>
        </TouchableOpacity>
      </View>


{/* // Section with Information  */}
      <View style={{ paddingVertical: 16 }}>
        <SubText text={'Unyime Emmanuel'} family={'PoppinsSBold'} color={'#292929'} size={18} />
        <SubText text={`I'm a Software Engineer and Technical Writer, I've had the TypeScript epiphany!. Oh, I play Chess too!`} family={'Poppins'} color={'#86827e'} size={14} />
        
        <View style={{ opacity: .2, height: 1, borderWidth: 1, borderColor: '#86827e', marginVertical: 16 }} />
          <View style={{ flex: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
            <SubText text={'24'} color={'#292929'} family={'PoppinsSBold'} size={24} />
            <SubText text={' articles written'} color={'#86827e'} size={14} family={'Poppins-med'} />
          </View>
  
        <View style={{ paddingTop: 16 }}>
          <SubText text={'Views (30 days)'} color={'#86827e'} size={12} family={'Poppins-med'} />
          <SubText text = {'4,904'} color={'#292929'} family={'PoppinsSBold'} size={18} />
        </View>
  
        <View style={{ paddingTop: 16 }}>
          <SubText text={'Views (30 days)'} color={'#86827e'} size={12} family={'Poppins-med'} />
          <SubText text={'4,904'} color={'#292929'} family={'PoppinsSBold'} size={18} />
         </View>

        <View style={{ paddingTop: 16 }}>
          <SubText text={'Reads (30 days)'} color={'#86827e'} size={12} family={'Poppins-med'} />
          <SubText text={'3038'} color={'#292929'} family={'PoppinsSBold'} size={18} />
         </View>
  
        <View style={{ paddingTop: 16, flex: 0, flexDirection: 'row' }}>
          
          <View style={{ paddingLeft: 12 }} />
          <SubText text={'Medium'} color={'#86827e'} size={14} family={'Poppins-med'} />
        </View>
    </View>
{/* // Section with Information */}
  </View>
</Modal>

</View>
  )
}

// The StyleSheet is imported from React Native
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 23,
        paddingHorizontal: 25,
        bottom: 0,
        borderWidth: 1,
        borderColor: 'red'
    },
});