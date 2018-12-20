import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import { Header, Icon } from 'react-native-elements';
import HerokuMangaApi from '../helpers/HerokuMangaApi';
import { WebBrowser } from 'expo';
import { BeatHeader } from '../components/BeatHeader';
import { NavigationEvents } from "react-navigation";
import { FlatList } from 'react-native-gesture-handler';
import DropdownAlert from 'react-native-dropdownalert';
import PageView from '../components/PageView';
import { ThemeContext, Themes } from '../constants/Themes';

const fullWidth = Dimensions.get('screen').width;
const fullHeight = Dimensions.get('screen').height;

export default class MangaDetails extends React.Component {

  constructor() {

    super()

    this.state = {
      loading: true,
      mangaInfo: {
        chapterList: []
      },
      mangaSeen: [],
      selectedSource: "",
      mangaStorageData: {
        chapterReadList: [],
        chapterDownloadList: {}
      }
    };
  }

  async componentWillMount() {

    let selectedSource = this.props.navigation.state.params.selectedSource;
    let mangaUrl = this.props.navigation.state.params.mangaUrl;
    let mangaStorageData = await AsyncStorage.getItem(`${selectedSource}@${mangaUrl}`);

    if (this.props.navigation.state.params.localStored) {
      this._mountDownloaded(this.props.navigation.state.params, mangaStorageData);
      return;
    };

    //Await
    let mangaInfo = await HerokuMangaApi.getMangaInfo(selectedSource, mangaUrl);

    //If no data from AsyncStorage, creates new object
    if (!mangaStorageData) {
      mangaStorageData = {
        mangaName: this.props.navigation.state.params.mangaName,
        mangaImage: this.props.navigation.state.params.mangaImage,
        mangaUrl: mangaUrl,
        chapterReadList: [],
        chapterDownloadList: {}
      };
      mangaStorageData = JSON.stringify(mangaStorageData);
    };

    console.warn("state 1");

    //Sets initial state
    this.setState({
      mangaInfo: mangaInfo,
      loading: false,
      selectedSource: selectedSource,
      mangaUrl: mangaUrl,
      mangaStorageData: JSON.parse(mangaStorageData)
    })
  };

  static navigationOptions = {
    header: null,
  };

  render() {

    return (
      <ThemeContext.Consumer>
        {contextState =>
          <PageView>

            <NavigationEvents
              onWillFocus={payload => {
                this._updateMangaStorageData();
              }}
            />

            <BeatHeader
              leftIcon={"navigate-before"}
              leftFunction={this.props.navigation.goBack.bind(this)}
            />

            <FlatList
              style={styles.mangaWrapper}
              indicatorStyle={"white"}
              data={this.state.mangaInfo.chapterList}
              keyExtractor={(item, index) => `${item.chapterName}index`}
              renderItem={({ item }) => this._renderMangaChapter(item)}
              ListHeaderComponent={() => {
                return (
                  <View style={styles.mangaInfo}>
                    <Image style={styles.mangaCover} source={{ uri: this.props.navigation.state.params.mangaImage }} />
                    <View style={styles.mangaInfoText}>
                      <Text style={{ ...styles.mangaName, color: contextState.theme.primaryText }}>{this.state.mangaName}</Text>

                      {!this.state.localStored &&
                        <View>
                          <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>Author:</Text>
                          <Text style={{ ...styles.textInfo, color: contextState.theme.primaryText }}>{this.state.mangaInfo.authorName}</Text>
                          <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>Status:</Text>
                          <Text style={{ ...styles.textInfo, color: contextState.theme.primaryText }}>{this.state.mangaInfo.statusName}</Text>
                          <Text style={{ ...styles.textTitle, color: contextState.theme.primaryText }}>Last Updated:</Text>
                          <Text style={{ ...styles.textInfo, color: contextState.theme.primaryText }}>{this.state.mangaInfo.lastUpdatedName}</Text>
                        </View>
                      }

                    </View>
                  </View>
                )
              }
              }
            />

            {this.state.loading &&
              <ActivityIndicator style={styles.loadingStyle} size="large" color="#ffffff" />
            }

            <DropdownAlert
              ref={ref => this.dropdown = ref}
              translucent={true}
              closeInterval={10000}
            />

          </PageView>
        }
      </ThemeContext.Consumer>
    );
  };

  async _updateMangaStorageData() {

    let selectedSource = this.props.navigation.state.params.selectedSource;
    let mangaUrl = this.props.navigation.state.params.mangaUrl;
    let mangaStorageData = await AsyncStorage.getItem(`${selectedSource}@${mangaUrl}`);

    this.setState({ mangaStorageData: JSON.parse(mangaStorageData) });

  };

