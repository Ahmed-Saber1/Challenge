const jws = require('jsonwebtoken'); 
const Ajv = require('ajv');
const { checkIfIdExists } = require('../controllers/api');
const { getSwagger } = require('../utils/utils');
const secret = process.env.SECRET || "LookAtMe";

function authRequest (req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({msg: "Unauthorized Request"});
    
    try{
        const token = authorization.split(' ')[1];
        const user = jws.verify(token, secret);
        if (req.params.collection.toLowerCase() != 'users' && 
        ( user.role === 'superAdmin' || req.params.collection.toLowerCase() != 'schools' || req.method.toUpperCase() === 'GET' )){
            req.user = user;
            next();
        }
        else {
            res.status(401).json({
                code: "401",
                message: "Unauthorized"
            });
        }
    }catch(err){
        res.status(401).json({
            code: "401",
            message: "Invalid Token"
        });
    }
}

async function validate(req, res, next){
    try{
        const api = getSwagger();
        let paths = api.paths;
        let schema;
        if(req.params.id) schema = paths[`/${req.params.collection}/{id}`][req.method.toLowerCase()]['requestBody']['content']['application/json']['schema']['content']['application/json'].schema;
        else schema = paths[`/${req.params.collection}`][req.method.toLowerCase()]['requestBody']['content']['application/json']['schema']['content']['application/json'].schema;
        
        if(schema){
            // Ajv is a swagger validator to ensure all required fields are present in the request body.
            const ajv = new Ajv({ allErrors: true, strict: false });
            const validate = ajv.compile(schema);
            const valid = await validate(req.body);
            if(valid) {
                if (req.params.collection != 'schools'){
                    let result;

                    if (req.params.collection === 'classrooms') result = await checkIfIdExists(req.body.schoolId, 'schools');
                    else if (req.params.collection === 'students') result = await checkIfIdExists(req.body.classroomId, 'classrooms');

                    if (!result.exists){
                        res.status(result.code).json({
                            code: `${result.code}`,
                            message: result.msg
                        });
                    }else next();
                    
                }else next();
                
            }
            else {
                const description = validate.errors;
                res.status(403).json({
                    code: "403",
                    errors: description
                });
            }
        }else {
            res.status(404).json({
                code: "404",
                message: "The requested resource does not exist / cannot be found"
            });  
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            code: "500",
            message: "Internal Error"
        });
    }
}

module.exports = { 
    authRequest,
    validate
};