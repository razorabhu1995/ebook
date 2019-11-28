import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';

import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  List,
  Headline,
} from 'react-native-paper';
import {withNavigationFocus} from 'react-navigation';
import HTMLRender from 'react-native-render-html'
import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
const cacheKey = 'Bookmark';

class Bookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmark_post: [],
      isFetching: false,
      offline : false
    };
  }

  async NetworkHandler() {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          throw new Error('Currently offline.');
        }
      })
      .catch(error => {
        console.log('list error', error);
        Alert.alert(
          'Sorry, something went wrong. Please try again',
          error.message,
        );
      });
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.fetchBookMark();
    });
    this.NetworkHandler();
  }

  async fetchBookMark() {

    try {
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected) {
        const _cachedData = await AsyncStorage.getItem(cacheKey);
        if (!_cachedData) {
          throw new Error(
            "You're currently offline and no local data was found.",
          );
        }

        console.log('cachedData', _cachedData);
        const cachedData = JSON.parse(_cachedData);

        this.setState({ bookmark_post: post, offline : true });
      }
      let bookmark = await AsyncStorage.getItem('bookmark').then(token => {
        console.log("here",token);
        
        const res = JSON.parse(token);
        if (res != null) {
          const result = res.map(post_id => {
            return 'include[]=' + post_id;
          });
          return result.join('&');
        } else {
          return null;
        }
      });
      const response = await fetch(
        `https://kriss.io/wp-json/wp/v2/posts?${bookmark}`
      );
      console.log(response);
      
      const post = await response.json();
      console.log(post);
      
      this.setState({ bookmark_post: post });
    } catch (error) {
      console.log('geoFetch error', error);
      return Promise.reject(error);
    }
    
  }

  render() {
    return (
      <View>
        <Headline style={{marginLeft: 30}}>Bookmark Post</Headline>
        <FlatList
          data={this.state.bookmark_post}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SinglePost', {
                  post_id: item.id,
                })
              }>
              <Card
                style={{
                  shadowOffset: {width: 5, height: 5},
                  width: '90%',
                  borderRadius: 12,
                  alignSelf: 'center',
                  marginBottom: 10,
                }}>
                <Card.Content>
                  <Title>{item.title.rendered}</Title>
                  <Paragraph>
                    Published on {moment(item.date).fromNow()}
                  </Paragraph>
                </Card.Content>
                <Card.Cover source={{uri: item.jetpack_featured_media_url}} />
                <Card.Content>
                  <Card.Content>
                    <HTMLRender html={item.excerpt.rendered} />
                  </Card.Content>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

}

export default withNavigationFocus(Bookmark);