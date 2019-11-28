import React, {Component} from 'react';

import {
  FlatList,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  List,
  Headline,
} from 'react-native-paper';

import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
const cacheKey = 'CategoriesCache';


export default class Categories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      categories: [],
      offline : false
    };
  }

  componentDidMount() {
    this.fetchCategorie();
    this.NetworkHandler();
  }

  async NetworkHandler() {
    NetInfo.fetch()
      .then(state => {
        console.log(state);
        
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

  async fetchCategorie() {
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

        this.setState({
          categories: categories,
          offline: true,
        });
      }
      this.setState({ loading: true });
        const response = await fetch(`https://kriss.io/wp-json/wp/v2/categories`);
        const categories = await response.json();
        console.log("here", categories);
        
        this.setState({
          categories: categories
        });
    } catch (error) {
      console.log('geoFetch error', error);
      return Promise.reject(error);
    }

    
  }

  render() {
    return (
      <ScrollView>
        <FlatList
          data={this.state.categories}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('CategorieList', {
                  categorie_id: item.id,
                  title : item.name
                })
              }>
              <Card>
                <Card.Content>
            <Title>{item.name}</Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index}
        />
      </ScrollView>
    );
  }
}
