import React, { Component } from 'react';
import { MdClose } from 'react-icons/lib/md';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Form, Checkbox} from 'semantic-ui-react';

import {GET_CAR, GET_CARS, DELETE_CAR, UPDATE_CAR, CREATE_CAR} from './queries';

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      no: "",
    };
  }

  handleFieldChange = (e) => {
    let { name, value } = e.target;
    this.setState({ no: value, id: value });
  }

  render() {

    return (
      <div className="modal">
        <div className="edit-modal-wrapper">
          <header>
            <div>Add Car</div>
            <div><a href="" onClick={(e) => {
              if (e) e.preventDefault();
              this.props.history.goBack()
            }}><MdClose className="close" /></a></div>
          </header>

          <div className="content">
            <main>
              <Form
                autoComplete={"off"}
              >
                <Form.Input
                  label='Car No.'
                  control='input'
                  name="no"
                  value={this.state.no}
                  width={15}
                  onChange={this.handleFieldChange}
                />
              </Form>
            </main>

          </div>

          <footer>
            <a href="" className="cancel" onClick={(e) => {
              if (e) e.preventDefault();
              this.props.history.goBack();
            }}>Cancel</a>
            <Mutation
              mutation={CREATE_CAR}
              refetchQueries={ [{
                query: GET_CARS
              }]}
            >
              {(create, { data, loading, error }) => {
                // console.log(data);
                if (loading) return <div>Saving...</div>
                if (error) return <div>Error!</div>

                // if mutation is successful, go back to previous page
                if (data) {
                  this.props.history.goBack();
                }

                return (
                  <a href="" className="save" onClick={(e) => {
                    e.preventDefault();
                    create({ variables: { carInput: this.state } });
                  }}>Save</a>
                )
              }}
            </Mutation>
          </footer>
        </div>
      </div>
    )

  }
}