const passport=require('passport');
const mongoose=require('mongoose');
const Person=require('../models/Person')

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const myurl=require('../setup/myurl');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myurl.secret;

module.exports=passport =>{
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
        Person.findById(jwt_payload.id)
        .then(person=>{
            if(person){return done(null,person)}
            return done(null,false);
        })
        .catch(err=>{console.log(err)})
    }))
}