const express = require('express')

const passport = require('passport')

//import the model of hobby
const Hobby = require('../models/hobby')
const User = require('../models/user');

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404;

const requireOwnership = customErrors.requireOwnership;


const requireToken = passport.authenticate('bearer', {session:false})

const router = express.Router();

//INDEX - get /hobbies
router.get('/hobbies',requireToken,(req,res,next) => {
     const userId = req.user.id
    Hobby.find({owner:userId})
    .then((hobbies) => {
        res.status(200).json({hobbies:hobbies})
    })
    .catch(next);
})

router.get('/hobbies/all',(req,res,next) => {
    const type = req.query.type
    const city = req.query.city
    let obj;

    if( (city.length != 0  && type != 'Choose') && (type.length != 0 && type != 'Choose' ) ){
        obj = {"type":type,"city":city}
    }else if(type.length != 0 && type != 'Choose'){
        obj = {"type":type}
    }else if(city.length != 0 && city != 'Choose'){
        obj = {'city':city}
    }else{
        obj = {}
    }


   Hobby.find(obj)
   .then((hobbies) => { 
        res.status(200).json({hobbies:hobbies})
    //    res.status(200).json(obj)
   })
   .catch(next);
})



// CREATE -post /hobbies
router.post('/hobbies',requireToken,(req,res,next) => {
    const newHobby = req.body.hobby
    const userEmail = req.user.email
    // console.log(userEmail)
    // console.log('xxxxxx:xxxx')
    // console.log(req.body)
    const userId = req.user.id
    newHobby.owner = userId
    newHobby.email = userEmail

    Hobby.create(newHobby)
    .then(hobby => {
        res.status(201).json({hobby:hobby})
    })
    .catch(next);
})


//SHOW - get /hobbies/:id
router.get('/hobbies/:id',requireToken,(req,res,next) => {
    const idHobby = req.params.id
    Hobby.findById(idHobby)
    .then(handle404)
    .then((hobby) => {
        requireOwnership(req,hobby)
        res.status(200).json({hobby:hobby})
    })
    .catch(next)
})


//ShowNoUser need
router.get('/hobbies/:id/home',(req,res,next) => {
    const idHobby = req.params.id
    Hobby.findById(idHobby)
    .then(handle404)
    .then((hobby) => {
        res.status(200).json({hobby:hobby})
    })
    .catch(next)
})

//Update -put/patch /hobbies/:id
router.put('/hobbies/:id',requireToken,(req,res,next) => {
    const idHobby = req.params.id;
    const updateHobby = req.body.hobby;


    Hobby.findById(idHobby)
    .then(handle404)
    .then((hobby) => {
        requireOwnership(req,hobby)
        return hobby.update(updateHobby)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})


//Destroy - delete /hobbies/:id
router.delete('/hobbies/:id',requireToken,(req,res,next) => {
    const idHobby = req.params.id
    Hobby.findById(idHobby)
    .then(handle404)
    .then((hobby) => {
        requireOwnership(req,hobby)
        hobby.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})



module.exports = router