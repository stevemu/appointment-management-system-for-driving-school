import React, {Component} from 'react';
import {MdClose} from 'react-icons/lib/md';
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Form, Checkbox} from 'semantic-ui-react';

import {GET_INSTRUCTOR, GET_INSTRUCTORS, UPDATE_INSTRUCTOR, DELETE_INSTRUCTOR, CREATE_INSTRUCTOR} from './queries';

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
    };
  }

  handleFieldChange = (e) => {
    let {name, value} = e.target;
    this.setState({ name: value, id: value });
  }

  render() {

    return (
      <div className="modal">
        <div className="edit-modal-wrapper">
          <header>
            <div>Add Instructor</div>
            <div><a href="" onClick={(e) => {
              if (e) e.preventDefault();
              this.props.history.goBack()
            }}><MdClose className="close"/></a></div>
          </header>
          <div className="content">
            <main>
              <Form
                autoComplete={"off"}
              >
                <Form.Input
                  label='Instructor Name'
                  control='input'
                  name="no"
                  value={this.state.name}
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
              mutation={CREATE_INSTRUCTOR}
              refetchQueries={[{
                query: GET_INSTRUCTORS
              }]}
            >
              {(createItem, {data, loading, error}) => {
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
                    createItem({variables: {instructorInput: this.state}});
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