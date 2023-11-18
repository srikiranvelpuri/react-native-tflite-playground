import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import React, {useRef, useState} from 'react';

import {Colors} from '../utils/colors';
import {StyleSheet} from 'react-native';
import {askBert} from '../utils/BertQAHelper';

const ContextContainer = ({context = '', setContext = text => {}}) => {
  const [editable, setEditable] = useState(false);
  const contextRef = useRef(null);
  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
        <Text style={styles.header}>Context</Text>
      </View>
      <View style={styles.contextContainer}>
        <TextInput
          ref={contextRef}
          placeholder="Please provide context!"
          value={context}
          onChangeText={text => setContext(text)}
          style={styles.text}
          multiline
          editable={editable}
          autoCapitalize="sentences"
          onBlur={() => setEditable(false)}
        />
      </View>
      <View style={{alignItems: 'flex-end'}}>
        {editable ? (
          <TouchableOpacity
            onPress={() => setEditable(false)}
            style={styles.buttonContainer}>
            <Icon
              name="content-save-outline"
              size={22}
              color="white"
              style={styles.iconPadding}
            />
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              contextRef.current.focus &&
                setTimeout(() => contextRef.current.focus(), 0);
              setEditable(true);
            }}
            style={styles.buttonContainer}>
            <Icon
              name="file-document-edit-outline"
              size={22}
              color="white"
              style={styles.iconPadding}
            />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const MessageInput = ({
  question = '',
  context = '',
  setQuestion = text => {},
}) => {
  const [inputHeight, setInputHeight] = useState(50);
  const [loading, setLoading] = useState(false);
  const disableInput = question.trim() === '' || context === '';
  const maxInputHeight = 100;

  const getAnswerFromContext = async () => {
    try {
      setLoading(true);
      const res = await askBert(context, question);
      const probableAnswer =
        (res?.[0] && res[0]?.text) || 'Unable to find an answer!';

      setTimeout(() => {
        ToastAndroid.show(probableAnswer, ToastAndroid.LONG);
        setLoading(false);
        setQuestion('');
      }, 700);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendPress = () => {
    getAnswerFromContext();
    if (question.trim() !== '') {
      Keyboard.dismiss();
      setInputHeight(50);
    }
  };

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    // Limit the input container height to a maximum of 4 lines
    setInputHeight(Math.min(maxInputHeight, Math.max(50, contentHeight)));
  };

  return (
    <View style={[styles.textContainer, {height: inputHeight}]}>
      <TextInput
        style={[styles.input, {minHeight: inputHeight}]}
        placeholder="Type your query..."
        value={question}
        onChangeText={text => setQuestion(text)}
        onContentSizeChange={e =>
          handleContentSizeChange(
            e.nativeEvent.contentSize.width,
            e.nativeEvent.contentSize.height,
          )
        }
        multiline
        autoCapitalize="sentences"
        maxHeight={maxInputHeight}
      />
      {!loading ? (
        <TouchableOpacity onPress={handleSendPress} disabled={disableInput}>
          <Icon
            name="send"
            size={24}
            color="white"
            style={disableInput ? styles.disabled : styles.active}
          />
        </TouchableOpacity>
      ) : (
        <ActivityIndicator size="small" color="white" />
      )}
    </View>
  );
};

const BertQA = ({navigation}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [context, setContext] = useState('');
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.mainContainer}
      keyboardShouldPersistTaps="always">
      <ContextContainer context={context} setContext={setContext} />
      <MessageInput
        question={question}
        context={context}
        setQuestion={setQuestion}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: Colors.backgroundColor,
  },
  contextContainer: {
    flex: 0.8,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    padding: 5,
    width: '100%',
    height: '60%',
    borderWidth: 1,
    borderColor: 'gray',
  },
  textContainer: {
    flexDirection: 'row',
    flex: 0.1,
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    borderColor: 'gray',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  text: {
    color: 'white',
  },
  buttonContainer: {
    borderColor: 'white',
    borderWidth: 1,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 5,
  },
  iconPadding: {
    paddingRight: 4,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textTransform: 'capitalize',
  },
  disabled: {
    opacity: 0.4,
  },
  active: {
    opacity: 1,
  },
});

export default BertQA;
