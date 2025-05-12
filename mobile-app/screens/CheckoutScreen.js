import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function CheckoutScreen({ route, navigation }) {
  const { cartItems } = route.params;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const userId = 'guest-user'; // Static ID for simplicity

  const confirmOrder = () => {
    axios.post('http://10.6.8.123:5000/api/orders/create', {
      userId,
      items: cartItems,
      totalAmount
    }).then(() => {
      alert('Order placed successfully');
      navigation.navigate('Home');
    }).catch(err => {
      console.log(err);
      alert('Order failed. Please try again.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>
      <Text style={styles.total}>Total Amount: ${totalAmount.toFixed(2)}</Text>
      <Button title="Confirm Order" onPress={confirmOrder} color="#28a745" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  total: {
    fontSize: 18,
    marginBottom: 30,
    color: '#555'
  }
});
