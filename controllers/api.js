const mongoose = require('mongoose');

async function getAllItems (req, res){
    try{
        const { db } = mongoose.connection;
        const collection = req.params.collection;
        const options = {
            limit: req.query.limit ? parseInt(req.query.limit) : 25,
            skip: req.query.offset ? parseInt(req.query.offset) : 0,
            sort: { updatedAt: -1 }
        };

        if (options.limit === 0) res.status(204).json([]);

        let items = await db.collection(collection).find({}, options).toArray();
        
        var dtoItems = new Array();
        items.forEach(element => {
            dtoItems.push(req.usedDto(element))
        })

        res.status(200).json( dtoItems );
    }catch(err){
        res.status(500).json({
            code: "500",
            message: "Internal Server Error"
        });
    }
} 

async function getItem (req, res){
    try{
        const { db } = mongoose.connection;
        const collection = req.params.collection;

        let item = await db.collection(collection).findOne({ id: req.params.id });
        if (item == null) {
            res.status(404).json({
                code: "404",
                message: "Item Not Found"
            });
        }else {
            res.status(200).json( req.usedDto(item) );
        }
    }catch(err){
        res.status(500).json({
            code: "500",
            message: "Internal Server Error"
        });
    }
} 

async function postItem (req, res){
    try{
        const { db } = mongoose.connection;
        const collection = req.params.collection;
        const data = req.usedDto(req.body);

        let item = await db.collection(collection).insertOne(data);
        item = await db.collection(collection).findOne({ _id: item.insertedId});

        res.status(200).json( req.usedDto(item) );
    }catch(err){
        res.status(500).json({
            code: "500",
            message: "Internal Server Error"
        });
    }
} 

async function patchItem (req, res){
    try{
        const { db } = mongoose.connection;
        const collection = req.params.collection;
        req.body.id = req.params.id;
        let data = req.usedDto(req.body);
        delete data.createdAt;

        let item = await db.collection(collection).findOneAndUpdate({ id: req.params.id }, { $set: data }, { returnOriginal: false });
        if (!item || !item.value) {
            res.status(404).json({
                code: "404",
                message: "Item Not Found"
            });
        }else {
            let result = await db.collection(collection).findOne({ id: req.params.id });
            res.status(200).json( req.usedDto(result) );
        }
    }catch(err){
        res.status(500).json({
            code: "500",
            message: "Internal Server Error"
        });
    }
} 

async function deleteItem (req, res){
    try{
        const { db } = mongoose.connection;
        const collection = req.params.collection;
        const itemToDelete = await db.collection(collection).findOne({ id: req.params.id });
        if (itemToDelete == null) {
            res.status(404).json({
                code: "404",
                message: "Item Not Found"
            });
        }else {
            await db.collection(collection).deleteOne({ id: req.params.id });     
            res.status(200).json(req.usedDto(itemToDelete));
        }
    }catch(err){
        res.status(500).json({
            code: "500",
            message: "Internal Server Error"
        });
    }
} 

async function checkIfIdExists (itemId, collection, req, res){
    try{
        const { db } = mongoose.connection;

        let item = await db.collection(collection).findOne({ id: itemId });

        if (item == null) return { exists: false, code: 404 ,msg: `${collection} Id doesn't exist` };
        return { exists: true };
    }catch(err){
        console.log(err);
        return { exists: false, code: 500, msg: `Internal Error` };
    }
} 


module.exports = {
    getAllItems,
    getItem,
    postItem,
    patchItem,
    deleteItem,
    checkIfIdExists
};