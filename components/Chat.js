import { useState, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc, where } from "firebase/firestore";
import CustomActions from './CustomActions';
import AsyncStorage from '@react-native-async-storage/async-storage'
import MapView from 'react-native-maps';


const Chat = ({ db, route, navigation, isConnected, storage }) => {
    const { userID, name, color } = route.params;
    const [messages, setMessages] = useState([]);

    //is called when a user sends a message
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    }

    //cachedMessages is initialized to null, which is the correct type for the value returned by AsyncStorage.getItem. 
    //Then, if cachedMessages is truthy (i.e., not null), the cached messages will be parsed and set with setMessages.
    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        if (cachedMessages) {
            setMessages(JSON.parse(cachedMessages));
        }
    }

    let unsubscribe;

    useEffect(() => {
        if (isConnected === true) {
            //fetch messages from the database in real time
            //declared messagesRef and q constants to make it easier to construct the query
            const messagesRef = collection(db, "messages");
            const q = query(messagesRef, orderBy("createdAt", "desc"));
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messages = querySnapshot.docs.map((doc) => {
                    const firebaseData = doc.data();

                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date(),
                        ...firebaseData,
                    };

                    data.createdAt = data.createdAt.toDate();

                    return data;
                });
                cacheMessages(messages);
                setMessages(messages);
            });
        } else loadCachedMessages();
        //make sure that the onSnapshot() listener is cleaned up when the component unmounts
        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, [isConnected]);

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [])

    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }

    //cache messages 
    //only call AsyncStorage.setItem() if listsToCache is an array
    const cacheMessages = async (messagesToCache) => {
        try {
            if (Array.isArray(messagesToCache)) {
                await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
            } else {
                console.log('messagesToCache is not an array');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    const renderCustomActions = (props) => {
        return <CustomActions
            {...props}
            storage={storage} />;
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    return (
        <View
            style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;