let { isAuthenticatedResolver } = require('./acl');
let { APP_CONSTANTS } = require('../../config');
let moment = require('moment');
let momentz = require('moment-timezone');

let { STUDENTS, APPOINTMENTS, DB, CARS, INSTRUCTORS } = APP_CONSTANTS;
let {
  convertDateFieldsInStudentToHumanReadable,
  convertDateFieldsInAppointmentToHumanReadable,
  convertDateFieldsInStudentInputToRethinkdbFormat,
  sanitizeFieldsInStudentInput,
  convertDateTimeToRDate,
  validateDateFieldsInStudent
} = require('../../utils');

module.exports = {
  Query: {

    // student

    students: isAuthenticatedResolver.createResolver(async (parent, { pageSize, page, filter = { filters: [] } }, { r }) => {

      //get data in order
      let items = await r.db(DB).table(STUDENTS)
        .orderBy({ index: r.desc("firstDay") });

      // transform date to huamn readable
      items = items.map((item) => {
        // console.log(item);
        return convertDateFieldsInStudentToHumanReadable(item);
      });

      // filter
      let filters = filter.filters;
      // console.log(filters);
      if (filters.length) {
        items = filters.reduce((filteredSoFar, nextFilter) => {
          return filteredSoFar.filter(item => {
            return (item[nextFilter.id] + "").toLowerCase().includes(nextFilter.value.toLowerCase());
          })
        }, items)
      }

      // pagination
      let pages = Math.ceil(items.length / pageSize); // no. of pages

      // return the portion of items for page and pageSize
      items = items.slice(pageSize * page, pageSize * page + pageSize);

      let result = {
        students: items,
        page,
        pageSize,
        pages
      };

      // console.log(Date());
      // console.log(page);
      // console.log(pageSize);
      // console.log(pages);

      return result;
    }),

    student: isAuthenticatedResolver.createResolver(async (_, { id }, { r }) => {
      let item = await r.db(DB).table(STUDENTS).get(id);
      item = convertDateFieldsInStudentToHumanReadable(item);
      // console.log(item);
      return item;
    }),

    studentSearch: isAuthenticatedResolver.createResolver(async (_, { query }, { r }) => {

      query = query.toUpperCase();
      // console.log(query);
      //get data in order
      let items = await r.db(DB).table(STUDENTS)
        .orderBy({ index: r.desc("firstDay") });

      // transform date to huamn readable
      items = items.map((item) => {
        // console.log(item);
        return convertDateFieldsInStudentToHumanReadable(item);
      });

      items = items.filter((item) => {
        return item.name.includes(query) ||
          item.dob.includes(query) ||
          item.learnerPermitNo.includes(query) ||
          item.phone.includes(query);
      })

      // console.log(items);
      return items;
    }),

    // appointment

    // allAppointments: isAuthenticatedResolver.createResolver(async (parent, { pageSize, page }, { r }) => {

    //   let firstItem = pageSize * page;
    //   let endVal = pageSize * page + pageSize;

    //   let items = await r.db(DB).table(APPOINTMENTS)
    //     .orderBy({ index: r.desc("startTime") })
    //     .slice(firstItem, endVal);
    //   let count = await r.db(DB).table(APPOINTMENTS).count();
    //   let pages = Math.floor(count / pageSize);

    //   // transform date to huamn readable
    //   items = items.map((item) => {
    //     return convertDateFieldsInAppointmentToHumanReadable(item);
    //   });

    //   let result = {
    //     appointments: items,
    //     page,
    //     pageSize,
    //     pages
    //   };

    //   return result;
    // }),

    appointmentsByDate: isAuthenticatedResolver.createResolver(async (parent, { date }, { r }) => {

      // console.log(date);
      let mDate = moment(date, "L");
      // console.log(mDate);

      // filter by date
      // get pagination result
      let items = await r.db(DB).table(APPOINTMENTS)
        .orderBy({ index: r.asc("startTime") })
        .filter(function (item) {
          return item("startTime").date().eq(r.time(mDate.year(), mDate.month() + 1, mDate.date(), "Z"));
        });

      return items;
    }),

    appointmentById: isAuthenticatedResolver.createResolver(async (_, { id }, { r }) => {
      let item = await r.db(DB).table(APPOINTMENTS).get(id);
      return item;
    }),

    isAppointmentExist: isAuthenticatedResolver.createResolver(async (_, { instructorId, time }, { r }) => {

      // console.log(moment(time).utc().format());
      let rTime = r.ISO8601(moment(time).utc().format());
      // console.log(rTime);

      let items = await r.db(DB).table(APPOINTMENTS).filter({
        instructorId,
        startTime: rTime
      })

      // console.log(items);
      // return convertDateFieldsInAppointmentToHumanReadable(item);

      return true;
    }),

    // car

    cars: isAuthenticatedResolver.createResolver(async (_, params, { r }) => {
      let items = await r.db(DB).table(CARS);
      return items;
    }),

    car: isAuthenticatedResolver.createResolver(async (_, params, { r }) => {
      let item = await r.db(DB).table(CARS).get(params.id);
      return item;
    }),

    // instructor

    allInstructors: isAuthenticatedResolver.createResolver(async (_, params, { r }) => {
      let items = await r.db(DB).table(INSTRUCTORS);
      return items;
    }),

    instructor: isAuthenticatedResolver.createResolver(async (_, params, { r }) => {
      let item = await r.db(DB).table(INSTRUCTORS).get(params.id);
      return item;
    }),

    // return a list of time on that date, along with availability
    timeSlotsByInstructor: isAuthenticatedResolver.createResolver(async (_, { instructorId, date }, { r }) => {

      // get the instructor name by id
      let { name } = await r.db(DB).table(INSTRUCTORS).get(instructorId);

      let slots = [];

      // get the date from client with timezone, start from 8am, to 5pm
      let dateMt = moment.utc(date, "L Z").utcOffset("-04:00");
      dateMt.hour(8);

      for (let i = 0; i <= 36; i++) {

        // get appointments at this time
        let rDate = r.ISO8601(dateMt.utc().format()); // make an copy to preserve the non-utc date in the original moment
        let result = await r.db(DB).table(APPOINTMENTS).filter({
          startTime: rDate,
          instructorId
        });

        let classType = "";
        // whether the instructor is available at this time
        let isAvailable;
        if (result.length == 0) {
          isAvailable = true;
        } else {
          isAvailable = false;

          // class type/ location
          classType = result[0].classType;
        }

        // generate time text
        let timeText = dateMt.utc().utcOffset("-04:00").format("LT");
        slots.push({
          time: timeText,
          isAvailable,
          classType,
          instructorName: name
        });
        // add 15m
        dateMt.add(15, "m");
      }

      return slots;
    }),

  },
  Mutation: {

    // student

    updateStudent: isAuthenticatedResolver.createResolver(async (_, { studentInput: input }, { r }) => {
      if (!validateDateFieldsInStudent(input, 'mm/dd/yyyy')) {
        throw 'Input dates format are not in mm/dd/yyyy'
      }
      input = convertDateFieldsInStudentInputToRethinkdbFormat(r, input);
      input = sanitizeFieldsInStudentInput(input);
      await r.db(DB).table(STUDENTS).get(input.id).update(input);
      let item = await r.db(DB).table(STUDENTS).get(input.id);
      item = convertDateFieldsInStudentToHumanReadable(item);
      return item;
    }),

    createStudent: isAuthenticatedResolver.createResolver(async (_, { studentInput: input }, { r }) => {
      if (!validateDateFieldsInStudent(input, 'mm/dd/yyyy')) {
        throw 'Input dates format are not in mm/dd/yyyy'
      }
      input = convertDateFieldsInStudentInputToRethinkdbFormat(r, input);
      input = sanitizeFieldsInStudentInput(input);
      let result = await r.db(DB).table(STUDENTS).insert(input);
      let id = result.generated_keys[0];
      let item = await r.db(DB).table(STUDENTS).get(id);
      item = convertDateFieldsInStudentToHumanReadable(item);
      return item;
    }),

    deleteStudent: isAuthenticatedResolver.createResolver(async (_, { id }, { r }) => {
      let item = await r.db(DB).table(STUDENTS).get(id);
      let result = await r.db(DB).table(STUDENTS).get(id).delete();

      if (result.deleted == 0) {
        return null;
      }

      return item;
    }),

    // appointment

    updateAppointment: isAuthenticatedResolver.createResolver(async (_, { input }, { r }) => {

      // deconstruct vars
      let {
        id,
        carId,
        instructorId,
        classType,
        note,
        studentId,
        date,
        time,
        timezoneOffset
      } = input;

      // insert to db
      let item = {
        carId,
        instructorId,
        classType,
        note,
        studentId,
        startTime: convertDateTimeToRDate(date, time, timezoneOffset, r)
      };

      // update
      let result = await r.db(DB).table(APPOINTMENTS).get(id).update(item);

      // get from db
      item = await r.db(DB).table(APPOINTMENTS).get(id);

      return item;
    }),

    createAppointment: isAuthenticatedResolver.createResolver(async (_, { input }, { r }) => {

      // deconstruct vars
      let {
        carId,
        instructorId,
        classType,
        note,
        studentId,
        date,
        time,
        timezoneOffset
      } = input;

      // insert to db
      let item = {
        carId,
        instructorId,
        classType,
        note,
        studentId,
        startTime: convertDateTimeToRDate(date, time, timezoneOffset, r)
      };

      let { generated_keys } = await r.db(DB).table(APPOINTMENTS).insert(item);
      let id = generated_keys[0];

      // get from db
      item = await r.db(DB).table(APPOINTMENTS).get(id);

      return item;
    }),

    // car

    updateCar: isAuthenticatedResolver.createResolver(async (_, { carInput }, { r }) => {
      await r.db(DB).table(CARS).get(carInput.id).update(carInput);
      let car = await r.db(DB).table(CARS).get(carInput.id);
      return car;
    }),

    createCar: isAuthenticatedResolver.createResolver(async (_, { carInput }, { r }) => {
      let result = await r.db(DB).table(CARS).insert(carInput);
      let car = await r.db(DB).table(CARS).get(carInput.id);
      return car;
    }),

    deleteCar: isAuthenticatedResolver.createResolver(async (_, { id }, { r }) => {
      let item = await r.db(DB).table(CARS).get(id);
      let result = await r.db(DB).table(CARS).get(id).delete();

      if (result.deleted == 0) {
        return null;
      }

      return item;
    }),

    // instructor

    createInstructor: isAuthenticatedResolver.createResolver(async (_, { instructorInput }, { r }) => {
      let result = await r.db(DB).table(INSTRUCTORS).insert(instructorInput);
      let item = await r.db(DB).table(INSTRUCTORS).get(instructorInput.id);
      return item;
    }),

    updateInstructor: isAuthenticatedResolver.createResolver(async (_, { instructorInput }, { r }) => {
      await r.db(DB).table(INSTRUCTORS).get(instructorInput.id).update(instructorInput);
      let item = await r.db(DB).table(INSTRUCTORS).get(instructorInput.id);
      return item;
    }),

    deleteInstructor: isAuthenticatedResolver.createResolver(async (_, { id }, { r }) => {
      // console.log('delete');
      let item = await r.db(DB).table(INSTRUCTORS).get(id);
      let result = await r.db(DB).table(INSTRUCTORS).get(id).delete();

      if (result.deleted == 0) {
        return null;
      }

      return item;
    }),
  },

  Appointment: {
    student: async (parent, params, { r }) => {
      if (!parent.studentId) {
        return parent.student;
      }
      let item = await r.db(DB).table(STUDENTS).get(parent.studentId);
      item = convertDateFieldsInStudentToHumanReadable(item);
      return item;
    },
    instructor: async (parent, params, { r }) => {
      if (!parent.instructorId) return null;
      let instructor = await r.db(DB).table(INSTRUCTORS).get(parent.instructorId);
      return instructor;
    },
    car: async (parent, params, { r }) => {
      if (!parent.carId) return null;
      let item = await r.db(DB).table(CARS).get(parent.carId);
      return item;
    },
    date: async (parent, params, { r }) => {
      return moment(parent.startTime).utcOffset("-04:00").format("L");
    },
    time: async (parent, params, { r }) => {
      return moment(parent.startTime).utcOffset("-04:00").format("LT");
    }


  }

}