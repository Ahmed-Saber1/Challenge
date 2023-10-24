const { schoolDto } = require('../dto/schoolDto');
const { classroomDto } = require('../dto/classroomDto');
const { studentDto } = require('../dto/studentDto');
const generateUniqueId = require('generate-unique-id');

function sendDto(req, res, next){
    let dtoToUse = schoolDto;
    if (req.params.collection === 'classrooms') dtoToUse = classroomDto;
    else if (req.params.collection === 'students') dtoToUse = studentDto;
    req.usedDto = dtoToUse;
    next();
}

function prepareBody(req, res, next){
    if(req.method.toUpperCase() === 'POST'){
        req.body.id = generateUniqueId({
            length: 20,
            useLetters: true
        });
        req.body.createdAt = new Date().toISOString();
        const objectOrder = {
            'id': null
        }
        req.body = Object.assign(objectOrder, req.body);
    }
    req.body.updatedAt = new Date().toISOString();
    next();
}

module.exports = { 
    sendDto,
    prepareBody
};