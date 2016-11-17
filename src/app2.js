import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {buildSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import config from './config';

var app = express();

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Friends {
    name: String
  }
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
    user(num: String): [Friends]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`);

class Friends {
    constructor(name){
        this.name = name;
    }
}

// This class implements the RandomDie GraphQL type
class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({numRolls}) {
        var output = [];
        for (var i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }

    user({num}){
        return [
            new Friends("tung"),
            new Friends("phan")
        ]
    }
}

// The root provides the top-level API endpoints
var root = {
    getDie: function ({numSides}) {
        return new RandomDie(numSides || 6);
    }
}


app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(config.port, ()=> {
    console.log(`App listening ${config.port}!!`);
});