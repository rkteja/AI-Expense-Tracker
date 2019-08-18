import React, {Fragment, Component} from 'react';
import SmsListener from 'react-native-android-sms-listener';
import SplashScreen from 'react-native-splash-screen';
import {
  PermissionsAndroid,
  Text,
  View,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import ExpenseScreen from './Screens/ExpenseScreen';
import ExpenseDetailsScreen from './Screens/ExpenseDetailsScreen';

async function requestSmsReadPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'Read SMS Permission',
        message: 'AI Expense Tracker Requires Read SMS Permission',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED
  } catch (err) {
    console.warn(err);
    return false;
  }
}

async function requestSmsRecievePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      {
        title: 'Recieve SMS Permission',
        message: 'AI Expense Tracker Requires Recieve SMS Permission',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const NavigatorStack = createStackNavigator({
    Expense: ExpenseScreen,
    ExpenseDetails: ExpenseDetailsScreen
},{
    initialRouteName: "Expense"
});

const MainNavigation = createAppContainer(NavigatorStack);

export default class App extends Component {
  constructor(props){
     super(props);
     this.state = {
        isReadSmsPermissionGranted: false
     }
  }

  componentDidMount = () => {
    SplashScreen.hide();
    if (Platform.OS === 'android') {
      requestSmsReadPermission().then((bool) => {
          this.setState({isReadSmsPermissionGranted: bool});
      });

      requestSmsRecievePermission().then(() => {
        this.SMSReadSubscription = SmsListener.addListener(message => {
          console.log(message);
        });
      });

    } else {
      Alert.alert(
        'Not Supported',
        `Not Supported on ${Platform.OS.toUpperCase()} Platform`,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
  }

  render() {
    return (
      <Fragment>
        <StatusBar backgroundColor="steelblue" barStyle="light-content" />
        {this.state.isReadSmsPermissionGranted ? <MainNavigation /> : <View style={{backgroundColor: "steelblue", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}><Text style={{padding: 5, textAlign: "center", fontSize: 24, color: "white"}}>Read SMS Permission required.</Text></View>}
      </Fragment>
    );
  }
}
