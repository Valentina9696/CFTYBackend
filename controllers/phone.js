const models = require('../models');

const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const from = process.env.TWILIO_FROM;

const client = require('twilio')(accountSid, authToken);

function sendSms(body, to)
{
  return client.messages
    .create({
      body: body,
      from: from,
      to: to
    })
}

exports.sendSms = async (req, res) => {
  const phone_number = req.body.number;

  let security_key;
  while (true)
  {
    security_key = Math.floor(Math.random() * 1000000);
    if (security_key >= 100000 || security_key <= 999999)
      break;
  }
  const message = 'Your security code is ' +  security_key + '.';

  sendSms(message, phone_number)
    .then((message) => {
      models.profile.findOne({
        where: {user_id: req.body.user_id},
      }).then((obj) => 
        {
          if(obj)
          {
            obj.update(
              {
                phone_security_key: security_key
              }
            )
            return res.json({ status: 'ok', message: "Send message successfully."});
          }
          else
          {
            return res.json({status: 'fail', message: 'Send message failed. Please retry again.'});
          }
        }
      )
    })
    .catch((error) => {
      return res.json({status: 'fail', message: 'Send message failed. Please retry again.'});
    })
};

exports.checkKey = async (req, res) => {
  const code = req.body.code;
  const user_id = req.body.user_id
  
  models.profile.findOne({
    where: {user_id: user_id},
  }).then((obj) => 
    {
      if(obj)
      {
        if (obj.phone_security_key == code) {
          obj.update({
            phone_verified: 1
          })
          return res.json({ status: 'ok', message: "Congratulations!. You are verified."});
        } else {
          return res.json({ status: 'fail', message: "Wrong code."});
        }
      }
      else
      {
        return res.json({status: 'fail', message: 'First register, please.'});
      }
    }
  )
  .catch((err) => {
    return res.json({status: 'fail', message: 'Please try again.'});
  })
  sendSms(message, phone_number)
    .then((message) => {
      
    })
    .catch((error) => {
      return res.json({status: 'fail', message: 'Send message failed. Please retry again.'});
    })
};

