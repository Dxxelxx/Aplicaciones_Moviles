import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';

export default function HomeScreen() {

  const [length, setLength] = useState<string>('8');
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const generatePassword = () => {
    let characters = '';

    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) characters += '0123456789';
    if (includeSymbols) characters += '!@#$%^&*()_+';

    if (characters.length === 0) {
      setGeneratedPassword('Selecciona al menos una opción');
      return;
    }

    let password = '';
    for (let i = 0; i < parseInt(length); i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    setGeneratedPassword(password);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🔐 Generador de Contraseñas</Text>

      <Text style={styles.label}>Longitud:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={length}
        onChangeText={setLength}
      />

      <View style={styles.option}>
        <Text>Mayúsculas</Text>
        <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
      </View>

      <View style={styles.option}>
        <Text>Minúsculas</Text>
        <Switch value={includeLowercase} onValueChange={setIncludeLowercase} />
      </View>

      <View style={styles.option}>
        <Text>Números</Text>
        <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
      </View>

      <View style={styles.option}>
        <Text>Símbolos</Text>
        <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
      </View>

      <Button title="Generar Contraseña" onPress={generatePassword} />

      <Text style={styles.result}>{generatedPassword}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});