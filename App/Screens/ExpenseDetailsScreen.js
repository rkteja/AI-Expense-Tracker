import React, {Component} from 'react';
import ExpenseDetails from "../Components/ExpenseDetails";

export default class ExpenseScreen extends Component {
    static navigationOptions = () => ({
        title: "Expense Details",
        headerStyle: {
            backgroundColor: '#4682b4e8'
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
            color: "#ffffff"
        }
    })

    render() {
        return(
            <ExpenseDetails navigation={this.props.navigation} item={this.props.navigation.getParam("item")} randomBgColor={this.props.navigation.getParam("randomBgColor")} />
        )
    }
}