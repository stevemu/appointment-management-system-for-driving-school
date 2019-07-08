import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter} from "react-router-dom";
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {ApolloLink} from 'apollo-link';
import {withClientState} from 'apollo-link-state';
import {ApolloProvider} from "react-apollo";
import gql from 'graphql-tag';
import 'react-dates/initialize';
import moment from 'moment';
import {onError} from "apollo-link-error";
import {GET_STUDENTS} from "./components/Dashboard/Students/queries";

export function getUrl() {
  // if (process.env.NODE_ENV === "production") {
  //   // console.log('use prod url');
  //   return "https://metro-api.stevemu.com/graphql";
  // }
  // else {
  //   // console.log('use dev url');
  //   return "http://localhost:4000/graphql";
  // }

  return "/graphql";
}

export let defaults = {

  // students
  isCurrentStudentTableDataLoading: true,
  currentStudentTableData: {
    pages: 0,
    page: 0,
    students: []
  },
  lastStudentTableDataQueryParams: {
    page: 0,
    pageSize: 0,
    filter: {
      filters: [] // id & value
    },
  },

  //appointments by date
  isAppointmentByDateTableLoading: true,
  currentAppointmentsByDateTableData: [],
  currentDateSelection: moment().format("L"),

  //error
  // error: "Network error here!",
  error: ""
};


const cache = new InMemoryCache({
  addTypename: false
});

const resolvers = {
  Mutation: {
    refetchStudentTableData: async (_, variables, context) => {
      let {cache} = context;

      // show loading

      cache.writeData({
        data: {
          isCurrentStudentTableDataLoading: true
        }
      });

      // get lastStudentTableDataQueryParams
      let {lastStudentTableDataQueryParams} = cache.readQuery({
        query: gql`
            query {
                lastStudentTableDataQueryParams @client {
                    page
                    pageSize
                    filter {
                        filters {
                            id
                            value
                        }
                    }
                }
            }
        `
      });

      // get data from backend api
      let res = await client.query({
        query: GET_STUDENTS,
        variables: lastStudentTableDataQueryParams,
        fetchPolicy: "network-only"
      });

      let currentStudentTableData = res.data.students;

      // update currentStudentTableData
      cache.writeData({
        data: {
          currentStudentTableData,
          isCurrentStudentTableDataLoading: false
        }
      });

      return null;
    },
    clearError: (_, variables, {cache}) => {
      cache.writeData({
        data: {
          error: ""
        }
      })
    }
  }
};

const typeDefs = `
`;

// links

const errorLink = onError(({graphQLErrors, networkError}) => {
  // if (graphQLErrors) {
  //   console.log('graphql error');
  //   graphQLErrors.map(({message, locations, path}) =>
  //     console.log(
  //       `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
  //     ),
  //   );
  // }
  //
  if (networkError) {
    console.log(`[My Network error]: ${networkError}`);
    client.writeData({
      data: {
        error: "Network Error!"
      }
    })
  }
});

const httpLink = createHttpLink({
  uri: getUrl()
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      token: token ? `${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: ApolloLink.from([,
    withClientState({
      defaults,
      resolvers,
      cache,
      typeDefs
    }),
    errorLink,
    authLink.concat(httpLink),
  ]),
  cache
});
