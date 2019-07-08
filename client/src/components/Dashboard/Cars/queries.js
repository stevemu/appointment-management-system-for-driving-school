import gql from "graphql-tag";

export const CREATE_CAR = gql`
    mutation ($carInput: CarInput) {
        createCar(carInput: $carInput) {
            id
            no
        }
    }
`;

export const GET_CAR = gql`
    query car($id: ID) {
        car(id: $id) {
            id
            no
        }
    }
`;

export const UPDATE_CAR = gql`
    mutation ($carInput: CarInput) {
        updateCar(carInput: $carInput) {
            id
            no
        }
    }
`;

export const DELETE_CAR = gql`
    mutation ($id: ID) {
        deleteCar(id: $id) {
            id
        }
    }
`;



export const GET_CARS = gql`
    {
        cars {
            id
            no
        }
    }
`;