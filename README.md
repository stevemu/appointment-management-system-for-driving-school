# Driving school appointment management system

This is an open source appointment management system for driving schools

## Tech Stack

+ Node.js
+ React
+ GraphQL
+ Rethinkdb

## todo

now the server use moment.utcOffset("-04:00") to return result of EDT time zone result. This won't work for people not in EDT zone. Possible solution: store timezone in user object.