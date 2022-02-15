
const express = require("express");
const https = require("https");     // to make a request for api

const bodyParser = require("body-parser");   // to make a request for posting the result

const app = express();

app.use(bodyParser.urlencoded ({extended: true}));

app.get("/" , function(req , res){

    res.sendFile(__dirname + "/index.html");     // to send the html file to the server
                                               
});   

app.post("/" , function(req , res){
    
    const query = req.body.cityName;
    const apiKey = "2064a70182f917e934041542dcbf7adf";
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit ;

    https.get(url , function(response) {
        console.log(response.statusCode);            // http -> statusCode -> we get 200,403,404 etc
        
        response.on("data" , function(data) {        // console.log(data); --> we get hexadecimal code
            const weatherData = JSON.parse(data);    // convert the hexadecimal into text (json form)
            
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<h1>The temperature in the " + query + " is : " + temp + " degree Celsius.</h1>");
            res.write("<img src=" + imageURL + ">");

            res.send();                       // we can write "res.send" only once 
        });
    });      
});




app.listen(3000 ,  function(){
    console.log("Server is running at port 3000");
});