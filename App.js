import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Colors} from './utils/colors';
import ScreenIds from './navigation/ScreenIds';

import Home from './screens/Home';
import BertQA from './screens/BertQA';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.headerColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name={ScreenIds.Home}
          component={Home}
          options={{title: ScreenIds.Home}}
        />
        <Stack.Screen
          name={ScreenIds.BertQuestionAnswerer}
          component={BertQA}
          options={{
            title: ScreenIds.BertQuestionAnswerer,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
