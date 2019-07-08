import React, { Component } from 'react';
import { Input, Button, Loader, Dimmer } from 'semantic-ui-react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Label } from 'semantic-ui-react'



export default class extends Component {
  constructor() {
    super();

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <Label>
          Ann
        </Label>
        <Label>
          Peter
        </Label>
        <Label>
          John
        </Label>
      </div>
    )
  }
}
