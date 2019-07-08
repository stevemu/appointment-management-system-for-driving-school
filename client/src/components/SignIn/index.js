import React, {Component} from 'react';
import {Input, Button} from 'semantic-ui-react';
import "./signin.css"
import {ApolloConsumer, Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import {Label, Loader} from 'semantic-ui-react'

export default class extends Component {

  constructor() {
    super();

    this.state = {
      error: "",
      loading: false,
      username: "",
      password: ""
    }
  }


  handleFieldChange = (e) => {
    // console.log(e);
    let {name, value} = e.target;
    this.setState({[name]: value});
  }

  render() {
    return (
      <ApolloConsumer>
        {client => {
          return (
            <div className="signin">
              <div className="signin-wrapper">
                <div className="title">
                  Metro Driving School
                </div>
                <div className="subtitle">
                  Managing appointments, the easy way
                </div>
                <div className="box">
                  <div className="photo"></div>
                  <div className="form">
                    {this.state.error && <Label color={"red"} className={"error"}>{this.state.error}</Label>}

                    <div className="form-title">Sign in</div>
                    <label>Username</label>
                    <Input
                      name={"username"}
                      placeholder='Username...'
                      onChange={this.handleFieldChange}
                      value={this.state.username}
                    />
                    <label>Password</label>
                    <Input
                      name={"password"}
                      placeholder='Password...'
                      type={"password"}
                      onChange={this.handleFieldChange}
                      value={this.state.password}
                    />
                    <Button primary onClick={async (e) => {
                      e.preventDefault();


                      this.setState({loading: true});

                      try {
                        let res = await client.mutate({
                            variables: {
                              username: this.state.username,
                              password: this.state.password
                            },

                            mutation: gql`
                              mutation Login($username: String!, $password: String!) {
                                  login(username: $username, password: $password) {
                                      user {
                                          id
                                          username
                                      }
                                      token
                                  }
                              }
                          `
                          }
                        );

                        // console.log('res in login');
                        // console.log(res.data.login);

                        // store token in local storage
                        let token = res.data.login.token;
                        localStorage.setItem("token", token);

                        // redirect to dashboard
                        this.props.history.push("/dashboard");
                        // console.log(res);

                      } catch (err) {
                        console.log(err);

                        // show error
                        this.setState({error: "Error logging in.", loading: false});
                      }


                    }}>
                      {this.state.loading ? <Loader active inline size={"tiny"} inverted/> : "Sign In"}
                    </Button>

                  </div>
                </div>
              </div>
            </div>
          )
        }}

      </ApolloConsumer>
    );
  }
}
