import React from 'react';
import {
    Avatar,
    Button,
    Card,
    Title,
    Paragraph,
    List,
    withTheme
} from 'react-native-paper';
import HTML from 'react-native-render-html';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Share,
  StyleSheet,
  Alert,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
const cacheKey = 'CacheData';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class SinglePost extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isloading: true,
            post: [],
            already_bookmark: false,
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
        this.fetchPost().then(()=>{
          this.renderBookMark(this.props.navigation.getParam('post_id'));
        });
        this.NetworkHandler();
      }

    saveBookMark = async post_id => {
        this.setState({already_bookmark: true});
        await AsyncStorage.getItem('bookmark').then(token => {
          console.log("save bookmark", token);
            const res = JSON.parse(token);
            if (res !== null) {
              let data = res.find(value => value === post_id);
              if (data == null) {
                res.push(post_id);
                AsyncStorage.setItem('bookmark', JSON.stringify(res));
              }
            } else {
              let bookmark = [];
              bookmark.push(post_id);
              AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));
            }
        });
      };

      removeBookMark = async post_id => {
        this.setState({already_bookmark: false});
        const bookmark = await AsyncStorage.getItem('bookmark').then(token => {
          console.log("remove bookmark", token);
            const res = JSON.parse(token);
            return res.filter(e => e !== post_id);
        });
        await AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));
      };

      renderBookMark = async post_id => {
        await AsyncStorage.getItem('bookmark').then(token => {
          console.log("i am here", token);
            const res = JSON.parse(token);
            let data = res.find(value => value === post_id);
            console.log(data);
            
            return data == null
              ? this.setState({already_bookmark: false})
              : this.setState({already_bookmark: true});
        });
      };

      async fetchPost() {
        this.setState({isloading: true});
        let post_id = this.props.navigation.getParam('post_id');
        try {
          const networkState = await NetInfo.fetch();
    
          if (!networkState.isConnected) {
            const _cachedData = await AsyncStorage.getItem(cacheKey);
            if (!_cachedData) {
              Alert.alert(
                "You're currently offline and no local data was found.",
              );
            }
            const cachedData = JSON.parse(_cachedData);
    
            let post = cachedData.post.filter(value => value.id === post_id);
    
            this.setState({
              post: post,
              isloading: false,
              offline: true,
            });
            Alert.alert('You still read from cache')
          }
    
          const response = await fetch(
            `https://kriss.io/wp-json/wp/v2/posts?_embed&include=${post_id}`,
          );
          const post = await response.json();
          this.setState({
            post: post,
            isloading: false,
          });
        } catch (error) {
          console.log('got error', error);
          return Promise.reject(error);
        }
      }

    onShare = async (title, uri) => {
        Share.share({
          title: title,
          url: uri,
        });
      };

      
      render() {
        let post = this.state.post;
        const {colors} = this.props.theme;
        return (
          <ScrollView>
            {this.state.isloading ? (
              <View
                style={{
                  paddingVertical: 20,
                  borderTopWidth: 1,
                  borderColor: '#CED0CE',
                }}>
                <ActivityIndicator animating size="large" />
              </View>
            ) : (
              <Card style={styles.card}>
                <Card.Content>
                  <Title>{post[0].title.rendered} </Title>
                  <List.Item
                    title={`${
                      this.state.offline ? '' : post[0]._embedded.author[0].name
                    }`}
                    description={`${
                      this.state.offline
                        ? ''
                        : post[0]._embedded.author[0].description
                    }`}
                    left={props => {
                      return (
                        <Avatar.Image
                          {...props}
                          size={55}
                          source={{
                            uri: `${
                              this.state.offline
                                ? ''
                                : post[0]._embedded.author[0].avatar_urls[96]
                            }`,
                          }}
                        />
                      );
                    }}
                    right={props => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            this.onShare(post[0].title.rendered, post[0].link)
                          }>
                          <FontAwesome name="share" color={colors.text} size={30} />
                        </TouchableOpacity>
                      );
                    }}
                  />
                  <List.Item
                    title={`Published on ${moment(
                      post[0].date,
                      'YYYYMMDD',
                    ).fromNow()}`}
                    right={props => {
                      if (this.state.already_bookmark == false) {
                        return (
                          <TouchableOpacity
                            onPress={() => this.saveBookMark(post[0].id)}>
                            <FontAwesome name="bookmark" size={30} color={colors.text}/>
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <TouchableOpacity
                            onPress={() => this.removeBookMark(post[0].id)}>
                            <FontAwesome name="bookmark-o" size={30} color={colors.text}/>
                          </TouchableOpacity>
                        );
                      }
                    }}
                  />
                  <Paragraph />
                </Card.Content>
                <Card.Cover source={{uri: post[0].jetpack_featured_media_url}} />
                <Card.Content>
                  <HTML
                    html={post[0].content.rendered}
                    imagesInitialDimensions={{
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').width * 2,
                    }}
                    tagsStyles={{
                      p: {color: colors.text},
                      h1: {color: colors.text},
                      h2: {color: colors.text},
                      h3: {color: colors.text},
                      pre: {color: colors.accent},
                    }}
                  />
                </Card.Content>
              </Card>
            )}
          </ScrollView>
        );
      }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
  },
});

export default withTheme(SinglePost);