// not working

import React, { Component } from 'react';
import { Input, Button } from 'semantic-ui-react';
import moment from 'moment';

// graphql
import gql from "graphql-tag";
import { Query, ApolloConsumer } from "react-apollo";

// table
import ReactTable from "react-table";
import "react-table/react-table.css";

import { caseInsensitiveFilter, calcPageSize } from '../../Utils';

export const GET_APPOINTMENTS = gql`
query ($pageSize: Int, $page: Int) {
  appointments(pageSize: $pageSize, page: $page) {
    appointments {
      id
      date
    }
    page
    pageSize
    pages
    
  }
}
`;



const requestData = async (pageSize, page, sorted, filtered) => {
  let mockData = [
    {
      id: "a",
      date: "2019-09-03T04:00:00Z"
    },
    {
      id: "b",
      date: "2019-09-02T04:00:00Z"
    },
    {
      id: "c",
      date: "2019-09-01T04:00:00Z"
    }
  ]

  let res = {
    rows: mockData,
    pages: 10
  }

  return res;
}


export default class extends Component {
  constructor() {
    super();

    this.state = {
      pageSize: calcPageSize(),
      data: [],
      pages: null,
      loading: true
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    this.setState({ pageSize: calcPageSize() });
  }

  fetchData = async (state, instance) => {

    this.setState({ loading: true });

    let res = await this.client.query({
      query: GET_APPOINTMENTS,
      variables: {
        page: state.page,
        pageSize: state.pageSize
      }
    })

    this.setState({
      data: res.data.appointments.appointments,
      pages: res.data.appointments.pages,
      loading: false
    })

  }

  render() {
    let { rowClickHandler } = this.props;
    let { pageSize, data, loading, pages } = this.state;

    return (
      <ApolloConsumer>
        {client => {
          this.client = client;
          return (
            <ReactTable
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  onClick: (e, handleOriginal) => {
                    let item = rowInfo.original;
                    rowClickHandler(item);
                  }
                };
              }}
              columns={[
                {
                  Header: "Date",
                  accessor: "date",
                  width: 200
                },
              ]}
              manual
              data={data}
              pages={pages}
              loading={loading}
              onFetchData={this.fetchData}
              filterable
              pageSize={pageSize}
              sortable={false}
              className="-striped -highlight main-table"
            />
          )
        }}
      </ApolloConsumer>
    );
  }
}
