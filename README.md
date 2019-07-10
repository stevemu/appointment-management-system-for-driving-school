# Driving school appointment management system

This is an open source appointment management system for driving schools. In this system, you can manage students, appointments, cars and instructors.

## Demo

Url: https://metro.stevemu.com

Username: admin

Password: demo


## Tech Stack

+ Node.js
+ React
+ GraphQL
+ Rethinkdb

## Todo

The server use moment.utcOffset("-04:00") to return result of EDT time zone result. This won't work for people not in EDT zone. Possible solution: store timezone in user object.