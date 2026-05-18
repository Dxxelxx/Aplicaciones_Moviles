import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';

export default function HomeScreen() {

  // =========================
  // AUTH
  // =========================

  const [isLogged, setIsLogged] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [registerUser, setRegisterUser] = useState('');
  const [registerPass, setRegisterPass] = useState('');

  const [savedUsers, setSavedUsers] = useState<any[]>([]);

  // =========================
  // PASSWORD GENERATOR
  // =========================

  const [length, setLength] = useState(16);

  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [strength, setStrength] = useState('Muy fuerte');

  // =========================
  // EXTRA
  // =========================

  const [passwordLabel, setPasswordLabel] = useState('');

  const [showPasswords, setShowPasswords] = useState(false);

  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [verifyPassword, setVerifyPassword] = useState('');

  // =========================
  // HISTORIAL
  // =========================

  const [usersHistory, setUsersHistory] =
    useState<{
      [key: string]: any[];
    }>({});

  // =========================
  // LOAD STORAGE
  // =========================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      const users =
        await AsyncStorage.getItem('users');

      const history =
        await AsyncStorage.getItem('passwordHistory');

      if (users) {
        setSavedUsers(JSON.parse(users));
      }

      if (history) {
        setUsersHistory(JSON.parse(history));
      }

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // ENCRIPTAR VISUALMENTE
  // =========================

  const encryptPassword = (text?: string) => {

    if (
      text === undefined ||
      text === null ||
      typeof text !== 'string'
    ) {

      return '••••••••';
    }

    return text.replace(/./g, '•');
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async () => {

    if (
      registerUser.trim() === '' ||
      registerPass.trim() === ''
    ) {

      Alert.alert(
        'Error',
        'Completa todos los campos'
      );

      return;
    }

    try {

      const data =
        await AsyncStorage.getItem('users');

      let users = data ? JSON.parse(data) : [];

      const exists = users.find(
        (item: any) =>
          item.username.toLowerCase() ===
          registerUser.trim().toLowerCase()
      );

      if (exists) {

        Alert.alert(
          'Usuario existente',
          'Este usuario ya está registrado'
        );

        return;
      }

      const newUser = {
        username: registerUser.trim(),
        password: registerPass.trim(),
      };

      users.push(newUser);

      await AsyncStorage.setItem(
        'users',
        JSON.stringify(users)
      );

      setSavedUsers(users);

      Alert.alert(
        'Usuario registrado',
        'Cuenta creada correctamente'
      );

      setRegisterUser('');
      setRegisterPass('');

      setIsRegister(false);

    } catch (error) {

      Alert.alert(
        'Error',
        'No se pudo registrar'
      );
    }
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {

    try {

      if (
        username.trim() === '' ||
        password.trim() === ''
      ) {

        Alert.alert(
          'Error',
          'Completa todos los campos'
        );

        return;
      }

      const data =
        await AsyncStorage.getItem('users');

      const users =
        data ? JSON.parse(data) : [];

      const user = users.find(
        (u: any) =>
          u.username === username &&
          u.password === password
      );

      if (!user) {

        Alert.alert(
          'Error',
          'Usuario o contraseña incorrectos'
        );

        return;
      }

      setIsLogged(true);

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'No se pudo iniciar sesión'
      );
    }
  };

  // =========================
  // GENERATE PASSWORD
  // =========================

const generatePassword = async () => {

  try {

    const upper =
      'ABCDEFGHJKLMNPQRSTUVWXYZ';

    const lower =
      'abcdefghijkmnopqrstuvwxyz';

    const numbers =
      '23456789';

    const symbols =
      '!@#$%&*';

    let groups: string[] = [];

    let passwordArray: string[] = [];

    if (includeUppercase) groups.push(upper);
    if (includeLowercase) groups.push(lower);
    if (includeNumbers) groups.push(numbers);
    if (includeSymbols) groups.push(symbols);

    if (groups.length === 0) {

      Alert.alert(
        'Error',
        'Selecciona al menos una opción'
      );

      return;
    }

    // AGREGAR 1 DE CADA TIPO

    groups.forEach((group) => {

      passwordArray.push(

        group[
          Math.floor(
            Math.random() * group.length
          )
        ]
      );
    });

    // COMPLETAR

    while (
      passwordArray.length < length
    ) {

      const group =
        groups[
          Math.floor(
            Math.random() * groups.length
          )
        ];

      const char =
        group[
          Math.floor(
            Math.random() * group.length
          )
        ];

      passwordArray.push(char);
    }

    // MEZCLAR

    const shuffled =
      passwordArray.sort(
        () => Math.random() - 0.5
      );

    const finalPassword =
      shuffled.join('');

    setGeneratedPassword(
      finalPassword
    );

    // FORTALEZA

    let score = 0;

    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;

    if (includeUppercase) score++;
    if (includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 3) {

      setStrength('Débil ❌');

    } else if (score <= 5) {

      setStrength('Media ⚠️');

    } else {

      setStrength('Muy fuerte 🔐');
    }

    // FECHA Y HORA

    const now =
      new Date();

    const currentDate =
      now.toLocaleDateString() +
      ' - ' +
      now.toLocaleTimeString();

    // MOSTRAR ALERTA

    Alert.alert(

      'Guardar contraseña',

      '¿Deseas guardarla en el historial?',

      [

        {
          text: 'No',
          style: 'cancel',
        },

        {
          text: 'Sí',

          onPress: async () => {

            try {

              const historialActual =

                Array.isArray(
                  usersHistory[username]
                )

                  ? usersHistory[username]

                  : [];

              const nuevaContraseña = {

                password:
                  finalPassword,

                date:
                  currentDate,

                label:
                  passwordLabel.trim() ||
                  'Sin etiqueta',
              };

              const updatedHistory = {

                ...usersHistory,

                [username]: [

                  ...historialActual,

                  nuevaContraseña,
                ],
              };

              setUsersHistory(
                updatedHistory
              );

              await AsyncStorage.setItem(

                'passwordHistory',

                JSON.stringify(
                  updatedHistory
                )
              );

              setPasswordLabel('');

              Alert.alert(
                'Guardado',
                'Contraseña guardada correctamente'
              );

            } catch (error) {

              console.log(error);

              Alert.alert(
                'Error',
                'No se pudo guardar'
              );
            }
          },
        },
      ]
    );

  } catch (error) {

    console.log(error);

    Alert.alert(
      'Error',
      'Error al generar contraseña'
    );
  }
};

  // =========================
  // COPY
  // =========================

  const copyPassword = async () => {

    if (!generatedPassword) return;

    await Clipboard.setStringAsync(
      generatedPassword
    );

    Alert.alert(
      'Copiado',
      'Contraseña copiada'
    );
  };

  // =========================
  // VERIFICAR CONTRASEÑA
  // =========================

  const verifyAndShowPasswords = () => {

    if (verifyPassword === password) {

      setShowPasswords(true);

      setShowVerifyModal(false);

      setVerifyPassword('');

      Alert.alert(
        'Correcto',
        'Contraseñas desbloqueadas'
      );

    } else {

      Alert.alert(
        'Error',
        'Contraseña incorrecta'
      );
    }
  };

  // =========================
  // DELETE PASSWORD
  // =========================

  const deletePassword = async (
    index: number
  ) => {

    const filtered =
      usersHistory[username].filter(
        (_: any, i: number) => i !== index
      );

    const updatedHistory = {

      ...usersHistory,

      [username]: filtered,
    };

    setUsersHistory(updatedHistory);

    await AsyncStorage.setItem(
      'passwordHistory',
      JSON.stringify(updatedHistory)
    );
  };

  // =========================
  // REGISTER SCREEN
  // =========================

  if (isRegister) {

    return (

      <ScrollView style={styles.container}>

        <View style={styles.logoContainer}>

          <MaterialCommunityIcons
            name="shield-lock"
            size={80}
            color="#00d4ff"
          />

          <Text style={styles.logoText}>
            CyberPass
          </Text>

          <Text style={styles.subtitle}>
            Crear nueva cuenta
          </Text>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Registrarse
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="person-outline"
              size={22}
              color="#00d4ff"
            />

            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#777"
              value={registerUser}
              onChangeText={setRegisterUser}
            />

          </View>

          <View style={styles.inputContainer}>

            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="#bb00ff"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#777"
              secureTextEntry
              value={registerPass}
              onChangeText={setRegisterPass}
            />

          </View>

          <TouchableOpacity
            onPress={handleRegister}
          >

            <LinearGradient
              colors={['#00c6ff', '#8f00ff']}
              style={styles.button}
            >

              <Text style={styles.buttonText}>
                REGISTRARSE
              </Text>

            </LinearGradient>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRegister(false)}
          >

            <Text style={styles.switchText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>
    );
  }

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!isLogged) {

    return (

      <ScrollView style={styles.container}>

        <View style={styles.logoContainer}>

          <MaterialCommunityIcons
            name="shield-lock"
            size={90}
            color="#00d4ff"
          />

          <Text style={styles.logoText}>
            CyberPass
          </Text>

          <Text style={styles.subtitle}>
            Generador de contraseñas seguras
          </Text>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Iniciar sesión
          </Text>

          <Text style={styles.cardSubtitle}>
            Bienvenido de nuevo
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="person-outline"
              size={22}
              color="#00d4ff"
            />

            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#777"
              value={username}
              onChangeText={setUsername}
            />

          </View>

          <View style={styles.inputContainer}>

            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="#bb00ff"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#777"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

          </View>

          <TouchableOpacity
            onPress={handleLogin}
          >

            <LinearGradient
              colors={['#00c6ff', '#8f00ff']}
              style={styles.button}
            >

              <Text style={styles.buttonText}>
                INICIAR SESIÓN
              </Text>

            </LinearGradient>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRegister(true)}
          >

            <Text style={styles.switchText}>
              ¿No tienes cuenta? Regístrate
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>
    );
  }

  // =========================
  // MAIN SCREEN
  // =========================

  return (

    <ScrollView style={styles.container}>

      {/* MODAL */}

      <Modal
        visible={showVerifyModal}
        transparent
        animationType="slide"
      >

        <View style={styles.modalContainer}>

          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Verificar identidad
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#777"
              secureTextEntry
              value={verifyPassword}
              onChangeText={setVerifyPassword}
            />

            <TouchableOpacity
              onPress={verifyAndShowPasswords}
            >

              <LinearGradient
                colors={['#00c6ff', '#8f00ff']}
                style={styles.button}
              >

                <Text style={styles.buttonText}>
                  VERIFICAR
                </Text>

              </LinearGradient>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowVerifyModal(false)}
            >

              <Text style={styles.switchText}>
                Cancelar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

      {/* HEADER */}

      <View style={styles.mainHeader}>

        <MaterialCommunityIcons
          name="shield-check"
          size={60}
          color="#00d4ff"
        />

        <Text style={styles.logoText}>
          CyberPass
        </Text>

        <Text style={styles.subtitle}>
          Hola {username}
        </Text>

      </View>

      {/* RESULTADO */}

      <View style={styles.resultCard}>

        <Text style={styles.sectionTitle}>
          TU CONTRASEÑA
        </Text>

        <View style={styles.passwordBox}>

          <Text style={styles.passwordText}>
            {
              generatedPassword ||
              'Genera una contraseña'
            }
          </Text>

          <TouchableOpacity
            onPress={copyPassword}
          >

            <Feather
              name="copy"
              size={26}
              color="#fff"
            />

          </TouchableOpacity>

        </View>

        <Text style={styles.strengthText}>
          Fortaleza: {strength}
        </Text>

      </View>

      {/* OPCIONES */}

      <View style={styles.resultCard}>

        <Text style={styles.sectionTitle}>
          OPCIONES
        </Text>

        <Text style={styles.sliderText}>
          Longitud: {length}
        </Text>

        <Slider
          style={{
            width: '100%',
            height: 40,
          }}
          minimumValue={8}
          maximumValue={32}
          step={1}
          value={length}
          onSlidingComplete={(value) => {
            setLength(Math.floor(value));
          }}
          minimumTrackTintColor="#00d4ff"
          maximumTrackTintColor="#333"
          thumbTintColor="#8f00ff"
        />

        <TextInput
          style={styles.labelInput}
          placeholder="Etiqueta (Ej: Gmail)"
          placeholderTextColor="#777"
          value={passwordLabel}
          onChangeText={setPasswordLabel}
        />

        <View style={styles.optionRow}>

          <Text style={styles.optionText}>
            Mayúsculas
          </Text>

          <Switch
            value={includeUppercase}
            onValueChange={
              setIncludeUppercase
            }
          />

        </View>

        <View style={styles.optionRow}>

          <Text style={styles.optionText}>
            Minúsculas
          </Text>

          <Switch
            value={includeLowercase}
            onValueChange={
              setIncludeLowercase
            }
          />

        </View>

        <View style={styles.optionRow}>

          <Text style={styles.optionText}>
            Números
          </Text>

          <Switch
            value={includeNumbers}
            onValueChange={
              setIncludeNumbers
            }
          />

        </View>

        <View style={styles.optionRow}>

          <Text style={styles.optionText}>
            Símbolos
          </Text>

          <Switch
            value={includeSymbols}
            onValueChange={
              setIncludeSymbols
            }
          />

        </View>

      </View>

      {/* BOTÓN */}

      <TouchableOpacity
        onPress={generatePassword}
      >

        <LinearGradient
          colors={['#00c6ff', '#8f00ff']}
          style={styles.generateButton}
        >

          <Text style={styles.buttonText}>
            GENERAR CONTRASEÑA
          </Text>

        </LinearGradient>

      </TouchableOpacity>

      {/* DESBLOQUEAR */}

      <TouchableOpacity
        style={styles.unlockButton}
        onPress={() =>
          setShowVerifyModal(true)
        }
      >

        <Text style={styles.buttonText}>
          VER CONTRASEÑAS
        </Text>

      </TouchableOpacity>

      {/* HISTORIAL */}

      <View style={styles.historyCard}>

        <Text style={styles.sectionTitle}>
          HISTORIAL
        </Text>

        {
          Array.isArray(
            usersHistory[username]
          ) &&
          usersHistory[username].length > 0 ? (

            usersHistory[username].map(
              (item: any, index: number) => (

                <View
                  key={index}
                  style={styles.historyItem}
                >

                  <Text style={styles.historyLabel}>
                    🔖 {
                      typeof item === 'string'
                        ? 'Sin etiqueta'
                        : item?.label
                    }
                  </Text>

                  <Text style={styles.historyDate}>
                    📅 {
                      typeof item === 'string'
                        ? 'Fecha desconocida'
                        : item?.date
                    }
                  </Text>

                  <Text style={styles.historyPassword}>

                    {
                      showPasswords

                        ? (
                            typeof item === 'string'
                              ? item
                              : item?.password ||
                                'No disponible'
                          )

                        : encryptPassword(
                            typeof item === 'string'
                              ? item
                              : item?.password
                          )
                    }

                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      deletePassword(index)
                    }
                  >

                    <Text style={styles.deleteText}>
                      Eliminar
                    </Text>

                  </TouchableOpacity>

                </View>
              )
            )

          ) : (

            <Text style={styles.emptyText}>
              No hay contraseñas guardadas
            </Text>
          )
        }

      </View>

    </ScrollView>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#020412',
    padding: 20,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },

  mainHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 25,
  },

  logoText: {
    color: '#00d4ff',
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: 10,
  },

  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 5,
  },

  card: {
    backgroundColor: '#070b25',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: '#8f00ff',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  cardSubtitle: {
    color: '#aaa',
    marginBottom: 25,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#050816',
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8f00ff',
  },

  input: {
    flex: 1,
    color: '#fff',
    padding: 15,
    fontSize: 16,
  },

  button: {
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
  },

  generateButton: {
    padding: 22,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
  },

  unlockButton: {
    backgroundColor: '#8f00ff',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  switchText: {
    color: '#00d4ff',
    textAlign: 'center',
    marginTop: 25,
  },

  resultCard: {
    backgroundColor: '#070b25',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  passwordBox: {
    backgroundColor: '#050816',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  passwordText: {
    color: '#00ffb7',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },

  strengthText: {
    color: '#00ffb7',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },

  sliderText: {
    color: '#fff',
    marginBottom: 10,
  },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },

  optionText: {
    color: '#fff',
    fontSize: 16,
  },

  labelInput: {
    backgroundColor: '#050816',
    color: '#fff',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
  },

  historyCard: {
    backgroundColor: '#070b25',
    borderRadius: 25,
    padding: 20,
    marginBottom: 40,
  },

  historyItem: {
    backgroundColor: '#050816',
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
  },

  historyLabel: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  historyDate: {
    color: '#999',
    marginTop: 5,
  },

  historyPassword: {
    color: '#00ffb7',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },

  deleteText: {
    color: '#ff4d4d',
    marginTop: 10,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#999',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },

  modalBox: {
    backgroundColor: '#070b25',
    borderRadius: 25,
    padding: 25,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  modalInput: {
    backgroundColor: '#050816',
    color: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
});