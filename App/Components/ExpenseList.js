import React, {Component, Fragment} from 'react';
import {
    Text,
    View,
    TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import ExpenseHeader from "./ExpenseHeader";
import {monthNamesAlias, iconBackGroundColor} from '../Constants/appConstants';

export default class ExpenseList extends Component {
    getRandomIconBgColor = () => {
        return iconBackGroundColor[Math.floor(Math.random() * iconBackGroundColor.length)];
    }

    onExpensePress = (item, randomBgColor) => {
        this.props.navigation.navigate("ExpenseDetails", { item, randomBgColor });
        console.log(item, randomBgColor);
    }

    render () {
        return (
            <View style={{backgroundColor: "white", flex: 1}}>
                <ExpenseHeader expense={this.props.expense} />
                <ScrollView style={{margin: 5}}>
                    {
                        this.props.smsList.map((item, index) => {
                            const d = new Date(item.date);
                            const displayDate = `${d.getDate()} ${monthNamesAlias[d.getMonth()]}, ${d.getHours().toString().length === 2 ? d.getHours() : '0' + d.getHours()}:${d.getMinutes().toString().length === 2 ? d.getMinutes() : '0' + d.getMinutes()}`;
                            const iconCircleText = item.address.length === 8 ? item.address.substring(2, 3).toUpperCase() : item.address.substring(3, 4).toUpperCase();
                            const randomBgColor = this.getRandomIconBgColor();
                            return(
                                <Fragment>
                                    <TouchableOpacity key={index.toString() + item["_id"]} onPress={() => this.onExpensePress(item, randomBgColor)}>
                                        <View style={{flexDirection: "row"}}>
                                            <View style={{...styles.iconCircle, backgroundColor: randomBgColor}}>
                                                <Text style={{fontWeight: "bold", color: "#ffffff", fontSize: 20}}>{iconCircleText}</Text>
                                            </View>
                                            <View style={{marginLeft: 10, flex: 2}}>
                                                <Text style={{color: "gray", fontSize: 15}}>Spent</Text>
                                                <Text style={{color: "black", fontSize: 18}}>
                                                    <IconFontAwesome name="rupee" /> {item.expenseMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={{color: "gray", justifyContent: 'flex-end', fontSize: 15}}>{displayDate}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View key={item["_id"]} style={{ borderBottomColor: '#e4e6e88a', borderBottomWidth: 1, marginTop: 10, marginBottom: 10}}>
                                    </View>
                                </Fragment>
                            )
                        })
                    }
                </ScrollView>
            </View>
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