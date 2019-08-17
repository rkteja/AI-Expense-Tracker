import React, {Component} from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableOpacity
  } from 'react-native';
  import {monthNames, monthNamesAlias} from '../Constants/appConstants';

export default class HomeScreen extends Component {
    render () {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <View style={{backgroundColor: "steelblue"}}>
                    <Text style={{padding: 5, color: "white"}}>{monthNames[new Date().getMonth()]}</Text>
                    <Text style={{fontSize: 26, padding:10, marginBottom:5, color: "white"}}>INR: {this.props.expense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
                <FlatList
                    data={this.props.smsList}
                    renderItem={({item}) => {
                        const d = new Date(item.date);
                        const displayDate = `${d.getDate()} ${monthNamesAlias[d.getMonth()]}, ${d.getHours().toString().length === 2 ? d.getHours() : '0' + d.getHours()}:${d.getMinutes().toString().length === 2 ? d.getMinutes() : '0' + d.getMinutes()}`;
                        return(
                            <TouchableOpacity>
                                <View style={{marginBottom: 5, display: "flex", flexDirection: 'row', justifyContent: "space-between"}}>
                                    <Text style={{fontWeight: "bold", color: "gray"}}>{item.address}</Text>
                                    <Text style={{fontWeight: "bold", color: "black"}}>INR: {item.expenseMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                    <Text style={{fontWeight: "bold", color: "gray"}}>{displayDate}</Text>
                                </View>
                                <View style={{marginBottom: 5}}>
                                    <Text style={{marginBottom: 1, fontSize:14, fontWeight: "bold", color: "gray"}}>Expense Message</Text>
                                    <Text style={{marginBottom: 5, fontSize:12, color: "black"}}>{item.body}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}