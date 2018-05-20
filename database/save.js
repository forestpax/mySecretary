'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/todo',
  //'postgres://postgres:postgres@localhost/diary',
  { logging: false });
const Diary = sequelize.define('Diary', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: Sequelize.STRING
  },
  caseName: {
    type: Sequelize.STRING
  },
  status: {
    //真偽値
    type: Sequelize.BOOLEAN
  }
}, {
  freezeTableName: true,
  timestamps: true
});

Diary.sync();
module.exports = Diary;