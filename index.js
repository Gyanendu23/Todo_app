const express=require("express");
const bcrypt=require("bcrypt");
const {UserModel, TodoModel}=require("./db"); //imports
const jwt=require("jsonwebtoken");
const mongoose  = require("mongoose");
const {z}=require("zod");

const app=express();
const JWT_SECRET="";
mongoose.connect("");
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index_frontend.html");
})
app.use(express.json());
app.post("/signup",async function(req,res){

    //input valiadation
    const requiresBody=z.object({
        email:z.string().min(5).max(100).email(),
        password: z.string().min(10).max(15).refine(value => {
            // Regular expressions to check for at least one lowercase, one uppercase, and one special character
            const hasLower = /[a-z]/.test(value);
            const hasUpper = /[A-Z]/.test(value);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            return hasLower && hasUpper && hasSpecial;
        }, {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
        }),
        name:z.string().min(3).max(100)
    })
    // const parsedData=requiresBody.parse(req.body);//any one can be used
    const parsedDataWithSuccess=requiresBody.safeParse(req.body);

    if(!parsedDataWithSuccess.success){
        res.json({
            message:"credentials are wrong in format",  
            error:parsedDataWithSuccess.error// return the type of error
        })
        return;
    }

    const email=req.body.email; //should have @
    const password=req.body.password; //string, >10 char, 1spl, 1lowercase, 1uppercase
    const name=req.body.name;
    let errorTHrown=false; //we can send in json only once so, we will use this variable to see if user is already present or not, and if yes then don't crash the server jsut log user if there else signup them

    //Error catching email is repeated or password
    try{
        const hashedPass= await bcrypt.hash(password,5,)
        console.log(hashedPass);
        await UserModel.create({
            email:email,
            password:hashedPass,
            name:name
        })
    }catch(e){
        console.log("Error while putting in the DB");
        res.json({
            message:"User already Exists"
        })
        errorTHrown=true;
    }
    if(errorTHrown==false){
        res.json({
            message:"You are signed up"
        })
    }
});

app.post("/signin",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    const user=await UserModel.findOne({
        email:email
    })
    const matchedPass=await bcrypt.compare(password,user.password);
    if(user && matchedPass){
        const token=jwt.sign({
            id:user._id.toString()
        },JWT_SECRET);
        res.json({
            toekn:token
        })
    }
    else{
        res.status(403).json({
            message:"User not found, Please Signup"
        })
        
    }
});

function auth(req, res,next){
    const token=req.headers.token;
    const decodedData=jwt.verify(token,JWT_SECRET);
    if(decodedData.id){
        req.userId=decodedData.id;
        next();
    }
    else{
        res.status(403).json({
            message:"Wrong credentials"
        })
    }
}

app.post("/todo",auth,async function(req,res){
    const userId=req.userId;
    const title=req.body.title;
    const done=req.body.done;
    TodoModel.create({
        title:title,
        done:done,
        userId:userId
    })
    const todos=await TodoModel.find({
        userId:userId
    })
    res.json({
        todos,
        userId:userId
    })
});

app.get("/todos",auth,async function(req,res){
    const userId=req.userId;
    const todos=await TodoModel.find({
        userId:userId
    })
    res.json({
        todos,
        message:"Todo Created"
    })
});

app.delete("/todo/:id", auth, async function(req, res) {
    const userId = req.userId;
    const todoId = req.params.id;

    try {
        const result = await TodoModel.deleteOne({ _id: todoId, userId: userId });
        if (result.deletedCount === 1) {
            res.json({ message: "Todo deleted successfully" });
        } else {
            res.status(403).json({ message: "Unauthorized or Todo not found" });
        }
    } catch (e) {
        res.status(500).json({ message: "Something went wrong while deleting" });
    }
});

app.put("/todo/:id", auth, async function(req, res) {
    const { id } = req.params;
    const { done } = req.body;

    const updated = await TodoModel.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { $set: { done: done } },
        { new: true }
    );

    res.json({ message: "Todo updated", todo: updated });
});


app.listen(3000);
