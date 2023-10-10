import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Header, Input, Button, Icon, ListItem } from '@rneui/themed';


import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.EXPO_PUBLIC_APPID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {

  const [product, setProduct] = useState({
    name: '',
    amount: ''
  });
  const [items, setItems] = useState([]);

  const saveItem = () => {
    push(ref(database, 'items/'), product);
  };

  const removeItem = (itemId) => {
    const itemRef = ref(database, 'items/' + itemId);
    remove(itemRef);
  };

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const firebaseItems = Object.keys(data).map((key) => {
          return { id: key, ...data[key] };
        });
        setItems(firebaseItems);
      } else {
        setItems([]);
      }
    });
  }, []);


  return (
    <View>
      <Header containerStyle={styles.header} centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }} />
      <Input containerStyle={styles.input} placeholder='Product' label='PRODUCT' onChangeText={name => setProduct(prevState => ({ ...prevState, name }))} value={product.name} />
      <Input containerStyle={styles.input} placeholder='Amount' label='AMOUNT' onChangeText={amount => setProduct(prevState => ({ ...prevState, amount }))} value={product.amount} />
      
      <Button radius={"sm"} type="solid" onPress={saveItem} title="Save" containerStyle={styles.saveButtonContainer}>
        <Icon name="save" color="white" />
        Save
      </Button>
      
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
            </ListItem.Content>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Icon name="delete" color="red" />
            </TouchableOpacity>
          </ListItem>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  saveButtonContainer: {
    width: 200,
    alignSelf: 'center',
    marginTop: 5,
  },
  input: {
    marginTop: 5,
    marginBottom: -15,
  },
  header: {
    marginTop: 20,
  }
});