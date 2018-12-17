import React from 'react';
import { Header, Icon } from 'react-native-elements';
import { FlatList, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { ThemeContext, Themes } from '../constants/Themes';

export default class OptionsList extends React.Component {

  constructor() {

    super();

    this.state = {
      selectedItem: null,
      theme: null
    }
  }

  render() {

    return (
      <ThemeContext.Consumer>
        {contextState =>


          <View>
            {/* {console.warn(contextState.theme)} */}
            <View style={{ borderBottomWidth: 1, borderBottomColor: contextState.theme.bgColor, }}>
              <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>{this.props.listTitle}</Text>
            </View>
            <FlatList
              extraData={this.state}
              data={this.props.data}
              keyExtractor={(source, index) => `${source.id}${index}`}
              renderItem={(source) => this._renderOptions(source, this.props)}
            />
          </View>
        }
      </ThemeContext.Consumer>
    )
  }

  _renderOptions(source, props) {

    return (
      <ThemeContext.Consumer>
        {contextState =>
          <TouchableHighlight onPress={() => props.itemOnClick(source.item)}>
            <View style={{
              ...styles.listItem,
              borderBottomColor: contextState.theme.bgColor,
              color: contextState.theme.primaryText,
              backgroundColor: contextState.theme.alternative
            }}>

              <Text style={{ ...styles.textList, color: contextState.theme.primaryText }}>{source.item.name}</Text>
              {this.state.selectedItem == source.item.id &&
                <View style={{ position: 'absolute', right: 15 }}>
                  <Icon name='check' color={contextState.theme.primaryText} />
                </View>
              }

            </View>
          </TouchableHighlight>
        }
      </ThemeContext.Consumer>
    )
  }

  componentWillReceiveProps(props) {

    this.setState({ selectedItem: props.selectedItem });
  }
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  textList: {
    paddingLeft: 15
  },
  textTitle: {
    padding: 15,
    fontSize: 20,
    fontWeight: 'bold',
  }
});
