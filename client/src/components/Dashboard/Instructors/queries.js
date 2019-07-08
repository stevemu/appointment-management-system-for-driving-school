import gql from "graphql-tag";

export const GET_INSTRUCTORS = gql`
    {
        allInstructors {
            id
            name
        }
    }
`;


export const GET_INSTRUCTOR = gql`
    query ($id: ID) {
        instructor(id: $id) {
            id
            name
        }
    }
`;

export const UPDATE_INSTRUCTOR = gql`
    mutation ($instructorInput: InstructorInput) {
        updateInstructor(instructorInput: $instructorInput) {
            id
            name
        }
    }
`;

export const DELETE_INSTRUCTOR = gql`
    mutation ($id: ID) {
        deleteInstructor(id: $id) {
            id
        }
    }
`;


export const CREATE_INSTRUCTOR = gql`
    mutation ($instructorInput: InstructorInput) {
        createInstructor(instructorInput: $instructorInput) {
            id
            name
        }
    }
`;