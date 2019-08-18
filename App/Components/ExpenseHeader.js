import React, {Component} from 'react';
import {
    Text,
    View
} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {monthNames} from '../Constants/appConstants';

export default class ExpenseHeader extends Component {
    render () {
        return (
            <View style={{backgroundColor: "steelblue"}}>
                <Text style={{padding: 5, color: "white"}}>{monthNames[new Date().getMonth()]}</Text>
                <Text style={{fontSize: 26, padding:10, marginBottom:5, color: "white"}}><IconFontAwesome name="rupee" size={24}/> {this.props.expense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
            </View>
        )
    }
}