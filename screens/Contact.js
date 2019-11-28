import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    Alert,
    ActivityIndicator,
    Image,
  } from 'react-native';
  import firebase from 'react-native-firebase'
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import t from 'tcomb-form-native'; // 0.6.9
const Form = t.form.Form;
const Email = t.refinement(t.String, email => {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; //or any other regexp
  return reg.test(email);
});

const options = {
    fields: {
      email: {
        error: 'Insert a valid email',
      },
      message: {
        multiline: true,
        stylesheet: {
          ...Form.stylesheet,
          textbox: {
            ...Form.stylesheet.textbox,
            normal: {
              ...Form.stylesheet.textbox.normal,
              height: 150,
            },
            error: {
              ...Form.stylesheet.textbox.error,
              height: 150,
            },
          },
        },
      },
    },
  };
  
  export default class Contact extends Component {
    constructor(props) {
      super(props);
      this.state = {
        submit: false
      };
    }

    handleSubmit = async () => {
        // this.setState({submit: true});
        const value = this._form.getValue();
        console.log(value)
        firebase
        .database()
        .ref('contact/')
        .push(value)
        .then(res => {
            Alert.alert('thank for reaching me')
        })
        .catch(err => {
            console.error(err);
        });
    }

    render() {
        const Form = t.form.Form;
        const ContactForm = t.struct({
          email: t.String,
          name: t.String,
          message: t.String,
        });
        return (
          <View style={styles.container}>
            <Form type={ContactForm} options={options} ref={c => (this._form = c)}/>
            <TouchableHighlight
              ref="form"
              style={styles.button}
              onPress={this.handleSubmit}
              underlayColor="#99d9f4">
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
          </View>
        );
    }
  }
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});  
