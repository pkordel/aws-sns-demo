const express = require('express');
const app = express();

const AWS = require('aws-sdk');
const credentials = new AWS.SharedIniFileCredentials({profile: 'sns_profile'});
const sns = new AWS.SNS({ credentials: credentials, region: 'us-east-1' });

const port = 3000;

app.use(express.json());

app.get('/status', (req, res) => res.json({ status: "ok", sns: sns }));
app.post('/subscribe', (req, res) => {
    let params = {
        Protocol: 'EMAIL',
        TopicArn: 'arn:aws:sns:us-east-1:092862054237:Order_123456',
        Endpoint: req.body.email
    };
    
    sns.subscribe(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.send(data);
        }
    });
});
app.post('/send', (req, res) => {
    let params = {
        Message: req.body.message,
        Subject: req.body.subject,
        TopicArn: 'arn:aws:sns:us-east-1:092862054237:Order_123456'
    };

    sns.publish(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
})

app.listen(port, () => console.log(`SNS App listening on port ${port}!`));