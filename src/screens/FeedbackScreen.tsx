import React, { useState } from 'react';
import {
  SafeAreaView,
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
import { useAppTheme } from '../hooks/useAppTheme';
import { Typography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import Navbar from '../components/Navbar';
import Divider from '../components/Divider';
import { useAuth } from '../context/AuthContext';
import { sendFeedback } from '../services/FeedbackService';

const FeedbackScreen = () => {
  const theme = useAppTheme();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'bug'|'suggestion'|'other'>('other');
  const [isLoading, setIsLoading] = useState(false);

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
              <Text style={[Typography.italic, { textAlign: 'center', fontSize: 22, fontWeight: '600', color: theme.auth.text }]}>
                Feedback
              </Text>
              <Divider />

              <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>Category</Text>
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

              <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>Message</Text>
              <TextInput
                style={[Layout.input, { height: 150, textAlignVertical: 'top', color: theme.auth.text }]}
                placeholder="Share your thoughts..."
                placeholderTextColor="#888"
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
                    alignItems: 'center'
                  }
                ]}
                disabled={isLoading || message.trim().length < 5}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.auth.text} />
                ) : (
                  <Text style={[Layout.buttonText, { color: theme.auth.text }]}>Send Feedback</Text>
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
