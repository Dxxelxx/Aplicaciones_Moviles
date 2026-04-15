// Importamos React y useState para manejar estados dinámicos
import React, { useState } from 'react';

// Importamos componentes de React Native
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity
} from 'react-native';

// Importamos Clipboard para copiar la contraseña
import * as Clipboard from 'expo-clipboard';

// Componente principal
export default function HomeScreen() {

  // 🔹 Estado de la longitud de la contraseña
  const [length, setLength] = useState<string>('10');

  // 🔹 Estados para activar tipos de caracteres
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);

  // 🔹 Estado donde se guarda la contraseña generada
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  // 🔹 Estado para mostrar nivel de seguridad
  const [strength, setStrength] = useState<string>('');

  // 🔐 FUNCIÓN PRINCIPAL
  const generatePassword = () => {

    // Convertimos longitud a número
    const numericLength = parseInt(length);

    // 🔴 Validación: máximo permitido
    if (numericLength > 14) {
      setGeneratedPassword('Máx 14 caracteres');
      return;
    }

    // 🔴 Validación: mínimo recomendado
    if (numericLength < 8) {
      setGeneratedPassword('Mínimo 8 recomendado');
      return;
    }

    // 🔹 Conjuntos de caracteres (sin confusos como 0/O o 1/l)
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*';

    // 🔹 Lista de grupos activos
    let groups: string[] = [];

    // 🔹 Arreglo donde se construye la contraseña
    let passwordArray: string[] = [];

    // Agregar grupos según selección
    if (includeUppercase) groups.push(upper);
    if (includeLowercase) groups.push(lower);
    if (includeNumbers) groups.push(numbers);
    if (includeSymbols) groups.push(symbols);

    // 🔴 Validación: mínimo una opción activa
    if (groups.length === 0) {
      setGeneratedPassword('Selecciona opciones');
      return;
    }

    // 🔹 Garantizar al menos un carácter de cada tipo
    groups.forEach(group => {
      passwordArray.push(
        group[Math.floor(Math.random() * group.length)]
      );
    });

    // 🔹 Completar la contraseña
    while (passwordArray.length < numericLength) {

      // Elegir grupo aleatorio
      const group = groups[Math.floor(Math.random() * groups.length)];

      // Elegir carácter aleatorio del grupo
      const char = group[Math.floor(Math.random() * group.length)];

      // Evitar repetición consecutiva
      if (passwordArray[passwordArray.length - 1] !== char) {
        passwordArray.push(char);
      }
    }

    // 🔹 Mezclar caracteres para mayor seguridad
    const shuffled = passwordArray.sort(() => Math.random() - 0.5);

    // Convertir a string final
    const finalPassword = shuffled.join('');

    // Guardar contraseña
    setGeneratedPassword(finalPassword);

    // 🔐 Evaluación de seguridad
    let score = 0;

    if (numericLength >= 10) score++;
    if (numericLength >= 12) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    // Determinar nivel
    if (score <= 2) setStrength('Débil ❌');
    else if (score <= 4) setStrength('Media ⚠️');
    else setStrength('Fuerte 🔐');
  };

  // 📋 Función para copiar contraseña
  const copyPassword = async () => {
    if (generatedPassword) {
      await Clipboard.setStringAsync(generatedPassword);
      setStrength('Copiado ✅');
    }
  };

  // 🎨 INTERFAZ
  return (
    <View style={styles.container}>

      {/* Título */}
      <Text style={styles.title}>🔐 Password Generator</Text>

      {/* Tarjeta principal */}
      <View style={styles.card}>

        {/* Input longitud */}
        <Text style={styles.label}>Longitud</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={length}
          onChangeText={setLength}
        />

        {/* Opciones */}
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

        {/* Botón generar */}
        <Button title="Generar 🔥" onPress={generatePassword} />

      </View>

      {/* Resultado */}
      <View style={styles.resultBox}>

        <Text style={styles.result}>{generatedPassword}</Text>

        {/* Botón copiar */}
        <TouchableOpacity style={styles.copyBtn} onPress={copyPassword}>
          <Text style={styles.copyText}>📋 Copiar</Text>
        </TouchableOpacity>

        {/* Nivel de seguridad */}
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