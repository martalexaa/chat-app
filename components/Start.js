import { useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';

import { getAuth, signInAnonymously } from "firebase/auth";


const backgroundColors = {
    black: { backgroundColor: '#000000' },
    grey: { backgroundColor: '#8a95a5' },
    purple: { backgroundColor: '#474056' },
    green: { backgroundColor: '#94ae89' }
}


const Start = ({ navigation }) => {
    const auth = getAuth();
    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    //allow the user to sign in anonymously
    const signInUser = (name, color) => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate("Chat", {
                    userID: result.user.uid,
                    name: name,
                    color: color
                });
                Alert.alert("Signed in Successfully!");
            })
            .catch((error) => {
                Alert.alert("Unable to sign in, try later again.");
            })
    }


    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground source={require('../assets/Background-Image.png')} resizeMode="cover" style={styles.image}>
                    <Text style={styles.title}>Chat App</Text>
                    <View style={styles.box}>
                        <TextInput
                            style={styles.textInput}
                            value={name}
                            onChangeText={setName}
                            placeholder='Your name'
                            leftIcon={
                                <Image
                                    source={require('../assets/icon.svg')}
                                    style={styles.leftIcon}
                                />
                            }
                        />
                        <View style={styles.colorSelectorWrapper} >
                            <Text style={styles.colorSelectorTitle}>Choose background color</Text>
                            <View style={styles.colorSelector}>
                                <TouchableOpacity
                                    style={[styles.color, backgroundColors.black,
                                    color === backgroundColors.black.backgroundColor
                                        ? styles.colorSelected
                                        : {}
                                    ]}
                                    onPress={() =>
                                        setColor(backgroundColors.black.backgroundColor)
                                    }
                                />
                                <TouchableOpacity
                                    style={[styles.color, backgroundColors.grey,
                                    color === backgroundColors.grey.backgroundColor
                                        ? styles.colorSelected
                                        : {}
                                    ]}
                                    onPress={() =>
                                        setColor(backgroundColors.grey.backgroundColor)
                                    }
                                />
                                <TouchableOpacity
                                    style={[styles.color, backgroundColors.purple,
                                    color === backgroundColors.purple.backgroundColor
                                        ? styles.colorSelected
                                        : {}
                                    ]}
                                    onPress={() =>
                                        setColor(backgroundColors.purple.backgroundColor)
                                    }
                                />
                                <TouchableOpacity
                                    style={[styles.color, backgroundColors.green,
                                    color === backgroundColors.green.backgroundColor
                                        ? styles.colorSelected
                                        : {}
                                    ]}
                                    onPress={() =>
                                        setColor(backgroundColors.green.backgroundColor)
                                    }
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                signInUser(name, color);
                            }} >
                            <Text style={styles.btntext} >Start chatting</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        flex: 2,
        justifyContent: 'space-between',
        fontSize: 50,
        fontWeight: 600,
        textAlign: 'center',
        color: '#ffff',
        marginTop: 60
    },
    box: {
        height: "44%",
        width: "88%",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
        marginBottom: 15,
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        fontSize: 16,
        color: '#757083',
        paddingLeft: 36,
    },
    leftIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    colorSelectorWrapper: {
        width: "88%"
    },

    colorSelectorTitle: {
        fontSize: 16,
        color: '#757083',
    },
    colorSelector: {
        flexDirection: 'row'
    },

    color: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 8
    },
    button: {
        height: "20%",
        width: "88%",
        backgroundColor: '#757083',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btntext: {
        color: "#ffff",
        fontSize: 16,
        fontWeight: 600
    }
});

export default Start;