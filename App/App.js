import React, {Fragment, Component} from 'react';
import SmsAndroid  from 'react-native-get-sms-android';
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
import HomeScreen from './Components/HomeScreen';
import {expenseKeyWords, moneySymbol, ignoreExpenseKeyWords} from './Constants/appConstants';

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

export default class App extends Component {
  constructor(props){
     super(props);
     this.state = {
       isReadSmsPermissionGranted: false,
       count: "",
       smsList: []
     }
  }

  componentDidMount = () => {
    SplashScreen.hide();
    if (Platform.OS === 'android') {
      requestSmsReadPermission().then((bool) => {
        /* List SMS messages matching the filter */
        const date = new Date();
        const firstDayTime = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
        const filter = {
            box: 'inbox',
            minDate: firstDayTime,

            /** the next 2 filters can be used for pagination **/
            indexFrom: 0, // start from index 0
        };

        SmsAndroid.list(JSON.stringify(filter), (fail) => {
                console.log("Failed with this error: " + fail)
            },
            (count, smsList) => {
                const arr = JSON.parse(smsList);
                let finalList = [];
                const expense = arr.reduce((acc, list) => {
                    const bool = (list.address.length === 8 || list.address.length === 9) && expenseKeyWords.some(word => {
                      const strRegExPattern = '\\b'+word+'\\b';
                      return list.body.toLowerCase().match(new RegExp(strRegExPattern,'g'));
                    }) && !ignoreExpenseKeyWords.some((ignoreWord) => {
                      const strRegExPattern = '\\b'+ignoreWord+'\\b';
                      return list.body.toLowerCase().match(new RegExp(strRegExPattern,'g'));
                    });
                    let num = 0;
                    bool && moneySymbol.some((symbol) => {
                      num = Number(list.body.toLowerCase().split(symbol)[1] && list.body.toLowerCase().split(symbol)[1].replace(",", "").replace(/ /g, "").match(/\d+(\.?\d+)/)[0] || 0);
                      return num;
                    });
                    // let num = bool && list.body.match(/\d+.\d+/) && Number(list.body.match(/\d+.\d+/)[0]) || 0;
                    list.expenseMoney = num;
                    num && finalList.push(list);
                    return acc = acc + num;
                }, 0);
                this.setState({ count: count.toString(), smsList: finalList, expense: Math.round(expense) });
            });
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
        {this.state.isReadSmsPermissionGranted ? (this.state.smsList.length ? <HomeScreen smsList={this.state.smsList} expense={this.state.expense} /> : <View style={{backgroundColor: "steelblue", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}><Text style={{padding: 5, textAlign: "center", fontSize: 24, color: "white"}}>No Expense Messages to Read</Text></View>) : <View style={{backgroundColor: "steelblue", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}><Text style={{padding: 5, textAlign: "center", fontSize: 24, color: "white"}}>Read SMS Permission required.</Text></View>}
      </Fragment>
    );
  }
}
