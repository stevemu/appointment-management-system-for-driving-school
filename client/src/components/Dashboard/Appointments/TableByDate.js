import React, {Component} from 'react';
import {Input, Button} from 'semantic-ui-react';
import moment from 'moment';
import gql from "graphql-tag";
import {Query, ApolloConsumer} from "react-apollo";
import ReactTable from "react-table";
import "react-table/react-table.css";

import {caseInsensitiveFilter, calcPageSize} from '../Utils';
import {GET_APPOINTMENTS_BY_DATE, GET_CURRENT_APPOINTMENTS_TABLE_BY_DATE_DATA} from './queries';


export default class extends Component {
  constructor() {
    super();
  }

  updateTableData = async () => {

    // console.log('here');
    // get the date
    let res = await this.client.query({
      query: gql`
        query {
            currentDateSelection @client
        }
      `
    });

    let date = res.data.currentDateSelection;
    // console.log(date);

    // query backend
    res = await this.client.query({
      query: GET_APPOINTMENTS_BY_DATE,
      variables: {
        date: date
      },
      fetchPolicy: "network-only"

    });

    // console.log(res);

    // write to the global store
    this.client.writeData({
      data: {
        currentAppointmentsByDateTableData: res.data.appointmentsByDate,
        isAppointmentByDateTableLoading: false
      }
    });

  };

  render() {
    let {rowClickHandler} = this.props;

    return (
      <Query query={GET_CURRENT_APPOINTMENTS_TABLE_BY_DATE_DATA}>
        {({data, client}) => {
          this.client = client;

          // when it is loading, fetch and update the table
          // console.log(data.isAppointmentByDateTableLoading);

          if (data.isAppointmentByDateTableLoading) {
            this.updateTableData();
          }

          // console.log(data);

          let {
            currentAppointmentsByDateTableData,
            isAppointmentByDateTableLoading
          } = data;

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
                  width: 100
                },
                {
                  Header: "Time",
                  accessor: "time",
                  width: 100
                },
                {
                  id: "studentName",
                  Header: "Student",
                  accessor: (d) => {
                    if (d.student) return d.student.name;
                    return "";
                  },
                  width: 200
                },
                {
                  id: "instructorName",
                  Header: "Instructor",
                  accessor: (d) => {
                    if (d.instructor) return d.instructor.name;
                    return "";
                  },
                  width: 100
                },
                {
                  Header: "Type",
                  accessor: "classType",
                  width: 100
                },
                {
                  id: "carNo",
                  Header: "Car",
                  accessor: (d) => {
                    if (d.car) return d.car.no;
                    return "";
                  },
                  width: 200
                }
              ]}
              manual
              data={currentAppointmentsByDateTableData}
              pages={1}
              loading={isAppointmentByDateTableLoading}
              pageSize={currentAppointmentsByDateTableData.length}
              sortable={false}
              className="-striped -highlight main-table"
            />
          )
        }}
      </Query>
    );
  }
}
