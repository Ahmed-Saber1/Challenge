const SwaggerParser = require('swagger-parser');
const parser = new SwaggerParser()
const swagger = require('../swagger.json');

let api = {};
let secret = '';

function getSwagger() {
    return api;
}

function getSecret() {
    return secret;
}

async function init(){
    try{
        api = await parser.dereference(swagger);
        secret = process.env.SECRET;
    }catch(err) {
        console.log(err);
    }
}

module.exports = { 
    init,
    getSecret,
    getSwagger
};