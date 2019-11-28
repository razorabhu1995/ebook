import React from 'react';
import {List} from 'react-native-paper'
import NetInfo from '@react-native-community/netinfo';
import {Text, StyleSheet} from 'react-native';

export default class NetworkProvider extends React.Component {
    state = {
      isConnected: true,
    };
  
    componentDidMount() {
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this.handleConnectivityChange,
      );
    }
  
    componentWillUnmount() {
      NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this.handleConnectivityChange,
      );
    }
  
    handleConnectivityChange = isConnected => {
      this.setState({isConnected});
      console.log(this.state.isConnected);
    };

    render() {
        const iconPrefix = Platform.OS === 'ios' ? 'ios' : 'md';
        return this.state.isConnected ? (
          <Text></Text>
        ) : (
          <List.Item
          title="Offline mode"
          left={() => <List.Icon  icon="airplane-off" />}
          
        />
        );
      }
    
}

const styles = StyleSheet.create({

    offLine: {
      marginRight: 15,
      flexDirection: 'row',
    },
  });