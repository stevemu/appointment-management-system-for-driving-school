import React, { Component } from 'react';
import { MdClose } from 'react-icons/lib/md';
import { Query, Mutation, ApolloConsumer } from "react-apollo";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Form, Checkbox } from 'semantic-ui-react';
import moment from "moment";
import gql from 'graphql-tag';

import {
  CREATE_STUDENT,
  UPDATE_STUDENT,
  GET_STUDENT,
  GET_STUDENTS,
  DELETE_STUDENT
} from './queries';

export default class extends Component {

  constructor() {
    super();
  }

  render() {

    return (
      <Query
        query={GET_STUDENT}
        variables={{ id: this.props.match.params.id }}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>
          }
          if (error) {
            return <div>Error: {error.message}</div>;
          }
          let { student } = data;

          // remove extra properties
          let {
            Symbol,
            __typename,
            ...studentOnly,
          } = student;

          return (
            <StudentEdit {...this.props} student={studentOnly} />
          )
        }}

      </Query>
    );
  }
}

class StudentEdit extends Component {

  constructor(props) {
    super(props);

    this.state = props.student;
    // console.log(props.student);
  }

  handleFieldChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  refetchStudentTableData = async (client) => {
    await client.mutate({
      mutation: gql`
          mutation {
              refetchStudentTableData @client
          }
      `
    })
  };

  validate = () => {
    let pass = true;
    if (this.state.name == "") {
      this.setState({ nameError: true });
      pass = false;
    }

    var dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/

    if (this.state.firstDay && !this.state.firstDay.match(dateReg)) {
      this.setState({ firstDayError: true });
      pass = false;
    }
    if (this.state.learnerPermitExp && !this.state.learnerPermitExp.match(dateReg)) {
      this.setState({ learnerPermitExpError: true });
      pass = false;
    }
    if (this.state.dob && !this.state.dob.match(dateReg)) {
      this.setState({ dobError: true });
      pass = false;
    }

    return pass;
  }

  render() {

    return (
      <ApolloConsumer>
        {client => {

          return (<div className="modal">
            <div className="edit-modal-wrapper">
              <header>
                <h1>Edit Student</h1>
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
                      label='Student name'
                      control='input'
                      name="name"
                      value={this.state.name}
                      width={15}
                      onChange={this.handleFieldChange}
                      error={this.state.nameError}
                    />
                    <Form.Group>
                      <Form.Input label="First Day (mm/dd/yyyy)" width={5} name="firstDay" value={this.state.firstDay}
                        onChange={this.handleFieldChange} autoComplete="first day"
                        error={this.state.firstDayError}
                      />
                      <Form.Input label="Gender (M/F)" width={5} name="gender" value={this.state.gender}
                        onChange={this.handleFieldChange} autoComplete="gender" />
                      <Form.Input label="Dob (mm/dd/yyyy)" width={5} name="dob" value={this.state.dob}
                        onChange={this.handleFieldChange} autoComplete="dob"
                        error={this.state.dobError}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Input label="Learner Permit No." width={5} name="learnerPermitNo"
                        value={this.state.learnerPermitNo} onChange={this.handleFieldChange}
                        autoComplete="learnerPermitNo" />
                      <Form.Input label="Exp (mm/dd/yyyy)" width={5} name="learnerPermitExp"
                        value={this.state.learnerPermitExp} onChange={this.handleFieldChange}
                        autoComplete="learnerPermitExp"
                        error={this.state.learnerPermitExpError}
                      />
                      <Form.Input label="Phone" width={5} name="phone" value={this.state.phone}
                        onChange={this.handleFieldChange} autoComplete="phone" />
                    </Form.Group>
                    <Form.Group>
                      <Form.Input label="Address" width={10} name="address" value={this.state.address}
                        onChange={this.handleFieldChange} autoComplete="new-user-address" />
                      <Form.Input label="Zip" width={5} name="zip" value={this.state.zip}
                        onChange={this.handleFieldChange} autoComplete="zip" />
                    </Form.Group>
                    <Form.Field>
                      <Checkbox label='Discontinue' name="discontinue" checked={this.state.discontinue}
                        onChange={() => {
                          // toggle discontinue
                          this.setState({ discontinue: !this.state.discontinue })
                        }} />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox label='Call' name="call" checked={this.state.call} onChange={this.handleFieldChange}
                        onChange={() => {
                          // toggle discontinue
                          this.setState({ call: !this.state.call })
                        }} />
                    </Form.Field>
                  </Form>
                </main>
                <aside>
                  <Form>
                    <Form.TextArea
                      label='Notes'
                      name="notes"
                      value={this.state.notes}
                      onChange={this.handleFieldChange}
                      autoComplete="notes" />
                  </Form>
                </aside>
              </div>
              <footer>
                <section className="left">

                  <a href="" className="cancel" onClick={(e) => {
                    if (e) e.preventDefault();
                    this.props.history.goBack();
                  }}>Cancel</a>

                  {/* delete student button */}
                  <Mutation
                    mutation={DELETE_STUDENT}
                  >
                    {(deleteStudent, { data, loading, error }) => {
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

                          await deleteStudent({ variables: { id: this.state.id } });

                          // refetch student table data
                          await this.refetchStudentTableData(client);

                        }}>Delete Student</a>
                      )
                    }}
                  </Mutation>

                </section>

                {/*<a href="" className="create">Create appointment</a>*/}

                {/* update student button */}
                <Mutation
                  mutation={UPDATE_STUDENT}
                >
                  {(updateStudent, { data, loading, error }) => {
                    // console.log(data);
                    if (loading || error) return <a href="#" className="save">Saving...</a>

                    // if mutation is successful, go back to previous page
                    if (data) {
                      this.props.history.goBack();
                    }

                    return (
                      <a href="#" className="save" onClick={async (e) => {
                        e.preventDefault();

                        if (!this.validate()) return;

                        // remove extra fields
                        let {
                          nameError,
                          dobError,
                          learnerPermitExpError,
                          firstDayError,
                          ...vars
                        } = this.state;

                        // update the student record in the backend
                        await updateStudent({ variables: { studentInput: vars } });

                        // refetch student table data
                        await this.refetchStudentTableData(client);

                      }}>Save</a>
                    )
                  }}
                </Mutation>

              </footer>
            </div>
          </div>
          )
        }}
      </ApolloConsumer>
    )

  }
}