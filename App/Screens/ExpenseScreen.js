import React, {Component} from 'react';
import {
    Text,
    View
  } from 'react-native';
import SmsAndroid  from 'react-native-get-sms-android';
import {expenseKeyWords, moneySymbol, ignoreExpenseKeyWords} from '../Constants/appConstants';
import ExpenseList from "../Components/ExpenseList";

export default class ExpenseScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
           count: "",
           smsList: [],
           expense: "",
           initialising: true
        }
     }

    static navigationOptions = () => ({
        header: null
    })

     componentDidMount() {
        const date = new Date();
        const firstDayTime = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
        const filter = {
            box: 'inbox',
            minDate: firstDayTime,
            indexFrom: 0
        };

        SmsAndroid.list(JSON.stringify(filter), (fail) => {
                console.log("Failed with this error: " + fail);
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
                this.setState({ count: count.toString(), smsList: finalList, expense: Math.round(expense), initialising: false });
            });
     }

     render() {
         return(
            !this.state.initialising ? (this.state.smsList.length ? <ExpenseList smsList={this.state.smsList} expense={this.state.expense} navigation={this.props.navigation} /> : <View style={{backgroundColor: "steelblue", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}><Text style={{padding: 5, textAlign: "center", fontSize: 24, color: "white"}}>No Expense Messages</Text></View>) : <View style={{backgroundColor: "steelblue", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}><Text style={{padding: 5, textAlign: "center", fontSize: 24, color: "white"}}>Reading Expense Messages</Text></View>
         )
     }
}