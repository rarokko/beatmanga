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
import OptionsList from '../components/OptionsList';
import PageView from '../components/PageView';
import { Icon } from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
import { ThemeContext, Themes } from '../constants/Themes';

const fullWidth = Dimensions.get('screen').width;
const fullHeight = Dimensions.get('screen').height;

export default class SettingsScreen extends React.Component {

  constructor() {

    super();

    this.state = {
      source: {
        selectedSource: null,
        availableSources: [
          {
            name: 'Central de Mangás (PT-BR)',
            id: 'centralDeMangas'
          },
          {
            name: 'Manga Reader (EN-US)',
            id: 'mangaReader'
          }
        ]
      },
      theme: {
        selectedTheme: null,
        availableThemes: [
          {
            name: 'Night mode',
            id: 'nightmode'
          },
          {
            name: 'Light',
            id: 'light'
          }
        ]
      }
    };

  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {

    AsyncStorage.getItem('selectedSource').then((selectedSource) => {
      this.setState({ source: { selectedSource: selectedSource, availableSources: this.state.source.availableSources } });
    });

    AsyncStorage.getItem('selectedTheme').then((selectedTheme) => {
      this.setState({ theme: { selectedTheme: selectedTheme, availableThemes: this.state.theme.availableThemes } });
    });
  }

  render() {

    return (
      <ThemeContext.Consumer>
        {({theme, toggleTheme}) => (

        <PageView>

          <BeatHeader />

          <OptionsList
            data={this.state.source.availableSources}
            listTitle={"Sources"}
            itemOnClick={this._sourcePress.bind(this)}
            selectedItem={this.state.source.selectedSource}

          />

          <OptionsList
            data={this.state.theme.availableThemes}
            listTitle={"Themes"}
            itemOnClick={this._themePress.bind(this, toggleTheme)}
            selectedItem={this.state.theme.selectedTheme}

          />

          <DropdownAlert
            ref={ref => this.dropdown = ref}
            translucent={true}
          />

        </PageView>

      )}
      </ThemeContext.Consumer>
    )
  }

  _sourcePress(source) {

    AsyncStorage.setItem('selectedSource', source.id).then(() => {
      this.dropdown.alertWithType('info', `${source.name} set as current source.`, "You can now tap 'home' on bottom menu and check for available mangas.");
      this.setState({ source: { selectedSource: source.id, availableSources: this.state.source.availableSources } });
    });
  }

  _themePress(toggleTheme, theme) {

    AsyncStorage.setItem('selectedTheme', theme.id).then(() => {
      this.dropdown.alertWithType('info', `${theme.name} set as current theme.`, `You can change themes anytime you want.`);
      this.setState({ theme: { selectedTheme: theme.id, availableThemes: this.state.theme.availableThemes } });

      toggleTheme(theme.id);
    });
  }

}


const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 0,
  },
  listItem: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    color: "#ffffff",
    flexDirection: 'row'
  },
  textList: {
    paddingLeft: 15
  },
  textTitle: {
    padding: 15,
    fontSize: 20,
    fontWeight: 'bold',
    // borderBottomWidth: 1
  },
});
