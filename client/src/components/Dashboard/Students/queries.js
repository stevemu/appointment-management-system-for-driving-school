import gql from "graphql-tag";


export const CREATE_STUDENT = gql`
  mutation ($studentInput: StudentInput) {
    createStudent(studentInput: $studentInput) {
      id
      address
      call
      discontinue
      dob
      firstDay
      phone
      name
      learnerPermitNo
      learnerPermitExp
      notes
      gender
      zip
    }
  }
`;

export const GET_STUDENTS = gql`

  query ($pageSize: Int, $page: Int, $filter: FilterInput) {
    students(pageSize: $pageSize, page: $page, filter: $filter) {
      students {
        id
        address
        call
        discontinue
        dob
        firstDay
        phone
        name
        learnerPermitNo
        learnerPermitExp
        notes
        gender
        zip
    }
    page
    pageSize
    pages
    
    }
  }
`;

export const GET_STUDENT = gql`
  query student($id: ID) {
    student(id: $id) {
      id
      address
      call
      discontinue
      dob
      firstDay
      phone
      name
      learnerPermitNo
      learnerPermitExp
      notes
      gender
      zip
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation ($studentInput: StudentInput) {
    updateStudent(studentInput: $studentInput) {
      id
      address
      call
      discontinue
      dob
      firstDay
      phone
      name
      learnerPermitNo
      learnerPermitExp
      notes
      gender
      zip
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation ($id: ID) {
    deleteStudent(id: $id) {
      id
    }
  }
`;
