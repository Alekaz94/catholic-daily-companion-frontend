import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';
import { useTypography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import Navbar from '../components/Navbar';
import Divider from '../components/Divider';
import { sendFeedback } from '../services/FeedbackService';
import { useRequireAuth } from '../hooks/useRequireAuth';

const FeedbackScreen = () => {
  const theme = useAppTheme();
  const user = useRequireAuth();
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'bug'|'suggestion'|'other'>('other');
  const [isLoading, setIsLoading] = useState(false);
  const Typography = useTypography();

  if(!user) {
    return null;
  }

  const handleSend = async () => {
    if (message.trim().length < 5) {
      Alert.alert('Feedback too short', 'Please type at least 5 characters.');
      return;
    }
    try {
      setIsLoading(true);
      await sendFeedback({
        category,
        message,
        email: user?.email
      });
      Alert.alert('Thank you!', 'Your feedback has been sent.');
      setMessage('');
      setCategory('other');
    } catch (error) {
      console.error('Feedback send error', error);
      Alert.alert('Error', 'Could not send feedback. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.auth.navbar }}>
      <View style={{ flex: 1 }}>
        <Navbar />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: theme.auth.background }}>
            <View style={Layout.container}>
              <Text style={[Typography.title, { textAlign: 'center', fontWeight: '600', color: theme.auth.text }]}>
                Feedback
              </Text>
              <Divider />

              <Text style={[Typography.label, {fontWeight: 'bold', marginVertical: 20, color: theme.auth.text }]}>Category</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity onPress={() => setCategory('suggestion')} style={{ marginRight: 20 }}>
                  <Text style={{ 
                    color: category === 'suggestion' ? theme.auth.text : '#888',
                    borderWidth: category === "suggestion" ? 1 : 0,
                    padding: 5,
                    borderRadius: 6
                  }}>
                    Suggestion
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCategory('bug')} style={{ marginRight: 20 }}>
                  <Text style={{ 
                    color: category === 'bug' ? theme.auth.text : '#888',
                    borderWidth: category === "bug" ? 1 : 0,
                    padding: 5,
                    borderRadius: 6
                  }}>
                    Bug
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCategory('other')}>
                  <Text style={{ 
                    color: category === 'other' ? theme.auth.text : '#888', 
                    borderWidth: category === "other" ? 1 : 0,
                    padding: 5,
                    borderRadius: 6
                  }}>
                    Other
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[Typography.label, {fontWeight: 'bold', marginVertical: 20, color: theme.auth.text }]}>Message</Text>
              <TextInput
                style={[Layout.input, { height: 150, textAlignVertical: 'top', color: "black" }]}
                placeholder="Share your thoughts..."
                placeholderTextColor="black"
                multiline
                value={message}
                onChangeText={setMessage}
              />

              <TouchableOpacity
                onPress={handleSend}
                style={[
                  Layout.button,
                  {
                    backgroundColor: message.trim().length >= 5 ? theme.auth.navbar : '#ccc',
                    marginTop: 30,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }
                ]}
                disabled={isLoading || message.trim().length < 5}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.auth.text} />
                ) : (
                  <Text style={[Typography.label, { color: theme.auth.text }]}>Send Feedback</Text>
                )}
              </TouchableOpacity>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
