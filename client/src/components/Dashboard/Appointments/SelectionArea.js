import React, {Component} from 'react';
import {Input, Button, Loader, Dimmer} from 'semantic-ui-react';
import gql from "graphql-tag";
import {Query, ApolloConsumer} from "react-apollo";
import moment from 'moment';

export default class extends Component {
  constructor() {
    super();
  }

  render() {
    // return <div>Under construction</div>

    return (
      <ApolloConsumer>
        {(client) => {
          return <div className="selection-area">
              <a href="#" className="main-button-color" onClick={() => {
                // set the global date to be today
                let today = moment().format("L");
                // console.log(today);
                client.writeData({
                  data: {
                    currentDateSelection: today,
                    isAppointmentByDateTableLoading: true
                  }
                })

              }}>Today</a>
              <a href="#" className="main-button-color" onClick={() => {
                // set the global date to be today
                let today = moment().add(1, "day").format("L");
                // console.log(today);
                client.writeData({
                  data: {
                    currentDateSelection: today,
                    isAppointmentByDateTableLoading: true
                  }
                })
              }}>Tomorrow</a>
          </div>
        }}

      </ApolloConsumer>
    )
  }
}
