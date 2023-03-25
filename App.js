// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {

  //define a new state that represents the network connectivity status
  const connectionStatus = useNetInfo();

  //display an alert popup if connection is lost
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCGIvy_H7xuST6NQX833o-5RtrvIvR7osE",
    authDomain: "chat-app-f3f9b.firebaseapp.com",
    projectId: "chat-app-f3f9b",
    storageBucket: "chat-app-f3f9b.appspot.com",
    messagingSenderId: "115026731849",
    appId: "1:115026731849:web:33523b616b244b70d53098"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  //initialize the storage handler
  const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
