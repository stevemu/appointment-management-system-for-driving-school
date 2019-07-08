import React, { Component } from 'react';
import { Input, Button, Loader, Dimmer } from 'semantic-ui-react';
import gql from "graphql-tag";
import { Query } from "react-apollo";

import NewButton from '../lib/NewButton';
import Table from './Table';

export default class extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="dashboard-main-wrapper">
        <NewButton
          {...this.props}
          route={`/new-student`}
          text="New Student"
        />
        <Table
          rowClickHandler={(item) => {
            let { id } = item;
            this.props.history.push(`${this.props.match.path}/` + id);
          }}
        />
      </div>
    )
  }
}
