import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8000;


const schemaDate = mongoose.Schema({
    name: String,
    email: String,
    mobile: String
}, {
    timestamps: true
})
const userModul = mongoose.model('user', schemaDate)

//get == read
app.get('/', async (req, res) => {
    const date = await userModul.find({})
    res.json({success: true, date : date})
}) 

//create date and save in db
app.post('/create', async (req, res) => {
    console.log(req.body);
    const date = new userModul(req.body)
    await date.save()
    res.send({success: true, message: 'data save succesfully'})
})

//update data
app.put('/update', async (req, res) => {
    console.log(req.body);
    const {_id, ...rest} = req.body;
    await userModul.updateOne({_id : _id}, rest)
    res.send({success: true, message: 'data update successfull'})
})
//delete date 
app.delete('/delete/:id', async (req, res) => {
console.log(req.params);
    await userModul.deleteOne({_id : req.params.id})
    res.send({success: true, message: 'data delete succesfully'})
})

mongoose.connect("mongodb://127.0.0.1:27017/crud", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Server conect DB')
    app.listen(PORT, () => console.log(`Server running port on ${PORT}...`))
})
.catch((err) => console.log(err))

