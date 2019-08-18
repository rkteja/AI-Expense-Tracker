import React, {Component, Fragment} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Switch
} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {monthNamesAlias} from '../Constants/appConstants';

export default class ExpenseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpense: true
        };
    }
    expenseChange = (value) => {
        this.setState({
            isExpense: value
        });
    }

    render () {
        const d = new Date(this.props.item.date);
        const displayDate = `${d.getDate()} ${monthNamesAlias[d.getMonth()]}, ${d.getHours().toString().length === 2 ? d.getHours() : '0' + d.getHours()}:${d.getMinutes().toString().length === 2 ? d.getMinutes() : '0' + d.getMinutes()}`;
        const iconCircleText = this.props.item.address.length === 8 ? this.props.item.address.substring(2, 3).toUpperCase() : this.props.item.address.substring(3, 4).toUpperCase();
        return (
            <Fragment>
                <View style={{backgroundColor: "steelblue", flexDirection: "row", padding: 10}}>
                    <View style={{...styles.iconCircle, backgroundColor: this.props.randomBgColor}}>
                        <Text style={{fontWeight: "bold", color: "#ffffff", fontSize: 20}}>{iconCircleText}</Text>
                    </View>
                    <View style={{marginLeft: 10, flex: 3}}>
                        <Text style={{color: "#ffffff", fontSize: 12}}>{displayDate}</Text>
                        <Text style={{color: "#ffffff", fontSize: 15}}>Spent {this.props.item.address}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{color: "#ffffff", fontSize: 20, justifyContent: 'flex-end'}}>
                            <IconFontAwesome name="rupee" size={20} /> {this.props.item.expenseMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                    </View>
                </View>
                <View style={{padding: 10}}>
                    <View style={{backgroundColor: "#ffffff", flexDirection: "row"}}>
                        <View style={{marginLeft: 10, flex: 3}}>
                            <Text>Expense</Text>
                            <Text style={{color: "gray", fontSize: 10}}>
                                {
                                    this.state.isExpense ? "Will be counted in total spends" : "Will not be counted in total spends"
                                }
                            </Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Switch value={this.state.isExpense} style={{justifyContent: "flex-end"}} thumbColor="steelblue" onValueChange={this.expenseChange} />
                        </View>
                    </View>
                    <View style={{ borderBottomColor: '#e4e6e88a', borderBottomWidth: 1, marginTop: 10, marginBottom: 10}}></View>
                    <View style={{backgroundColor: "#ffffff"}}>
                        <Text>Expense Message</Text>
                        <Text style={{color: "#4b00ff"}}>{this.props.item.body}</Text>
                    </View>
                    <View style={{ borderBottomColor: '#e4e6e88a', borderBottomWidth: 1, marginTop: 10, marginBottom: 10}}></View>
                </View>
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
	iconCircle:{
        width: 40,
	    height: 40,
        borderRadius: 40/2,
	    justifyContent: "center",
	    alignItems: "center"
	}
});