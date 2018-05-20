'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/diary',
  //'postgres://postgres:postgres@localhost/diary',
  { logging: false });
const Memo = sequelize.define('Memo', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  memoTitle :{
    type: Sequelize.STRING
  },
  memoContent: {
    type: Sequelize.STRING
  },
}, {
  freezeTableName: true,
  timestamps: true
});

Memo.sync();
module.exports = Memo;