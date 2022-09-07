const express = require('express');
const app = require('../app');
const router = express.Router();
const Joi = require('joi') 

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
]

router.get('/courses', (req, res, next) => {
  res.send(courses);
})

router.get('/courses/:id', (req, res, next) => {
  let course = courses.find(course => course.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).send('The course with the given ID was not found.');
  } else {
    res.send(course);
  }
  // res.send(courses[req.params.id]);
})

// select
router.get('/courses/:name/:category', (req, res, next) => {
  res.send({
    name: req.params.name,
    category: req.params.category,
    query: req.query
  });
})

// insert
router.post('/courses', (req, res, next) => {
  const { error } = validateCourse(req.body);
  
  if (error) {
    res.status(404).send(error.details[0].message);
  } else {
    const course = {
      id: courses.length + 1,
      name: req.body.name
    };
    courses.push(course);
    res.send(course)
  }
  
  
})

// delete
router.delete('/courses/:id', (req, res, next) => {
  let course = courses.find(course => course.id === parseInt(req.params.id));

  if (!course) return res.status(404).send('The course with the given ID was not found.');

  const { error } = validateCourse(req.body);

  if (error) {
    res.status(404).send(error.details[0].message);
  } else {
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
  }
})

// update
router.put('/courses/:id', (req, res, next) => {
  const course = courses.find(course => course.id === parseInt(req.params.id))
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  const { error } = validateCourse(req.body);
  
  if (error) {
    res.status(404).send(error.details[0].message);
  } else {
    course.name = req.body.name;
    res.send(course);
  }
})

const validateCourse = (course) => {
  const schema = {
    name: Joi.string().min(3).required()
  }

  return Joi.validate(course, schema);
}

module.exports = router;
