import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function HomeScreen() {

  const [length, setLength] = useState<string>('10');
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [strength, setStrength] = useState<string>('');

  // 🔐 Generador avanzado
  const generatePassword = () => {

    const numericLength = parseInt(length);

    if (numericLength > 14) {
      setGeneratedPassword('Máx 14 caracteres');
      return;
    }

    if (numericLength < 8) {
      setGeneratedPassword('Mínimo 8 recomendado');
      return;
    }

    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // sin caracteres confusos
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*';

    let groups = [];
    let passwordArray: string[] = [];

    if (includeUppercase) groups.push(upper);
    if (includeLowercase) groups.push(lower);
    if (includeNumbers) groups.push(numbers);
    if (includeSymbols) groups.push(symbols);

    if (groups.length === 0) {
      setGeneratedPassword('Selecciona opciones');
      return;
    }

    // 🔹 Garantizar variedad
    groups.forEach(group => {
      passwordArray.push(group[Math.floor(Math.random() * group.length)]);
    });

    // 🔹 Completar sin repetir mucho
    while (passwordArray.length < numericLength) {
      const group = groups[Math.floor(Math.random() * groups.length)];
      const char = group[Math.floor(Math.random() * group.length)];

      // Evitar repetición consecutiva
      if (passwordArray[passwordArray.length - 1] !== char) {
        passwordArray.push(char);
      }
    }

    // 🔹 Mezclar bien
    const shuffled = passwordArray.sort(() => Math.random() - 0.5);
    const finalPassword = shuffled.join('');

    setGeneratedPassword(finalPassword);

    // 🔐 Evaluación mejorada
    let score = 0;

    if (numericLength >= 10) score++;
    if (numericLength >= 12) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 2) setStrength('Débil ❌');
    else if (score <= 4) setStrength('Media ⚠️');
    else setStrength('Fuerte 🔐');
  };

  // 📋 Copiar contraseña
  const copyPassword = async () => {
    if (generatedPassword) {
      await Clipboard.setStringAsync(generatedPassword);
      setStrength('Copiado ✅');
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🔐 Password Generator</Text>

      <View style={styles.card}>

        <Text style={styles.label}>Longitud</Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={length}
          onChangeText={setLength}
        />

        <View style={styles.option}>
          <Text style={styles.text}>Mayúsculas</Text>
          <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
        </View>

        <View style={styles.option}>
          <Text style={styles.text}>Minúsculas</Text>
          <Switch value={includeLowercase} onValueChange={setIncludeLowercase} />
        </View>

        <View style={styles.option}>
          <Text style={styles.text}>Números</Text>
          <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
        </View>

        <View style={styles.option}>
          <Text style={styles.text}>Símbolos</Text>
          <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
        </View>

        <Button title="Generar 🔥" onPress={generatePassword} />

      </View>

      <View style={styles.resultBox}>
        <Text style={styles.result}>{generatedPassword}</Text>

        <TouchableOpacity style={styles.copyBtn} onPress={copyPassword}>
          <Text style={styles.copyText}>📋 Copiar</Text>
        </TouchableOpacity>

        <Text style={styles.strength}>{strength}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20
  },
  label: {
    color: '#94a3b8',
    marginBottom: 5
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  text: {
    color: '#e2e8f0'
  },
  resultBox: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center'
  },
  result: {
    color: '#22c55e',
    fontSize: 20,
    fontWeight: 'bold'
  },
  copyBtn: {
    marginTop: 10,
    backgroundColor: '#38bdf8',
    padding: 10,
    borderRadius: 8
  },
  copyText: {
    color: '#000',
    fontWeight: 'bold'
  },
  strength: {
    marginTop: 10,
    color: '#facc15',
    fontSize: 16
  }
});