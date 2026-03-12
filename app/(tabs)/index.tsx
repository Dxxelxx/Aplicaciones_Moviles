// Importamos React y el hook useState para manejar estados dinámicos
import React, { useState } from 'react';

// Importamos los componentes de React Native que usaremos
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';

// Componente principal de la pantalla
export default function HomeScreen() {

  // Estado para la longitud de la contraseña
  const [length, setLength] = useState<string>('8');

  // Estados para activar o desactivar tipos de caracteres
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);

  // Estado donde se guardará la contraseña generada
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  // Función que genera la contraseña
  const generatePassword = () => {

    // Variable donde se almacenarán los caracteres disponibles
    let characters = '';

    // Si el switch de mayúsculas está activado se agregan letras mayúsculas
    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Si el switch de minúsculas está activado se agregan letras minúsculas
    if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';

    // Si el switch de números está activado se agregan números
    if (includeNumbers) characters += '0123456789';

    // Si el switch de símbolos está activado se agregan caracteres especiales
    if (includeSymbols) characters += '!@#$%^&*()_+';

    // Convertimos la longitud ingresada (texto) a número
    const numericLength = parseInt(length);

    // Validación: si la longitud es mayor a 10 no se permite generar contraseña
    if (numericLength > 10) {
      setGeneratedPassword('Límite no permitido (máximo 10)');
      return; // Detiene la ejecución de la función
    }

    // Validación: si no se seleccionó ningún tipo de carácter
    if (characters.length === 0) {
      setGeneratedPassword('Selecciona al menos una opción');
      return; // Detiene la función
    }

    // Variable donde se construirá la contraseña final
    let password = '';

    // Bucle que genera la contraseña carácter por carácter
    for (let i = 0; i < numericLength; i++) {

      // Genera un índice aleatorio dentro del conjunto de caracteres
      const randomIndex = Math.floor(Math.random() * characters.length);

      // Agrega el carácter aleatorio a la contraseña
      password += characters[randomIndex];
    }

    // Guarda la contraseña generada en el estado
    setGeneratedPassword(password);
  };

  // Interfaz de la aplicación
  return (
    <View style={styles.container}>

      {/* Título de la aplicación */}
      <Text style={styles.title}>🔐 Generador de Contraseñas</Text>

      {/* Texto que indica el campo de longitud */}
      <Text style={styles.label}>Longitud:</Text>

      {/* Campo donde el usuario ingresa la longitud */}
      <TextInput
        style={styles.input}
        keyboardType="numeric" // Muestra teclado numérico
        value={length}
        onChangeText={setLength} // Actualiza el estado cuando cambia el texto
      />

      {/* Switch para activar o desactivar mayúsculas */}
      <View style={styles.option}>
        <Text>Mayúsculas</Text>
        <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
      </View>

      {/* Switch para activar o desactivar minúsculas */}
      <View style={styles.option}>
        <Text>Minúsculas</Text>
        <Switch value={includeLowercase} onValueChange={setIncludeLowercase} />
      </View>

      {/* Switch para activar o desactivar números */}
      <View style={styles.option}>
        <Text>Números</Text>
        <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
      </View>

      {/* Switch para activar o desactivar símbolos */}
      <View style={styles.option}>
        <Text>Símbolos</Text>
        <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
      </View>

      {/* Botón que ejecuta la función para generar la contraseña */}
      <Button title="Generar Contraseña" onPress={generatePassword} />

      {/* Aquí se muestra la contraseña generada o el mensaje */}
      <Text style={styles.result}>{generatedPassword}</Text>

    </View>
  );
}

// Estilos de la aplicación
const styles = StyleSheet.create({

  // Contenedor principal
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2'
  },

  // Estilo del título
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },

  // Texto de etiquetas
  label: {
    fontSize: 16,
    marginTop: 10
  },

  // Estilo del campo de entrada
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff'
  },

  // Estilo para cada opción de switch
  option: {
    flexDirection: 'row', // Coloca elementos en fila
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },

  // Estilo donde se muestra la contraseña generada
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});