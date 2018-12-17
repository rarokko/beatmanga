import React from 'react';
import { Header } from 'react-native-elements';

export class BeatHeader extends React.Component {
  render() {
    return (
      <Header
        outerContainerStyles={{ borderBottomWidth: 0 }}
        containerStyle={{ borderBottomWidth: 0 }}
        leftComponent={this.props.leftIcon ? { icon: this.props.leftIcon, size: 50, color: '#fff', onPress: () => { this.props.leftFunction() } } : {}}
        centerComponent={{ text: this.props.title ? this.props.title : 'Beatmanga', style: { color: '#fff', fontSize: 20 } }}
        backgroundColor={'#1f1f1f'}
        position={this.props.position}
        top={this.props.top}
        left={this.props.left}
        right={this.props.right}
        bottom={this.props.bottom}
        statusBarProps={this.props.statusBarProps}
      />
    )
  }
}