  _renderMangaChapter(item) {

    let readCheck = false;

    if (this.state.mangaStorageData && this.state.mangaStorageData.chapterReadList) {
      readCheck = this.state.mangaStorageData.chapterReadList.indexOf(item.chapterUrl) >= 0 ? true : false;
    };

    return (
      <ThemeContext.Consumer>
        {contextState =>
          <TouchableHighlight onPress={() => this._openMangaChapter(item)}>
            <View style={{ ...styles.listItem, borderBottomColor: contextState.theme.alternative }}>

              <Text style={[styles.chapterTitle, readCheck ? { color: contextState.theme.subColor } : { color: contextState.theme.primaryText }]}>{item.chapterName}</Text>
              <View style={{ position: 'absolute', right: 0 }}>

                <View style={{ width: 50, height: 40, alignItems: "center", flex: 1, flexDirection: 'row', justifyContent: "center" }}>
                  {(this.state.mangaStorageData && this.state.mangaStorageData.chapterDownloadList && this.state.mangaStorageData.chapterDownloadList[item.chapterUrl] && this.state.mangaStorageData.chapterDownloadList[item.chapterUrl].downloading == true) ?
                    <Text style={{ color: contextState.theme.primaryText }}>{
                      parseInt((this.state.mangaStorageData.chapterDownloadList[item.chapterUrl].pageList.length / this.state.mangaStorageData.chapterDownloadList[item.chapterUrl].pageCount) * 100)
                    }%</Text>
                    :
                    <TouchableHighlight onPress={this.state.localStored || this.state.mangaStorageData && this.state.mangaStorageData.chapterDownloadList && this.state.mangaStorageData.chapterDownloadList[item.chapterUrl] ? () => this._deleteChapter(item) : () => this._downloadChapter(item)}>
                      <Icon color={contextState.theme.primaryText} name={this.state.localStored || this.state.mangaStorageData && this.state.mangaStorageData.chapterDownloadList && this.state.mangaStorageData.chapterDownloadList[item.chapterUrl] ? 'clear' : 'archive'} />
                    </TouchableHighlight>
                  }
                </View>

              </View>
            </View>
          </TouchableHighlight>
        }
      </ThemeContext.Consumer>
    );
  };

  async _deleteChapter(item) {

    let selectedSource = this.state.selectedSource;
    let chapterUrl = item.chapterUrl;
    let mangaStorageData = this.state.mangaStorageData;
    let mangaInfo = this.state.mangaInfo;
    let mangaUrl = this.state.mangaUrl;

    await Expo.FileSystem.deleteAsync(`${Expo.FileSystem.documentDirectory}downloadedChapters/${selectedSource}${chapterUrl}`, { idempotent: true });

    if (this.state.localStored) {

      mangaInfo.chapterList = mangaInfo.chapterList.filter((value, index) => {
        if (value.chapterName != item.chapterName) {
          return value;
        };
      });
    };

    delete mangaStorageData.chapterDownloadList[chapterUrl];

    console.warn(`${selectedSource}@${mangaUrl}`);

    await AsyncStorage.setItem(`${selectedSource}@${mangaUrl}`, JSON.stringify(mangaStorageData));
    
    this.setState({ mangaStorageData: mangaStorageData, mangaInfo: mangaInfo });
  };

  async _downloadChapter(item) {

    let selectedSource = this.state.selectedSource;
    let chapterUrl = item.chapterUrl;
    let mangaStorageData = this.state.mangaStorageData;
    let mangaName = mangaStorageData.mangaName;
    let mangaImage = mangaStorageData.mangaImage;
    let imageName = mangaImage.substring(mangaImage.lastIndexOf("/"), mangaImage.length);
    let coverUri = `${Expo.FileSystem.documentDirectory}covers/${selectedSource}`;
    let chapterUri = `${Expo.FileSystem.documentDirectory}downloadedChapters/${selectedSource}${chapterUrl}`;

    //Create initial object for that chapter
    mangaStorageData.chapterDownloadList[chapterUrl] = {
      downloading: true,
      chapterName: item.chapterName,
      pageList: [],
      pageCount: 1
    };

    console.warn("state 4");

    //Set state so the page can show the user that the download is beginning
    this.setState({ mangaStorageData: mangaStorageData });

    try {
      //Create directory for cover
      await Expo.FileSystem.makeDirectoryAsync(coverUri, { intermediates: true });
    } catch (e) { }

    //Download cover
    let coverResp = null;
    try {
      coverResp = await Expo.FileSystem.downloadAsync(mangaImage, `${coverUri}${imageName}`);
      mangaStorageData.mangaImage = coverResp.uri;
    } catch (e) {

    }

    try {
      //Create directory for chapter
      await Expo.FileSystem.makeDirectoryAsync(chapterUri, { intermediates: true });
    } catch (e) { }

    //Get all pages url
    let chapterData = await HerokuMangaApi.getMangaPages(selectedSource, chapterUrl)

    mangaStorageData.chapterDownloadList[chapterUrl].pageCount = chapterData.mangaPagesArray.length;

    this.setState({ mangaStorageData: mangaStorageData });

    for (let i = 0; i < chapterData.mangaPagesArray.length; i++) {

      let mangaPage = chapterData.mangaPagesArray[i].url;
      let pageFileName = mangaPage.substring(mangaPage.lastIndexOf("/"), mangaPage.length);

      this._downloadPage(mangaPage, selectedSource, chapterUrl, pageFileName, item, i);
    };
  };

