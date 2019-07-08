// show an picker on the page


import React, {Component} from 'react';
import {DayPickerSingleDateController} from 'react-dates';
import { Query, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import moment from 'moment';
import {GET_APPOINTMENTS_BY_DATE} from "../queries";

export default class extends Component {
  constructor() {
    super();

    this.state = {
      focused: false
    }
  }

  updateTableData = async (L) => {

    // show loading
    this.client.writeData({
      data: {
        isAppointmentByDateTableLoading: true
      }
    });


    // query backend
    let res = await this.client.query({
      query: GET_APPOINTMENTS_BY_DATE,
      variables: {
        date: L
      }
    });

    // console.log(res);

    // write to the global store
    this.client.writeData({
      data: {
        currentAppointmentsByDateTableData: res.data.appointmentsByDate,
        isAppointmentByDateTableLoading: false
      }
    });

  };

  render() {
    return (

      <Query query={gql`
        query {
            currentDateSelection @client
        }

      `}>
        {({data, client}) => {

          this.client = client;

          // convert to moment format
          let md = moment(data.currentDateSelection, "L");

          return (
            <DayPickerSingleDateController
              date={md}
              onDateChange={date => {
                // convert the moment to L format
                let L = date.format("L");

                // update the date in the global state
                // make it loading so that the other component and fetch the data
                client.writeData({
                  data: {
                    currentDateSelection: L,
                    isAppointmentByDateTableLoading: true
                  }
                });

                // this.updateTableData(L);

              }}
              focused={this.state.focused}
              onFocusChange={({focused}) => this.setState({focused})}
            />
          )
        }}


      </Query>

    )
  }
}
