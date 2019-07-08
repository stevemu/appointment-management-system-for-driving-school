import React, {Component} from 'react';
import {ApolloProvider} from "react-apollo";
import 'react-dates/initialize';

import './App.css';
import Routes from './components/routes';
import {getUrl, defaults, client} from "./utils";

console.log('node env:');
console.log(process.env.NODE_ENV);

class App extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Routes />
      </ApolloProvider>
    );
  }
}

export default App;
