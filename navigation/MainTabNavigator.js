import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MangaDetails from '../screens/MangaDetails';
import MangaReader from '../screens/MangaReader';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DownloadsScreen from '../screens/DownloadsScreen';

const screensHideTab = [
  'MangaReader'
]

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  MangaDetails: MangaDetails,
  MangaReader: MangaReader
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  navigation.state.routes.map((route) => {
    screensHideTab.indexOf(route.routeName) >= 0 ? tabBarVisible = false : tabBarVisible = true;
  });

  return {
    tabBarVisible,
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          Platform.OS === 'ios'
            ? `ios-book`
            : 'md-book'
        }
      />
    )
  };
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  )
};

const DownloadsStack = createStackNavigator({
  Downloads: DownloadsScreen,
  MangaDetails: MangaDetails,
  MangaReader: MangaReader
});

DownloadsStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  
  navigation.state.routes.map((route) => {
    screensHideTab.indexOf(route.routeName) >= 0 ? tabBarVisible = false : tabBarVisible = true;
  });

  return {
    tabBarVisible,
    tabBarLabel: 'Downloads',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? 'ios-download' : 'md-download'}
      />
    )
  }
};

export default createBottomTabNavigator({
  HomeStack,
  DownloadsStack,
  SettingsStack,
},
  {
    tabBarOptions: {
      style: {
        backgroundColor: "#1f1f1f"
      }
    }
  });
