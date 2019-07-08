import React, {Component} from 'react';
import {MdClose} from 'react-icons/lib/md';
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Form, Checkbox} from 'semantic-ui-react';

import {GET_CAR, GET_CARS, DELETE_CAR, UPDATE_CAR} from './queries';

export default class extends Component {

  constructor() {
    super();
  }

  render() {

    return (
      <Query
        query={GET_CAR}
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
          let {car: item} = data;

          // remove extra properties
          let {
            Symbol,
            __typename,
            ...itemOnly,
          } = item;

          return (
            <Edit {...this.props} car={itemOnly}/>
          )
        }}

      </Query>
    );
  }
}

class Edit extends Component {

  constructor(props) {
    super(props);

    this.state = props.car;
    console.log(props);
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
            <div>Edit Car</div>
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
            <section className="left">
              <a href="" className="cancel" onClick={(e) => {
                if (e) e.preventDefault();
                this.props.history.goBack();
              }}>Cancel</a>

              {/* delete button */}
              <Mutation
                mutation={DELETE_CAR}
                refetchQueries={[{
                  query: GET_CARS
                }]}
              >
                {(deleteCar, {data, loading, error}) => {
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
                      await deleteCar({variables: {id: this.state.id}});

                      // refetch student table data
                      // await this.refetchStudentTableData(client);

                    }}>Delete Car</a>
                  )
                }}
              </Mutation>
            </section>

            <Mutation
              mutation={UPDATE_CAR}
              refetchQueries={[{
                query: GET_CARS
              }]}
            >
              {(update, {data, loading, error}) => {
                if (loading || error) return <a href="#" className="save">Saving...</a>

                // if mutation is successful, go back to previous page
                if (data) {
                  this.props.history.goBack();
                }

                return (
                  <a href="" className="save" onClick={(e) => {
                    e.preventDefault();
                    update({variables: {carInput: this.state}});
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