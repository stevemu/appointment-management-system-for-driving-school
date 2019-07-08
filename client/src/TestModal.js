import React, { Component } from 'react';
import { MdClose } from 'react-icons/lib/md';
import { Query, Mutation } from "react-apollo";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Form, Checkbox } from 'semantic-ui-react';

export default class extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="modal">
        modal here
      </div>
    )

  }
}