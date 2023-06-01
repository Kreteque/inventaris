import { useState } from 'react/cjs/react.development';
import React, { useEffect } from 'react';



export default DataCarrier = () => {
    const [prodTransactions, setProdTransactions] = useState([]);
  
    useEffect(() => {
      
    }, []);
  
    const readDataTransactions = () => {
      const starCountRef = query(ref(db, 'transactions/' ));
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setProdTransactions(data);
      
      })
    }


  };