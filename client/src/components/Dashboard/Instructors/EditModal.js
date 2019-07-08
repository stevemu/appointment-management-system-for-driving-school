import React, {Component} from 'react';
import {MdClose} from 'react-icons/lib/md';
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Form, Checkbox} from 'semantic-ui-react';

import {GET_INSTRUCTOR, GET_INSTRUCTORS, UPDATE_INSTRUCTOR, DELETE_INSTRUCTOR, CREATE_INSTRUCTOR} from './queries';

export default class extends Component {

  constructor() {
    super();
  }

  render() {

    return (
      <Query
        query={GET_INSTRUCTOR}
        variables={{id: this.props.match.params.id}}
        fetchPolicy="network-only"
      >
        {({loading, error, data}) => {
          if (loading) {
            return <div>Loading...</div>
          }
          if (error) {
            return <div>Error: {error.message}</div>;
          }
          let {instructor: item} = data;

          // remove extra properties
          let {
            Symbol,
            __typename,
            ...itemOnly,
          } = item;

          return (
            <Edit {...this.props} item={itemOnly}/>
          )
        }}

      </Query>
    );
  }
}

class Edit extends Component {

  constructor(props) {
    super(props);

    this.state = props.item;
    // console.log(props);
  }

  handleFieldChange = (e) => {
    let {name, value} = e.target;
    this.setState({[name]: value});
  }

  render() {

    return (
      <div className="modal">
        <div className="edit-modal-wrapper">
          <header>
            <div>Edit Instructor</div>
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
                  name="name"
                  value={this.state.name}
                  width={15}
                  onChange={this.handleFieldChange}
                />
              </Form>
            </main>
          </div>
          <footer>
            <section className="left">
              <a href="" className="cancel" onClick={(e) => {
                if (e) e.preventDefault();
                this.props.history.goBack();
              }}>Cancel</a>

              {/* delete button */}
              <Mutation
                mutation={DELETE_INSTRUCTOR}
                refetchQueries={[{
                  query: GET_INSTRUCTORS
                }]}
              >
                {(deleteItem, {data, loading, error}) => {
                  // console.log(data);
                  if (loading) return <div>Saving...</div>
                  if (error) return <div>Error!</div>

                  // if mutation is successful, go back to previous page
                  if (data) {
                    this.props.history.goBack();
                  }

                  return (
                    <a href="" className="delete" onClick={async (e) => {
                      e.preventDefault();
                      // console.log('dele');
                      await deleteItem({variables: {id: this.state.id}});

                    }}>Delete Instructor</a>
                  )
                }}
              </Mutation>
            </section>

            <Mutation
              mutation={UPDATE_INSTRUCTOR}
              refetchQueries={[{
                query: GET_INSTRUCTORS
              }]}
            >
              {(updateItem, {data, loading, error}) => {
                if (loading || error) return <a href="#" className="save">Saving...</a>

                // if mutation is successful, go back to previous page
                if (data) {
                  this.props.history.goBack();
                }

                return (
                  <a href="" className="save" onClick={async (e) => {
                    e.preventDefault();
                    await updateItem({variables: {instructorInput: this.state}});
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