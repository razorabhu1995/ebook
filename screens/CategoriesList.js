import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import moment from 'moment';
import HTML from 'react-native-render-html';
export default class CategorieList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    this.fetchPost();
  }

  async fetchPost() {
    let categorie_id = this.props.navigation.getParam('categorie_id');
    const response = await fetch(
      `https://kriss.io/wp-json/wp/v2/posts?categories=${categorie_id}`,
    );
    const post = await response.json();
    this.setState({posts: post});
  }

  render() {
    categorie_title = this.props.navigation.getParam('title');
    return (
      <View>
        <Title style={{marginLeft: 30}} >{categorie_title}</Title>
        <FlatList
          data={this.state.posts}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SinglePost', {
                  post_id: item.id,
                })
              }>
              <Card>
                <Card.Content>
                  <Title>{item.title.rendered}</Title>
                  <Paragraph>
                    Published on {moment(item.date, 'YYYYMMDD').fromNow()}
                  </Paragraph>
                </Card.Content>
                <Card.Cover source={{uri: item.jetpack_featured_media_url}} />
                <Card.Content>
                  <HTML html={item.excerpt.rendered} />
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