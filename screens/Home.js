import {View, Text, Button, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';

import {Colors} from '../utils/colors';
import ScreenIds from '../navigation/ScreenIds';
import homeScreenData from './homeScreenData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: Colors.backgroundColor,
      }}>
      <FlatList
        data={homeScreenData}
        renderItem={({item, index, separators}) => (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: '100%',
              borderWidth: 1,
              borderRadius: 15,
              padding: 5,
              borderColor: 'white',
            }}
            key={item.key}
            onPress={() => navigation.navigate(item.navId)}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Icon name={item.icon} size={120} color={'white'} />
              <Text style={{color: 'white'}}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Home;
