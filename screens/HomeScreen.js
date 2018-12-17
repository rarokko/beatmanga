import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import HerokuMangaApi from '../helpers/HerokuMangaApi';
import { SearchBar } from 'react-native-elements';
import { WebBrowser } from 'expo';
import { BeatHeader } from '../components/BeatHeader';
import { MangaList } from '../components/MangaList';
import { NavigationEvents } from "react-navigation";
import { ThemeContext } from '../constants/Themes';
import PageView from '../components/PageView';

export default class HomeScreen extends React.Component {

  constructor() {

    super();

    this.searchTimeout = null;

    this.state = {
      search: false,
      loading: true,
      searchMangaList: [],
      hotMangaList: [],
      mangaSource: ""
    };
    // AsyncStorage.clear();
  }

  _getMangas(selectedSource) {


    this.setState({ loading: true, selectedSource: selectedSource });

    HerokuMangaApi.getHotManga(selectedSource, (err, mangaList) => {

      this.setState({
        hotMangaList: mangaList,
        loading: false,
        selectedSource: selectedSource
      });

    });
  }

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  render() {

    return (
      <PageView>

        <NavigationEvents
          onWillFocus={payload => {

            AsyncStorage.getItem('selectedSource').then((selectedSource) => {

              if (selectedSource != this.state.selectedSource) {
                this._getMangas(selectedSource);
              } else if (selectedSource == "" || !selectedSource) {
                this.props.navigation.navigate('SettingsStack');
              };
            });

          }}
        />

        <BeatHeader />

        <SearchBar
          onChangeText={(text) => {

            if (text.trim() == "") {
              this._clearSearch();
              return;
            };

            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => { this._searchManga(text) }, 500)
          }}
          containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
          placeholder='Search for manga'
          clearIcon={true}
          onClear={() => { this._clearSearch() }}
        />

        {this.state.searchMangaList.length <= 0 &&
          <MangaList
            data={this.state.hotMangaList}
            itemOnClick={this._openManga.bind(this)}
            listTitle={"Popular manga"}
          />
        }

        {this.state.searchMangaList.length > 0 &&
          <MangaList
            data={this.state.searchMangaList}
            listTitle={"Search results"}
            itemOnClick={this._openManga.bind(this)}
          />
        }

        {this.state.loading &&
          <ActivityIndicator style={styles.loadingStyle} size="large" color="#ffffff" />
        }

      </PageView>
    );
  }

  _openManga(item) {

    this.props.navigation.navigate('MangaDetails', {
      ...item,
      selectedSource: this.state.selectedSource
    });
  }

  _clearSearch() {

    clearTimeout(this.searchTimeout);
    this.setState({ search: false, searchMangaList: [] })
  }

  _searchManga(keyword) {

    this.setState({ loading: true });

    HerokuMangaApi.searchManga(this.state.selectedSource, keyword, (err, mangaList) => {

      this.setState({
        search: true,
        loading: false,
        searchMangaList: mangaList
      });
    });
  }
}

const styles = StyleSheet.create({
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
