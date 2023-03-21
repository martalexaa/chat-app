import { useState, useEffect } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";


const Chat = ({ db, route, navigation }) => {
    const { userID, name, color } = route.params;
    const [messages, setMessages] = useState([]);

    //is called when a user sends a message
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    }

    useEffect(() => {
        //fetch messages from the database in real time
        //declared messagesRef and q constants to make it easier to construct the query
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
            setMessages(messages);
        });
        //make sure that the onSnapshot() listener is cleaned up when the component unmounts
        return unsubscribe;
        //the empty dependency array ensures that this code only runs once when the component mounts
    }, []);

    useEffect(() => {
        navigation.setOptions({ title: name });
    });

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


    return (
        <View
            style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
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