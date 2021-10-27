const express = require('express');
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller');
const { Router } = require('express');
const userRouter = require('./userRoutes');

route.use('/api/usersToBeAuth', userRouter);
route.get('/', controller.scheduler, services.homeRoutes);

route.get('/add_user', services.addUser);

route.get('/update_user', services.updateUser);

route.get('/api/getOne/:id', services.renderOne);

route.get('/downloadExcel', controller.find, controller.downloadExcel);
route.get('/downloadPdf', controller.find, controller.downloadPdf);
route.get('/downloadVoucher', controller.downloadVoucher);
route.get('/uploadVoucherToDrive', controller.uploadVoucherToDrive);

route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);

route.get('/autocomplete/', controller.autocomplete)

module.exports = route