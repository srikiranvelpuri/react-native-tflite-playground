import {NativeModules} from 'react-native';
const BertQuestionAnswerer = NativeModules.BertQuestionAnswerer;

export const askBert = (context = '', question = '') => {
  return BertQuestionAnswerer.getAnswer(context, question);
};
