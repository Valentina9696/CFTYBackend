const Sequelize = require('sequelize');

module.exports = function(sequelize){
  const profile = sequelize.define('profile', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.CHAR
    },
    first_name: {
      type:Sequelize.STRING
    },
    last_name: {
      type:Sequelize.STRING
    },
    bio: {
      type:Sequelize.STRING
    },
    portfolio: {
      type:Sequelize.STRING
    },
    phone_security_key: {
      type:Sequelize.STRING
    },
    phone_verified: {
      type:Sequelize.BOOLEAN
    }
  }, 
  {
    timestamp: true
  });

  return profile;
};