import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function CartScreen({ route, navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const userId = 'guest-user'; // static or use auth

  // Fetch cart items from the database when the screen is loaded
  useEffect(() => {
    axios.get(`http://10.6.8.123:5000/api/cart/${userId}`)
      .then(res => {
        setCartItems(res.data.items || []);
      })
      .catch(err => console.log(err));
  }, []);

  // Update the cart when a new item is added
  useEffect(() => {
    if (route.params?.product) {
      const newItem = { ...route.params.product, quantity: 1 };
      setCartItems(prevItems => {
        const existing = prevItems.find(item => item._id === newItem._id);
        if (existing) {
          return prevItems.map(item =>
            item._id === newItem._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, newItem];
      });

      // Persist to MongoDB
      axios.post('http://10.6.8.123:5000/api/cart/update', {
        userId,
        items: [
          {
            productId: newItem._id,
            name: newItem.name,
            price: newItem.price,
            quantity: 1
          }
        ]
      }).catch(err => console.log(err));
    }
  }, [route.params]);

  const proceedToCheckout = () => {
    navigation.navigate('Checkout', { cartItems });
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });

    // Update the quantity in the database
    axios.post('http://10.6.8.123:5000/api/cart/update', {
      userId,
      items: cartItems.filter(item => item._id === itemId)
    }).catch(err => console.log(err));
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));

    // Remove from MongoDB
    axios.post('http://10.6.8.123:5000/api/cart/remove', {
      userId,
      productId: itemId
    }).catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>${item.price} x {item.quantity}</Text>
            <View style={styles.quantityControls}>
              <Button
                title="-"
                onPress={() => updateItemQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              />
              <Button
                title="+"
                onPress={() => updateItemQuantity(item._id, item.quantity + 1)}
              />
              <Button
                title="Remove"
                onPress={() => removeItem(item._id)}
                color="#dc3545"
              />
            </View>
          </View>
        )}
      />
      {cartItems.length > 0 && (
        <Button title="Proceed to Checkout" onPress={proceedToCheckout} color="#28a745" />
      )}
      {cartItems.length === 0 && <Text style={styles.emptyCartText}>Your cart is empty.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  itemBox: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  itemDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
  quantityControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
