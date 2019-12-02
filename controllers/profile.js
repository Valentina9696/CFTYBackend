const models = require('../models');
const { reducedErrorMessage, errorResponse } = require('../modules/utils');
const sequelize = require('sequelize');
const Op = sequelize.Op;

exports.createProfile = async (req, res) => { // eslint-disable-line
  models.profile.create({
    user_id: req.query.user_id,
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    bio: req.query.bio,
    portfolio: req.query.portfolio
  }).then((obj) => 
    {
      if(obj)
      {
        return res.json({ status: 'ok', data: obj});
      }
      else
      {
        return res.json({ status: 'fail', message: "profile create failed"});
      }
    }
  )
};

exports.readProfile = async (req, res) => { // eslint-disable-line
  models.profile.findOne({
    where: {user_id: req.query.user_id},
    attributes: ['id', 'first_name', 'last_name', 'bio', 'portfolio']
  }).then((obj) =>
    {
      if(obj)
      {
        return res.json({ status: 'ok', data: obj});
      }
      else
      {
        return res.json({ status: 'ok', message: "no matching userid"});
      }
    }
  )
};

exports.updateProfile = async (req, res) => { // eslint-disable-line
  models.profile.find({
    where: {user_id: req.query.user_id},
  }).then((obj) => 
    {
      if(obj)
      {
        obj.update(
          {
            first_name: req.query.first_name,
            last_name: req.query.last_name,
            bio: req.query.bio,
            portfolio: req.query.portfolio
          }
        )
        return res.json({ status: 'ok', data: "update success"});
      }
      else
      {
        return res.json({ status: 'ok', message: "update failed"});
      }
    }
  )
  .catch(err => {
    return res.json({ status: 'err' });
  })
};

exports.deleteProfile = async (req, res) => { // eslint-disable-line
  models.profile.destroy({
    where: {user_id: req.query.user_id}
  }).then((obj) => 
    {
      if(obj)
      {
        return res.json({ status: 'ok', message: "delete profile successfully"});
      }
      else
      {
        return res.json({ status: 'fail', message: "delete profile failed"});
      }
    }
  )
};

exports.portfolioUpload =  (req, res) => {
  // Upload portfolio image
  let ts = Date.now();
  let imageFile = req.files.file;
  let fileName = ts + imageFile.name.slice(-4);

  imageFile.mv(`${__dirname}/../assets/portfolio/` + fileName, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ status: 'ok', filename: fileName});
  });
};

exports.totalNum =  (req, res) => {
  // Upload portfolio image
  models.profile.findOne({
    attributes: [[sequelize.fn('COUNT', sequelize.col('*')), 'num']]
  }).then((obj) => {
    if(obj) 
    {
      return res.json({ status: 'ok', totalNum: obj.dataValues.num });
    }
    return res.json({ status: 'error' });
  })
  .catch(err => {
    return res.json({ status: 'error' });
  })
};

exports.readPage = async (req, res) => { // eslint-disable-line
  let totalCount;
  let page = parseInt(req.query.page);
  let data;
  let pageSize = parseInt(req.query.pageSize);
  
  models.profile.findOne({
    attributes: [[sequelize.fn('COUNT', sequelize.col('*')), 'num']]
  }).then((obj) => 
    {
      if(obj)
      {
        totalCount = obj.dataValues.num;
        models.profile.findAll({
          // where: {
          //   id: {
          //     [Op.and]: {
          //       [Op.lt]: pageSize * page + 1,
          //       [Op.gt]: pageSize * (page - 1)
          //     }
          //   }
          // }
          offset: page - 1, limit: pageSize
        }).then((val) => 
        {
            if(val)
            {
                let tmp = [];
                val.forEach(element => {
                  tmp.push(element);
                });
                data = tmp;
                console.log(totalCount);
                return res.json({ status: 'ok', data: {totalCount: totalCount, page: page, data: data }});
            }
            else
            {
                return res.json({ status: 'error' });
            }
          })
      }
      else
      {
        return res.json({ status: 'error' });
      }
    }
  )
  .catch(err => {
    return res.json({ status: 'error' })
  });
};


