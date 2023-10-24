const SwaggerParser = require('swagger-parser');
const parser = new SwaggerParser()
const swagger = require('../swagger.json');

let api = {};

function getSwagger() {
    return api;
}

async function setSwagger(){
    try{
        api = await parser.dereference(swagger);
    }catch(err) {
        console.log(err);
    }
}

module.exports = { 
    getSwagger,
    setSwagger
};