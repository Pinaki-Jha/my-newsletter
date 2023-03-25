const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req,res){
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let emailID = req.body.emailID;
    console.log("DATA ACQUIRED: " + firstName + lastName + emailID )

    const data = {
        members: [     //members is an array that can have multiple user objects
            {          //Curly braces here cuz the elements 
                         //inside the members array are objects. We are only taking 
                         //in one object, though.
                email_address: emailID,
                status: "subscribed",
                merge_fields :{
                    FNAME: firstName,
                    LNAME: lastName
                }
            
            }
        ]
    }

    //converting to JSON data
    let jsonData = JSON.stringify(data);
    
    const url = "https://us21.api.mailchimp.com/3.0/lists/dcb2e800ac"
    const options ={
        method : "POST",
        auth : "pinaki:afb0937d794d08418f32d36a3eee3134-us21"
    }

    //using the https module to POST / REQUEST to an external server
    const request = https.request(url, options, function(response){
        if (response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data))
        })

    })
    request.write(jsonData);
    request.end();
})


app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running at port 3000...")
})

//afb0937d794d08418f32d36a3eee3134-us21
//dcb2e800ac
