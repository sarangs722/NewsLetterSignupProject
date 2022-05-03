const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { log } = require('console');
const { json } = require('express/lib/response');
const { setCharset } = require('express/lib/utils');
const secret = require('./secret.json');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.emailId;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/fe5353ce08";

    const options = {
        method: "POST",
        auth: secret.apiKey
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }
        else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
     
});


app.post("/failure", (req, res) => {
    res.redirect("/");
});

//process.env.PORT is for Heroku
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000.");
});