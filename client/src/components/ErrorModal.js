import React, {Component} from 'react';
import {MdClose} from 'react-icons/lib/md';
import gql from "graphql-tag";
import {Query, Mutation, ApolloConsumer} from "react-apollo";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Form, Checkbox, Loader, Input, Dropdown, Dimmer, Search, Label} from 'semantic-ui-react'
import moment from 'moment';
import queryString from '../query-string';

export default class extends Component {

  render() {

    return (
      <Query query={gql`
      query @client {
        error
      }
      `}>
        {({loading, error, data}) => {

          return (
            <div id="error" style={{display: data.error == "" ? 'none' : "flex"}}>

              <Mutation mutation={gql`
                  mutation {
                    clearError @client
                  }

                `}>
                {(clearError) => {

                  return (
                    <a href="#" onClick={async (e) => {
                      if (e) e.preventDefault();
                      clearError();

                    }}><MdClose className="close"/></a>
                  )
                }}
              </Mutation>
              <div>{data.error}</div>
            </div>
          )
        }}
      </Query>

    )

  }
}