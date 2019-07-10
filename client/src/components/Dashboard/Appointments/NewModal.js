import React, { Component } from 'react';
import { MdClose } from 'react-icons/lib/md';
import gql from "graphql-tag";
import { Query, Mutation, ApolloConsumer } from "react-apollo";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Form, Checkbox, Loader, Input, Dropdown, Dimmer, Search, Label } from 'semantic-ui-react'
import LoadingSaveButton from '../../LoadingSaveButton';
import moment from 'moment';
import queryString from '../../../query-string';
import { SingleDatePicker } from 'react-dates';

import {
  GET_APPOINTMENTS_BY_DATE,
  GET_APPOINTMENT,
  CREATE_APPOINTMENT,
  DELETE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  GET_TIMESLOTS_BY_INSTRUCTOR,
  GET_INSTRUCTORS_AND_CARS
} from './queries';

function generateStudentText(student) {
  let studentText = `${student.name} | ${student.learnerPermitNo} | ${student.dob} | ${student.phone}`;
  return studentText;
}

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: moment().format("L"),
      time: "",
      studentId: "",
      note: "",
      instructorId: "",
      carId: "",
      classType: "",
      id: "",
      studentText: "",
      studentOptions: [],
      studentSearchLoading: false,
      student: {},
      instructorOptions: [],
      instructorOptionsLoading: true,
      instructorText: "",
      instructorTimeSlots: [],
      instructorTimeSlotsLoading: false,
      carOptions: [],
      carOptionsLoading: false,
      noteSearchResults: [],

      studentError: false,
      dateError: false,
      instructorError: false,
      timeError: false,
      carError: false,
      classTypeError: false,

      mDate: moment()
    };

  }

  async componentDidMount() {
    // get instructors from backend and generate the instructor options for the dropdown

    this.setState({
      instructorOptionsLoading: true,
      carOptionsLoading: true
    }); // loading

    let res = await this.client.query({
      query: GET_INSTRUCTORS_AND_CARS,
      fetchPolicy: "network-only"
    });

    let instructorOptions = res.data.allInstructors.map((item) => {
      return {
        text: item.name,
        value: item.id
      }
    });

    let carOptions = res.data.cars.map((item) => {
      return {
        text: item.no,
        value: item.id
      }
    });

    this.setState({
      instructorOptions,
      carOptions,
      instructorOptionsLoading: false,
      carOptionsLoading: false
    });

    // put things in url query to the state
    if (this.props.location.search) {
      // console.log('here');
      this.setState({ ...queryString.parse(this.props.location.search) }, () => {
        this.handleInstructorChange(null, { value: this.state.instructorId });
        this.handleStudentChange(null, { value: this.state.studentId });
      })
    }

  }

  handleFieldChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleInstructorChange = async (e, { value }) => {
    this.setState({
      instructorTimeSlotsLoading: true
    });

    // get slots from backend

    let res = await this.client.query({
      query: GET_TIMESLOTS_BY_INSTRUCTOR,
      variables: {
        instructorId: value,
        date: this.state.date + " " + moment().format("Z"),
      },
      fetchPolicy: "network-only"
    })

    // console.log(res);

    this.setState({
      instructorTimeSlots: res.data.timeSlotsByInstructor,
      instructorTimeSlotsLoading: false,
      instructorId: value,
      instructorText: res.data.timeSlotsByInstructor[0].instructorName
    })
  };

  getDefaultTimeSlotsNode = (loading) => {
    let now = moment();
    now.hour(8);
    now.minute(0);
    let lis = [];
    for (let i = 0; i < 37; i++) {
      let li = <li className={"unavailable"} key={i}>{now.format("LT")}</li>
      lis.push(li);
      now.add(15, 'm');
    }

    let className = "time-slots";
    if (this.state.timeError) {
      className += " time-slots-error";
    }
    return <div className={className}>
      <ul>
        {lis}
      </ul>
      <Loader active={loading} />
    </div>
  }

  getInstructorTimesNode = () => {

    // when started, this.state.instructorTimeSlots is empty, show default
    // if instructorTimeSlotsLoading loading, show default with loading
    // otherwise, show the time table

    if (this.state.instructorTimeSlotsLoading) {
      return this.getDefaultTimeSlotsNode(true);
    }

    if (this.state.instructorTimeSlots.length == 0) {
      return this.getDefaultTimeSlotsNode(false);
    }

    // console.log('slots:');
    // console.log(this.state.instructorTimeSlots);
    let lis = this.state.instructorTimeSlots.map(({ time, isAvailable, classType }) => {
      // console.log(time);
      // console.log(this.state.time);
      // console.log(isAvailable);

      if (isAvailable) {
        let selected = "";
        let className = "";
        if (this.state.time == time) {
          className = "selected"
        }
        return <li key={time}><a href="#" className={className} onClick={(e) => {
          e.preventDefault();
          // store the time in the state
          this.setState({ time });
        }}>{time}</a></li>
      } else {
        return <li key={time} className={"unavailable"}>{time} ({classType})</li>
      }
    });

    let className = "time-slots";
    if (this.state.timeError) {
      className += " time-slots-error";
    }
    return <div className={className}>
      <ul>
        {lis}
      </ul>
    </div>
  };

  handleStudentChange = async (e, { value }) => {
    // console.log('changed');
    // console.log(value);

    let studentId = value;
    // console.log(typeof studentId);

    // get the student by id from backend and put it in the state
    let res = await this.client.query({
      query: gql`
          query ($id: ID) {
              student(id: $id) {
                  id
                  dob
                  name
                  phone
                  learnerPermitNo
              }
          }
      `,
      variables: { id: studentId }
    });

    let student = res.data.student;

    this.setState({ student: student, studentId: student.id, studentText: generateStudentText(student) });

  };

  handleStudentSearchChange = async (e, { searchQuery }) => {
    // console.log('changed student search', searchQuery);

    // show loading
    this.setState({ studentSearchLoading: true });

    // search the backend
    let res = await this.client.query({
      query: gql`
          query ($query: String) {
              studentSearch(query: $query) {
                  id
                  name
                  phone
                  learnerPermitNo
                  dob

              }
          }
      `,
      variables: { query: searchQuery }
    });

    let items = res.data.studentSearch;

    // construct an array of options
    let options = items.map((item) => {

      let option = {
        text: generateStudentText(item),
        value: item.id
      };

      return option;
    });

    this.setState({ studentOptions: options, studentSearchLoading: false });

    // console.log(res);
  };

  handleNoteSearchChange = (e, { value }) => {

    // console.log(value);

    let optionsArr = ["O65", "PD", "QM", "QCVS", "QUINCY", "YMCA", "H2", "WO", "JOL", "R1", "RS", "QC", "PAID", "B1", "MINGS", "W5", "HOME", "QH", "K1", "N.COMEK1"];

    let searchResults = optionsArr.filter((item) => {
      return item.includes(value.toUpperCase());
    }).map((item) => {
      return { title: item };
    })

    // console.log(searchResults);

    this.setState({ noteSearchResults: searchResults, note: value, openNoteSearchResult: true });

  }

  handleCarChange = (e, { value }) => {
    this.setState({ carId: value });
  }

  handleClassTypeChange = (e, { value }) => {
    this.setState({ classType: value });
  }

  validate = () => {
    let valid = true;
    if (!this.state.studentId) {
      valid = false;
      this.setState({ studentError: true });
    }
    if (!this.state.date) {
      valid = false;
      this.setState({ dateError: true });
    }
    if (!this.state.time) {
      valid = false;
      this.setState({ timeError: true });
    }
    if (!this.state.carId) {
      valid = false;
      this.setState({ carError: true });
    }
    if (!this.state.instructorId) {
      valid = false;
      this.setState({ instructorError: true });
    }
    if (!this.state.classType) {
      valid = false;
      this.setState({ classTypeError: true });
    }

    return valid;
  }

  render() {

    let classTypeOptions = [
      { text: "One Class", value: "One Class" },
      { text: "Two Class", value: "Two Class" },
      { text: "Three Class", value: "Three Class" },
      { text: "RT.Camb", value: "RT.Camb" },
      { text: "RT.Quincy", value: "RT.Quincy" },
      { text: "RT.DOR", value: "RT.DOR" },
      { text: "RT.Braintree", value: "RT.Braintree" },
      { text: "RT.Watertown", value: "RT.Watertown" },
      { text: "Special RT.", value: "Special RT." },
      { text: "SeeR.Camb", value: "SeeR.Camb" },
      { text: "SeeR.Quincy", value: "SeeR.Quincy" },
      { text: "SeeR.DOR", value: "SeeR.DOR" },
      { text: "SeeR.Braintree", value: "SeeR.Braintree" },
      { text: "SeeR.Watertown", value: "SeeR.Watertown" },
      { text: "1cCan", value: "1cCan" },
      { text: "2cCan", value: "2cCan" },
      { text: "3cCan", value: "3cCan" },
      { text: "RTCan", value: "RTCan" },
      { text: "STCan", value: "STCan" },
      { text: "SeCan", value: "SeCan" }
    ];
    let mDate = this.state.date ? moment(this.state.date, "L") : moment();
    // console.log(mDate);

    return (
      <ApolloConsumer>
        {client => {
          this.client = client;
          return (
            <div className="modal">
              <div className="edit-modal-wrapper new-appointment-modal">
                <header>
                  <h1>
                    {this.state.id ? "Edit Appointment" : "New Appointment"}</h1>
                  <div><a href="" onClick={(e) => {
                    if (e) e.preventDefault();
                    this.props.history.goBack()
                  }}><MdClose className="close" /></a></div>
                </header>
                <div className="content">
                  <main>
                    <label>Student</label>
                    <Dropdown
                      text={this.state.studentText}
                      fluid
                      search={true}
                      error={this.state.studentError}
                      placeholder='Student Name/Permit No/Date of birth/Phone'
                      selection
                      options={this.state.studentOptions}
                      onChange={this.handleStudentChange}
                      onSearchChange={this.handleStudentSearchChange}
                      loading={this.state.studentSearchLoading}
                    />

                    <label>Date:</label>
                    {/*<Input*/}
                    {/*placeholder={"Date"}*/}
                    {/*value={this.state.date}*/}
                    {/*error={this.state.dateError}*/}
                    {/*onChange={(e, {value}) => {*/}
                    {/*this.setState({date: value});*/}
                    {/*}}*/}
                    {/*/>*/}
                    <SingleDatePicker
                      date={mDate} // momentPropTypes.momentObj or null
                      onDateChange={mDate => this.setState({ date: mDate.format("L") })} // PropTypes.func.isRequired
                      focused={this.state.focused} // PropTypes.bool
                      onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                      id="date-picker" // PropTypes.string.isRequired,
                    />

                    <label>Instructor</label>
                    <Dropdown
                      loading={this.state.instructorOptionsLoading || this.state.instructorTimeSlotsLoading}
                      selection
                      error={this.state.instructorError}
                      text={this.state.instructorText}
                      fluid
                      disabled={!this.state.date}
                      options={this.state.instructorOptions}
                      onChange={this.handleInstructorChange}
                      placeholder={"Instructor"}
                    />

                    <label>Time</label>
                    {this.getInstructorTimesNode()}

                    <label>Car</label>
                    <Dropdown
                      selection
                      text={this.state.carId}
                      options={this.state.carOptions}
                      loading={this.state.carOptionsLoading}
                      fluid
                      error={this.state.carError}
                      onChange={this.handleCarChange}
                      placeholder={"Car"}
                    />

                    <label>Class type:</label>
                    <Dropdown
                      placeholder={"Class Type"}
                      selection
                      error={this.state.classTypeError}
                      text={this.state.classType}
                      options={classTypeOptions}
                      onChange={this.handleClassTypeChange}
                    />

                    <label>Note:</label>
                    <Search
                      value={this.state.note}
                      icon={false}
                      text={this.state.note}
                      onSearchChange={this.handleNoteSearchChange}
                      results={this.state.noteSearchResults}
                      resultRenderer={({ title }) => {
                        return <Label content={title} />
                      }}
                      onResultSelect={(e, { result }) => {
                        this.setState({ note: result.title });
                      }}

                    />

                  </main>
                </div>
                <footer>
                  <a href="" className="cancel" onClick={(e) => {
                    if (e) e.preventDefault();
                    this.props.history.goBack();
                  }}>Cancel</a>

                  {/*save button*/}

                  <a href="#" className="save" onClick={async (e) => {
                    e.preventDefault();

                    if (!this.validate()) return;

                    // for edit, id already exists
                    if (this.state.id) {
                      // generate an object to be sent to backend
                      let input = {
                        id: this.state.id,
                        date: this.state.date,
                        time: this.state.time,
                        timezoneOffset: moment().format("Z"),
                        studentId: this.state.student.id,
                        instructorId: this.state.instructorId,
                        carId: this.state.carId,
                        classType: this.state.classType,
                        note: this.state.note
                      };

                      let res = await this.client.mutate({
                        mutation: UPDATE_APPOINTMENT,
                        variables: { input }
                      });

                    } else {

                      // create new appt
                      let input = {
                        date: this.state.date,
                        time: this.state.time,
                        timezoneOffset: moment().format("Z"),
                        studentId: this.state.student.id,
                        instructorId: this.state.instructorId,
                        carId: this.state.carId,
                        classType: this.state.classType,
                        note: this.state.note
                      };

                      console.log(input);

                      let res = await this.client.mutate({
                        mutation: CREATE_APPOINTMENT,
                        variables: { input }
                      });

                    }

                    this.client.writeData({
                      data: {
                        isAppointmentByDateTableLoading: true
                      }
                    });

                    this.props.history.goBack();

                  }}>Save</a>

                </footer>
              </div>
            </div>)
        }}
      </ApolloConsumer>
    )

  }
}