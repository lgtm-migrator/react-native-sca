import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

// importing styles
import styles from './styles';
import Styles from '../../Styles';

// importing firebase
import * as firebase from 'firebase';

// importing components
import ButtonLogin from '../../components/ButtonLarge';

const {height, width} = Dimensions.get('window');

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.opacity = new Animated.Value(0);

    this.starting = () => {
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };

    this.fromY = this.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [height / 3, 0],
    });

    this.closing = () => {
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        props.navigation.navigate('LandingScreen');
        return;
      });
    };

    this.emailInput = null;
    this.passwordInput = null;
    this.nameInput = null;
  }

  setEmail = (userEmail) => {
    if (userEmail === '') {
      this.setState({email: ''});
    }
    this.setState({email: userEmail});
  };

  setPassword = (userPassword) => {
    if (userPassword === '') {
      this.setState({password: ''});
    }
    this.setState({password: userPassword});
  };

  onSubmitSignIn = () => {
    const {email, password} = this.state;
    if (!email) {
      Alert.alert('Invalid Credentials', 'Please Provide an Email!', [
        {text: 'ok', onPress: () => this.emailInput.focus()},
      ]);
      return;
    }

    if (!password || password.length > 40 || password.length < 6) {
      Alert.alert(
        'Invalid Credentials',
        'Please make sure your password is in the range of 6 to 40 characters!',
        [{text: 'ok', onPress: () => this.passwordInput.focus()}],
      );
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (userObject) => {
        this.props.navigation.navigate(' Home ');
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert('Problem logging In', error.message, [{text: 'ok'}]);
        return;
      });
  };

  render() {
    this.starting();
    return (
      <>
        <View style={Styles.containerLoginSign}>
          <Animated.View
            style={[
              styles.signInFormContainer,
              {
                transform: [
                  {
                    translateY: this.fromY,
                  },
                ],
                opacity: this.opacity,
              },
            ]}>
            <TouchableOpacity
              onPress={() => this.closing()}
              style={[styles.closeBtn, Styles.buttonShadow]}>
              <Text>x</Text>
            </TouchableOpacity>
            <TextInput
              ref={(input) => {
                this.emailInput = input;
              }}
              placeholder="Email"
              style={Styles.textInput}
              placeholderTextColor="black"
              onChangeText={(email) => this.setEmail(email)}
              value={this.state.email}
            />
            <TextInput
              ref={(input) => {
                this.passwordInput = input;
              }}
              placeholder="Password"
              style={Styles.textInput}
              placeholderTextColor="black"
              onChangeText={(password) => this.setPassword(password)}
              value={this.state.password}
            />
            <ButtonLogin onPress={this.onSubmitSignIn} title="Login" />
          </Animated.View>
        </View>
      </>
    );
  }
}

export default SignInScreen;
