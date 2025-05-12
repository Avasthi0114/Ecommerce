import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
  fetch('http://10.6.8.123:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  .then(async res => {
    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      const text = await res.text(); // fallback in case response is not JSON
      console.warn('Login failed:', text);
      throw new Error('Login failed');
    }

    if (contentType && contentType.includes('application/json')) {
      return res.json();
    } else {
      const text = await res.text();
      console.warn('Expected JSON but got:', text);
      throw new Error('Invalid server response');
    }
  })
  .then(() => navigation.navigate('Home'))
  .catch(err => {
    console.error('Error during login:', err.message);
    // Optionally show a UI alert here
  });
};


  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={login} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 10, borderBottomWidth: 1, padding: 8 }
});