import React from 'react';
import { Button, Platform, StatusBar, StyleSheet, View, AsyncStorage, Modal, Text, TouchableHighlight } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { ThemeContext, Themes } from './constants/Themes';
import { NewsShowcase } from './components/NewsShowcase';

export default class App extends React.Component {

  constructor() {

    super();

    this.toggleTheme = (selectedTheme) => {
      Themes.currentTheme = Themes[selectedTheme];
      this.setState({ theme: Themes.currentTheme });
    };

    this.state = {
      isLoadingComplete: false,
      theme: Themes[Themes.currentTheme],
      toggleTheme: this.toggleTheme,
      packageVersion: "1.0",
      showNews: false
    };

    AsyncStorage.getItem('selectedTheme').then((selectedTheme) => {
      if (!selectedTheme) {
        selectedTheme = "light";
      }
      this.toggleTheme(selectedTheme);
    });

    AsyncStorage.getItem(`packageNews@${this.state.packageVersion}`).then((verify) => {
      if (!verify) {
        this.setState({ showNews: true })
      };
    });
  }



  render() {

    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <ThemeContext.Provider value={this.state}>
            <AppNavigator />
          </ThemeContext.Provider>

          <NewsShowcase
            version={"1.2"}
            updateTitle={"Special for my friend"}
            changeList={[
              'We did some minor fixes. You can now correctly delete your downloaded chapters.'
            ]}
          />

        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
