import React from 'react';
import { ExpoConfigView } from '@expo/samples';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Dimensions,
  AsyncStorage,
  FlatList
} from 'react-native';

import { NavigationEvents } from "react-navigation";
import { BeatHeader } from '../components/BeatHeader';
import { OptionsList } from '../components/OptionsList';
import { MangaList } from '../components/MangaList';
import { Icon } from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';

import PageView from '../components/PageView';

const fullWidth = Dimensions.get('screen').width;
const fullHeight = Dimensions.get('screen').height;

export default class DownloadsScreen extends React.Component {

  constructor() {

    super();

    this.state = {};

  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this._getDownloadedMangas();
  }

  async _getDownloadedMangas() {

    let keys = await AsyncStorage.getAllKeys();
    let mangaArray = [];

    for (let i = 0; i < keys.length; i++) {
      let manga = await AsyncStorage.getItem(keys[i]);

      try { manga = JSON.parse(manga) } catch (e) { continue };

      if (manga && manga.chapterDownloadList && Object.keys(manga.chapterDownloadList).length > 0) {  
        manga.selectedSource = keys[i].split("@")[0];
        mangaArray.push(manga)
      };
    };

    this.setState({ downloadedManga: mangaArray });
  };

  render() {

    return (
      <PageView>

        <NavigationEvents
          onWillFocus={payload => {
            this._getDownloadedMangas();
          }}
        />

        <BeatHeader />

        <MangaList
          data={this.state.downloadedManga}
          itemOnClick={this._openManga.bind(this)}
          listTitle={"Downloaded manga"}
        />

        <DropdownAlert
          ref={ref => this.dropdown = ref}
          translucent={true}
        />

      </PageView>
    )
  }

  _openManga(item) {

    item.localStored = true;

    this.props.navigation.navigate('MangaDetails', item);
  }

}


const styles = StyleSheet.create({});
