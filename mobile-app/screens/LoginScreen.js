import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';

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
          const text = await res.text();
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
      .then(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        );
      })
      .catch(err => {
        console.error('Error during login:', err.message);
        // Optionally show a UI alert here
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={login} />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: {
    marginBottom: 10,
    borderBottomWidth: 1,
    padding: 8,
    borderColor: '#ccc',
  },
  signupText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#333',
  },
  signupLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
