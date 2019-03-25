const request = require('request')

const forecast = (location, callback) => {
    const url =  `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${location.lat},${location.long}`;

    request({url, json:true}, (err,res)=>{
        if(err){ //Low level Error like no internet
            callback("Can't Connect to Geo Service");        
        } else if(res.body.error) { //Request Error
            callback("Can't find location") 
        } else {
            const {
                currently:{
                temperature,apparentTemperature, precipProbability, summary,windSpeed, icon
                }
            } = res.body;
            const currently = { 
                temperature,
                apparentTemperature,
                precipProbability,
                summary,
                windSpeed,
                icon
            }            
            callback(undefined,{
                currently
            });            
        }  
    })
}

module.exports = forecast