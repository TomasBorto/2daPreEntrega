const { connect } = require("mongoose")
const { productsModel } = require("../models/products.model")
const { cartModel } = require("../models/carts.model")
require('dotenv').config()


const { ordenes } = require("./ordenes")
const { orderModel } = require("../models/orders.model")

let url = `mongodb+srv://tomas:Coder12345@clustercoder.hpfuzfq.mongodb.net/?retryWrites=true&w=majority`
// let url = `mongodb://localhost:27017/comision39730`

const objConfig = {
    connectDB: async () =>{
        try {
            await connect(url)
            console.log('Base de datos conectada')
        } catch (error) {
            console.log(error)
        }
       
        // insertar las ordenes
        // let result = await orderModel.insertMany(ordenes)

        // solicitar las ordenes
        // let result = await orderModel.find({})
        // console.log(result)

        // ejemplo uno 
        // const orders = await orderModel.aggregate([
        //     {
        //         // stage 1 
        //         $match: {size: 'medium'}
        //     },
        //     {
        //         // stage2
        //         $group:{_id:'$name', totalquantity: {$sum:"$quantity"}}
        //     }
        // ])
        
        // ejemplo dos 

        // http://localhost:8080/api/pizzareport?tamanno=medium
        // const { tamanno } = req.query

        const orders = await orderModel.aggregate([
            {
                // stage 1 
                $match: {size: 'medium'}
            },
            {
                // stage2
                $group:{_id:'$name', totalquantity: {$sum:"$quantity"}}
            },
            {
                $sort: {totalquantity: -1 }
            },
            {
                $group: {_id: 1, orders: {$push: '$$ROOT'}}
            },
            {
                $project:{
                    "_id": 0,
                    orders: "$orders"
                }                
            },
            {
                $merge: {
                    into: 'reports'
                }
            }

        ])

        console.log(orders)
    }    
}

module.exports = {
    objConfig
}