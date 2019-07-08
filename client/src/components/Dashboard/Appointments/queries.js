import gql from "graphql-tag";

export const GET_APPOINTMENT = gql`
    query ($id: ID) {
        appointment(id: $id) {
            id
            carId
            instructorId
            date
            time
            classType
            notes
            studentId
            note
        }
    }
`;

export const UPDATE_APPOINTMENT = gql`
    mutation ($input: AppointmentInput) {
        updateAppointment(input: $input) {
            id
            date
            classType
        }
    }
`;

export const CREATE_APPOINTMENT = gql`
    mutation ($input: AppointmentInput) {
        createAppointment(input: $input) {
            id
            date
            time
            classType
            studentId
            instructorId
            carId
        }
    }
`;

export const DELETE_APPOINTMENT = gql`
    mutation ($id: ID) {
        deleteAppointment(id: $id) {
            id
        }
    }
`;

export const GET_APPOINTMENTS_BY_DATE = gql`
    query ($date: String) {
        appointmentsByDate(date: $date) {
            id
            date
            time
            classType
            student {
                name
            }
            studentId
            instructorId
            carId
            note
        }
    }
`;

export const GET_CURRENT_APPOINTMENTS_TABLE_BY_DATE_DATA = gql`
    query {
        currentAppointmentsByDateTableData @client {
            id
            date
            time
            classType
            student {
                name
            }
            studentId
            instructorId
            carId
            note
        }
        isAppointmentByDateTableLoading @client
    }
`;

export const GET_TIMESLOTS_BY_INSTRUCTOR = gql`
    query($instructorId: ID, $date: String) {
        timeSlotsByInstructor (instructorId: $instructorId, date: $date) {
            time
            isAvailable
            classType
            instructorName
        }
    }
`

export const GET_INSTRUCTORS_AND_CARS = gql`
    query {
        allInstructors {
            name
            id
        }
        cars {
            id
            no
        }
    }
`