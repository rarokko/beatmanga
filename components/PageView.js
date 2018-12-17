import React from 'react';
import { Header, Icon } from 'react-native-elements';
import { FlatList, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { ThemeContext, Themes } from '../constants/Themes';

export default class PageView extends React.Component {

  constructor() {

    super();
  }

  render() {

    if (this.props.scrollView == "true") {
      return (
        <ThemeContext.Consumer>
          {contextState =>
            <ScrollView style={{ backgroundColor: contextState.theme.bgColor, flex: 1 }}>
              {this.props.children}
            </ScrollView>
          }
        </ThemeContext.Consumer>
      )
    } else {
      return (
        <ThemeContext.Consumer>
          {contextState =>
            <View style={{ backgroundColor: contextState.theme.bgColor, flex: 1 }}>
              {this.props.children}
            </View>
          }
        </ThemeContext.Consumer>
      )
    }
  }
}

const styles = StyleSheet.create({
});
