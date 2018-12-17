import React from 'react';
import { ScrollView, View, Image, Text, FlatList } from 'react-native';
import { Header } from 'react-native-elements';

export class MangaProfile extends React.Component {
    render() {
        return (
            <ScrollView style={styles.mangaDetails}>
                <View style={styles.mangaInfo}>
                    <Image style={styles.mangaCover} source={{ uri: this.props.mangaImage }} />
                    <View style={styles.mangaInfoText}>
                        <Text style={{ ...styles.mangaName, color: contextState.theme.primaryText }}>{this.props.mangaName}</Text>

                            {!this.props.localStored &&
                            <View>
                                <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>Author:</Text>
                                <Text style={{ ...styles.textInfo, color: contextState.theme.primaryText }}>{this.props.authorName}</Text>
                                <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>Status:</Text>
                                <Text style={{ ...styles.textInfo, color: contextState.theme.primaryText }}>{this.props.statusName}</Text>
                                <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>Last Updated:</Text>
                                <Text style={{ ...styles.textInfo, color: contextState.theme.primaryText }}>{this.props.lastUpdatedName}</Text>
                            </View>
                        }

                    </View>
                </View>
                <FlatList
                    indicatorStyle={"white"}
                    data={this.state.mangaInfo.chapterList}
                    keyExtractor={(item, index) => `${item.chapterName}index`}
                    renderItem={({ item }) => this._renderMangaChapter(item)}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  textTitle: {
    fontWeight: 'bold'
  },
  textInfo: {
    marginBottom: 7,
    color: "#86939e"
  },
  horizontalList: {
    flex: 1,
    marginRight: 15,
  },
  mangaCover: {
    width: 122,
    height: 193
  },
  mangaDetails: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingRight: 15
  },
  mangaName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
    color: "#86939e"
  },
  mangaInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mangaInfoText: {
    flex: 1,
    marginLeft: 15
  },
  chapterList: {
    marginBottom: 50
  },
  chapterTitle: {
    marginTop: 7,
    marginBottom: 7,
    marginRight: 50,
    fontSize: 16
  },
  chapterArea: {
    flex: 1,
    margin: 15
  },
  loadingStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.1)'
  },
  listItem: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row'
  }
});

