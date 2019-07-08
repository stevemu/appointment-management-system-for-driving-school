import React, {Component} from 'react';
import {Input, Button} from 'semantic-ui-react';
import moment from 'moment';
import {Query, ApolloConsumer} from "react-apollo";
import ReactTable from "react-table";
import "react-table/react-table.css";
import gql from 'graphql-tag';

import {caseInsensitiveFilter, calcPageSize} from '../Utils';
import {CREATE_STUDENT, UPDATE_STUDENT, GET_STUDENT, GET_STUDENTS} from './queries';

const GET_CURRENT_STUDENT_TABLE_DATA = gql`
    query {
        currentStudentTableData @client {
            pages
            page
            students {
                address
                call
                discontinue
                dob
                firstDay
                phone
                id
                name
                learnerPermitExp
                learnerPermitNo
                notes
                gender
                zip
            }
        }
        isCurrentStudentTableDataLoading @client
    }
`;


export default class extends Component {
  constructor() {
    super();

    this.state = {
      pageSize: calcPageSize(),
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    this.setState({pageSize: calcPageSize()});
  }

  fetchData = async (state, instance) => {

    // show loading

    this.client.writeData({
      data: {
        isCurrentStudentTableDataLoading: true
      }
    });

    // query backend

    let queryVars = {
      page: state.page,
      pageSize: state.pageSize,
      filter: {
        filters: state.filtered
      },
    };

    let res = await this.client.query({
      query: GET_STUDENTS,
      variables: queryVars
    });

    // write current page data to the global store

    let currentStudentTableData = {
      students: res.data.students.students,
      pages: res.data.students.pages,
      page: res.data.students.page
    };

    this.client.writeData({
      data: {
        currentStudentTableData,
        isCurrentStudentTableDataLoading: false, // not loading
        lastStudentTableDataQueryParams: queryVars // store the query in the global store for refetching later
      }
    })

  };

  render() {
    let {rowClickHandler} = this.props;

    return (
      <Query query={GET_CURRENT_STUDENT_TABLE_DATA} errorPolicy={"all"}>
        {({data, client, error}) => {

          // console.log('error here:');
          // console.log(error);

          this.client = client;
          // console.log(client.cache.data);

          let {page, pages, students} = data.currentStudentTableData;
          let loading = data.isCurrentStudentTableDataLoading;

          return (
            <ReactTable
              showPageSizeOptions={false}
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  onClick: (e, handleOriginal) => {
                    if (!rowInfo) return;
                    let item = rowInfo.original;
                    rowClickHandler(item);
                  }
                };
              }}
              columns={[
                {
                  Header: "First Day",
                  accessor: "firstDay",
                  width: 100
                },
                {
                  Header: "Name",
                  accessor: "name",
                  width: 200
                },
                {
                  Header: "Address",
                  accessor: "address",
                  width: 300
                },
                {
                  Header: "Zip",
                  accessor: "zip",
                  width: 100
                },
                {
                  Header: "Phone",
                  accessor: "phone",
                  width: 140
                },
                {
                  Header: "Permit No.",
                  accessor: "learnerPermitNo",
                },

                {
                  Header: "Gender",
                  accessor: "gender",
                  width: 50
                },
                {
                  Header: "DOB",
                  accessor: "dob"
                },
              ]}
              manual
              data={students}
              pages={pages}
              loading={loading}
              onFetchData={this.fetchData}
              filterable
              sortable={false}
              pageSize={this.state.pageSize}
              className="-striped -highlight main-table"
            />
          )
        }}
      </Query>
    );
  }
}
