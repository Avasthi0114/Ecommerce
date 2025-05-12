import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://10.6.8.123:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSignOut = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
        <TouchableOpacity
      onPress={() => navigation.navigate('Cart')}
      style={[styles.cartBtn, { marginLeft: 'auto', marginRight: 10, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#007bff' }]}>
      <Text style={styles.cartText}>Cart</Text>
    </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <Text style={styles.emptyText}>No products available.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 15,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  signOutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
  },
  cartText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
});
