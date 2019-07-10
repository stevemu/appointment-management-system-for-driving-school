let { makeExecutableSchema, addMockFunctionsToSchema } = require( 'graphql-tools');
let resolvers = require( './resolvers');


// allAppointments(pageSize: Int, page: Int): AppointmentsResult


const typeDefs = `

type Query {
  students(pageSize: Int, page: Int, filter: FilterInput): StudentsResult
  student(id: ID): Student
  studentSearch(query: String): [Student]
  
  cars: [Car]
  car(id: ID): Car
  
  instructor(id: ID): Instructor
  allInstructors: [Instructor]
  timeSlotsByInstructor(instructorId: ID, date: String): [TimeSlot]

  appointmentById(id: ID): Appointment
  appointmentsByDate(date: String): [Appointment]
  isAppointmentExist(instructorId: ID, time: String): Boolean
}



type TimeSlot {
  time: String
  isAvailable: Boolean,
  classType: String,
  instructorName: String
}

input FilterInput {
  filters: [Filter]
}

input Filter {
  id: String
  value: String
}

type Mutation {
  login(password: String!, username: String!): AuthPayload!
  
  updateStudent(studentInput: StudentInput): Student
  createStudent(studentInput: StudentInput): Student
  deleteStudent(id: ID): Student
  
  updateCar(carInput: CarInput): Car
  createCar(carInput: CarInput): Car
  deleteCar(id: ID): Car

  createInstructor(instructorInput: InstructorInput): Instructor
  updateInstructor(instructorInput: InstructorInput): Instructor
  deleteInstructor(id: ID): Instructor

  createAppointment(input: AppointmentInput): Appointment
  updateAppointment(input: AppointmentInput): Appointment

}

type Student {
  address: String
  call: Boolean
  discontinue: Boolean
  dob: String
  firstDay: String
  phone: String
  id: ID
  name: String
  learnerPermitExp: String
  learnerPermitNo: String
  notes: String
  gender: String
  zip: String
}

input StudentInput {
  address: String
  call: Boolean
  discontinue: Boolean
  dob: String
  firstDay: String
  phone: String
  id: ID
  name: String
  learnerPermitExp: String
  learnerPermitNo: String
  notes: String
  gender: String
  zip: String
}

type Appointment {
  id: ID
  studentId: ID
  instructorId: ID
  carId: ID
  classType: String
  note: String

  instructor: Instructor
  car: Car
  student: Student
  date: String
  time: String
}

input AppointmentInput {
  id: ID
  date: String!
  time: String!
  studentId: ID!
  instructorId: ID!
  carId: ID!
  classType: String!
  note: String
  timezoneOffset: String
}

type AppointmentsResult {
  appointments: [Appointment]
  page: Int
  pageSize: Int
  pages: Int
}

type StudentsResult {
  students: [Student]
  page: Int
  pageSize: Int
  pages: Int
}


type Car {
  id: ID
  no: String
}

type Instructor {
  id: ID
  name: String
}

input InstructorInput {
  id: ID
  name: String
}

input CarInput {
  id: ID
  no: String
}

type AuthPayload {
  token: String!
  user: User!
}

type User {
  id: ID
  username: String
}

`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
// export default schema;

module.exports = schema;