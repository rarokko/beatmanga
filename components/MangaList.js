import React from 'react';
import { Header } from 'react-native-elements';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  Dimensions,
  View,
  FlatList,
  Image
} from 'react-native';
import { ThemeContext, Themes } from '../constants/Themes';

const fullWidth = Dimensions.get('screen').width;
const fullHeight = Dimensions.get('screen').height;


export class MangaList extends React.Component {

  render() {


    return (

      <ThemeContext.Consumer>
        {contextState =>
          <View
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            {/* {this.props.listTitle &&
              <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>{this.props.listTitle}</Text>
            } */}
            <FlatList
              style={styles.horizontalList}
              data={this.props.data}
              numColumns={3}
              ListHeaderComponent={() => { return(
                
              <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>{this.props.listTitle}</Text>
            
              )}  }
              columnWrapperStyle={styles.columnStyle}
              keyExtractor={(item, index) => `${item.mangaName}index`}
              renderItem={({ item }) => this._renderManga(item, this.props, contextState)}
            />
          </View>
        }
      </ThemeContext.Consumer>
    )
  }

  _renderManga(item, props) {

    return (
      <ThemeContext.Consumer>
        {contextState =>
          <View style={styles.mangaCoverView}>
            <TouchableHighlight onPress={() => props.itemOnClick(item)}>
              <Image style={{ ...styles.mangaCover, borderColor: contextState.theme.alternative }} source={{ uri: item.mangaImage }} />
            </TouchableHighlight>
            <View style={{
              backgroundColor: contextState.theme.alternative,
              padding: 7,
              flexWrap: "wrap",
              width: (fullWidth / 3 - 20),
              flex: 1
            }}>
              <Text numberOfLines={2} style={{ ...styles.mangaName, color: contextState.theme.primaryText }}>{item.mangaName}</Text>
            </View>
          </View>
        }
      </ThemeContext.Consumer>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 125
  },
  textTitle: {
    padding: 15,
    fontSize: 28,
    fontWeight: 'bold'
  },
  horizontalList: {
    paddingRight: 15,
  },
  mangaCover: {
    width: (fullWidth / 3 - 20),
    height: (fullWidth / 3 - 20) * 1.57,
    resizeMode: 'cover',
    borderWidth: 1
  },
  mangaCoverView: {
    paddingLeft: 15
  },
  mangaName: {
    width: (fullWidth / 3 - 20),
    paddingRight: 10
  },
  columnStyle: {
    marginBottom: 15
  }
});