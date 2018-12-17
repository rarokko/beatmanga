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
  Modal,
  AsyncStorage,
  StatusBar
} from 'react-native';
import { Header } from 'react-native-elements';

import { BeatHeader } from '../components/BeatHeader';

import HerokuMangaApi from '../helpers/HerokuMangaApi';

import { WebBrowser } from 'expo';

import SideSwipe from 'react-native-sideswipe';
import ImageZoom from 'react-native-image-pan-zoom';
import ImageViewer from 'react-native-image-zoom-viewer';

import { MonoText } from '../components/StyledText';
import { FlatList } from 'react-native-gesture-handler';

const fullWidth = Dimensions.get('screen').width;
const fullHeight = Dimensions.get('screen').height;

const { height, width } = Dimensions.get('window');

export default class MangaDetails extends React.Component {

  constructor() {

    super()

    this.state = {
      showHeader: true,
      loading: true,
      currentIndex: 0,
      chapterData: {
        mangaPagesArray: []
      },
      selectedSource: ""
    };
  }

  async componentWillMount() {

    let selectedSource = this.props.navigation.state.params.selectedSource
    let chapterUrl = this.props.navigation.state.params.chapterUrl
    let mangaUrl = this.props.navigation.state.params.mangaUrl;
    let mangaStorageData = this.props.navigation.state.params.mangaStorageData;
    let mangaName = this.props.navigation.state.params.mangaName;
    let chapterName = this.props.navigation.state.params.chapterName;

    if (!mangaStorageData || mangaStorageData && !mangaStorageData.chapterReadList) {

      mangaStorageData = {
        ...this.props.navigation.state.params.mangaStorageData,
        chapterReadList: []
      };
    };

    if (mangaStorageData.chapterDownloadList && mangaStorageData.chapterDownloadList[chapterUrl]) {

      if (mangaStorageData.chapterReadList.indexOf(chapterUrl) < 0) {
        mangaStorageData.chapterReadList.push(chapterUrl);
      };

      AsyncStorage.setItem(`${selectedSource}@${mangaUrl}`, JSON.stringify(mangaStorageData))

      let pageList = mangaStorageData.chapterDownloadList[chapterUrl].pageList;

      if (pageList[0].url.indexOf(".txt") >= 0 ){
        for (let i = 0; i < pageList.length; i++) {
            pageList[i].url = await Expo.FileSystem.readAsStringAsync(pageList[i].url);
        }
      }

      this.setState({
        ...this.state,
        chapterData: {
          mangaPagesArray: mangaStorageData.chapterDownloadList[chapterUrl].pageList
        },
        loading: false,
        selectedSource: selectedSource,
        mangaUrl: mangaUrl,
        mangaName: mangaName,
        chapterName: chapterName
      });

    } else {

      HerokuMangaApi.getMangaPages(selectedSource, chapterUrl).then((chapterData) => {

        this.setState({
          ...this.state,
          chapterData: chapterData,
          loading: false,
          selectedSource: selectedSource,
          mangaUrl: mangaUrl,
          mangaName: mangaName,
          chapterName: chapterName
        });

        if (mangaStorageData.chapterReadList.indexOf(chapterUrl) < 0) {
          mangaStorageData.chapterReadList.push(chapterUrl);
        };

        AsyncStorage.setItem(`${selectedSource}@${mangaUrl}`, JSON.stringify(mangaStorageData))
      });
    }
  }

  static navigationOptions = {
    header: null,
  };

  render() {

    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>

        {this.state.chapterData.mangaPagesArray.length > 1 &&
          <ImageViewer
            index={this.state.currentIndex}
            imageUrls={this.state.chapterData.mangaPagesArray}
            saveToLocalByLongPress={false}
            renderIndicator={() => { }}
            onChange={(index) => { this.setState({ currentIndex: index }) }}
            onClick={(onCancel) => { this.setState({ showHeader: !this.state.showHeader }) }}
            pageAnimateTime={300}
            flipThreshold={200}
            maxOverflow={fullWidth}
            enablePreload={true}
          />
        }

        {this.state.showHeader &&
          <BeatHeader
            leftIcon={"navigate-before"}
            leftFunction={this.props.navigation.goBack.bind(this)}
            title={(this.state.currentIndex + 1) + " / " + (this.state.chapterData.mangaPagesArray.length)}
            position={"absolute"}
            top={0}
            left={0}
            right={0}
          />
        }

        {!this.state.showHeader &&
          <StatusBar
            hidden={true}
          />
        }

        {this.state.showHeader &&
          <View style={{ width: fullWidth, height: 60, position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#1f1f1f", flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#ffffff" }}>{this.state.mangaName}</Text>
            <Text style={{ color: "#ffffff" }}>{this.state.chapterName}</Text>
          </View>
        }

        {this.state.loading &&
          <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ActivityIndicator style={styles.loadingStyle} size="large" color="#000000" />
            <Text style={{ color: "#86939e", position: 'relative', top: -100, padding: 30 }}>Wait until this chapter is prepared.</Text>
          </View>
        }

      </View>
    );
  }

  _renderPage(page, index) {

    return (
      // <View>
      <Image key={index} resizeMode={'contain'} style={styles.mangaCover} source={{ uri: page }} />
      // </View>
    )
  }

  _renderHeader(index) {

    return (
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e'
  },
  mangaCover: {
    width: width,
    height: height
  },
  viewMangaCover: {
    marginTop: 30
  },
  loadingStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.1)'
  }
});

