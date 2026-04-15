import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function HomeScreen() {

  // 🔐 LOGIN
  const [isLogged, setIsLogged] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // 🔐 GENERADOR
  const [length, setLength] = useState('10');
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [strength, setStrength] = useState('');

  // 🔹 LOGIN
  const handleLogin = () => {
    if (name.trim() === '' || phone.trim() === '') {
      alert('Completa todos los campos');
      return;
    }
    setIsLogged(true);
  };

  // 🔐 GENERADOR INTELIGENTE
  const generatePassword = () => {

    const numericLength = parseInt(length);

    if (numericLength < 8) {
      setGeneratedPassword('Mínimo 8 recomendado');
      return;
    }

    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*';

    let groups: string[] = [];
    let passwordArray: string[] = [];

    if (includeUppercase) groups.push(upper);
    if (includeLowercase) groups.push(lower);
    if (includeNumbers) groups.push(numbers);
    if (includeSymbols) groups.push(symbols);

    if (groups.length === 0) {
      setGeneratedPassword('Selecciona opciones');
      return;
    }

    // 🔹 Asegurar al menos uno de cada tipo
    groups.forEach(group => {
      passwordArray.push(group[Math.floor(Math.random() * group.length)]);
    });

    // 🔹 Completar evitando repeticiones
    while (passwordArray.length < numericLength) {
      const group = groups[Math.floor(Math.random() * groups.length)];
      const char = group[Math.floor(Math.random() * group.length)];

      if (passwordArray[passwordArray.length - 1] !== char) {
        passwordArray.push(char);
      }
    }

    // 🔹 Mezclar
    const shuffled = passwordArray.sort(() => Math.random() - 0.5);
    const finalPassword = shuffled.join('');

    setGeneratedPassword(finalPassword);

    // 🔐 NUEVA EVALUACIÓN MEJORADA
    let score = 0;

    // Longitud
    if (numericLength >= 8) score++;
    if (numericLength >= 10) score++;
    if (numericLength >= 12) score++;

    // Tipos de caracteres
    if (includeUppercase) score++;
    if (includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    // Resultado
    if (score <= 3) setStrength('Débil ❌');
    else if (score <= 5) setStrength('Media ⚠️');
    else setStrength('Fuerte 🔐');
  };

  // 📋 COPIAR
  const copyPassword = async () => {
    if (generatedPassword) {
      await Clipboard.setStringAsync(generatedPassword);
      setStrength('Copiado ✅');
    }
  };

  // 🔴 LOGIN UI
  if (!isLogged) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔐 Registro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Número"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />

        <Button title="Ingresar" onPress={handleLogin} />
      </View>
    );
  }

  // 🟢 APP PRINCIPAL
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Hola, {name} 👋</Text>

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

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20
  },
  label: {
    color: '#94a3b8'
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
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
    fontSize: 20
  },
  copyBtn: {
    marginTop: 10,
    backgroundColor: '#38bdf8',
    padding: 10,
    borderRadius: 8
  },
  copyText: {
    color: '#000'
  },
  strength: {
    marginTop: 10,
    color: '#facc15'
  }
});