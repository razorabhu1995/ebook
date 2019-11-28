import React, {Component, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

import HTMLRender from 'react-native-render-html';
import moment from 'moment';

export default ({item, navigation, textColor}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SinglePost', {
          post_id: item.id,
        })
      }>
      <Card
        style={[
          {
            shadowOffset: {width: 5, height: 5},
            width: '90%',
            borderRadius: 12,
            alignSelf: 'center',
            marginBottom: 10,
          },
        ]}>
        <Card.Content>
          <Title>{item.title.rendered}</Title>
          <Paragraph>Published on {moment(item.date).fromNow()}</Paragraph>
        </Card.Content>
        <Card.Cover source={{uri: item.jetpack_featured_media_url}} />
        <Card.Content>
          <Card.Content>
            <HTMLRender
              html={item.excerpt.rendered}
              tagsStyles={{p: {color: textColor}}}
            />
          </Card.Content>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  carddark: {
    backgroundColor: '#262525',
  },
  text: {
    fontSize: 18,
    color: '#212121',
  },
  textdark: {
    color: '#fff',
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  separatordark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});