  async _downloadPage(mangaPage, selectedSource, chapterUrl, pageFileName, item, i) {

    let base64verifier = mangaPage.substring(0, 4) == "data" ? true : false;
    let targetUri = `${Expo.FileSystem.documentDirectory}downloadedChapters/${selectedSource}${chapterUrl}`;

    if (base64verifier) {

      targetUri = `${Expo.FileSystem.documentDirectory}downloadedChapters/${selectedSource}${chapterUrl}/${i}.txt`;

      try {
        await Expo.FileSystem.writeAsStringAsync(targetUri, mangaPage)
        this._finishedPageDownload(item, targetUri, i);
      } catch (e) {
        this._deleteChapter(item);
      }
      // mangaPage = mangaPage.substring(mangaPage.indexOf(";base64,") + 8, mangaPage.length);
      // this.dropdown.alertWithType('info', `Download not available.`, "We are sorry. This manga source is not available to download manga chapters. You can try another source or read it online.");

    } else {

      targetUri = `${Expo.FileSystem.documentDirectory}downloadedChapters/${selectedSource}${chapterUrl}${pageFileName}`;

      try {
        let responseDownload = await Expo.FileSystem.downloadAsync(mangaPage, targetUri);
        this._finishedPageDownload(item, responseDownload.uri, i);
      } catch (e) {
        this._deleteChapter(item);
      };
    }
  };

  async _finishedPageDownload(item, uri, i) {

    let mangaStorageData = this.state.mangaStorageData;

    if (!mangaStorageData.chapterDownloadList || !mangaStorageData.chapterDownloadList[item.chapterUrl] || !mangaStorageData.chapterDownloadList[item.chapterUrl].pageList) {
      return;
    };

    //Add the page to the pages list
    mangaStorageData.chapterDownloadList[item.chapterUrl].pageList[i] = { url: uri };

    let lengthTester = mangaStorageData.chapterDownloadList[item.chapterUrl].pageList.reduce((acc, cv) => (cv) ? acc + 1 : acc, 0);

    if (lengthTester == mangaStorageData.chapterDownloadList[item.chapterUrl].pageCount) {

      mangaStorageData.chapterDownloadList[item.chapterUrl].downloading = false;

      let selectedSource = this.state.selectedSource;
      let mangaUrl = this.state.mangaUrl;

      console.warn(mangaStorageData);

      await AsyncStorage.setItem(`${selectedSource}@${mangaUrl}`, JSON.stringify(mangaStorageData));
    };

    this.setState({ mangaStorageData: mangaStorageData });
  }

  _mountDownloaded(item, mangaStorageData) {

    var chapterList = [];

    Object.keys(item.chapterDownloadList).forEach((key, index) => {
      chapterList.push({
        chapterName: item.chapterDownloadList[key].chapterName,
        chapterUrl: key
      });
    });

    chapterList.sort((a, b) => (a.chapterName < b.chapterName) ? 1 : ((b.chapterName < a.chapterName) ? -1 : 0));

    this.setState({
      localStored: true,
      loading: false,
      selectedSource: item.selectedSource,
      mangaUrl: item.mangaUrl,
      mangaInfo: {
        chapterList: chapterList
      }
    });
  }

  _openMangaChapter(item) {

    this.props.navigation.navigate('MangaReader', {
      mangaName: this.state.mangaName,
      chapterName: item.chapterName,
      chapterUrl: item.chapterUrl,
      selectedSource: this.state.selectedSource,
      mangaUrl: this.state.mangaUrl,
      mangaStorageData: this.state.mangaStorageData
    });
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
  },
  mangaWrapper: {
    padding: 15,
    marginBottom: 15
  }
});
