const userDB = require('../model/model');
const ExcelJs = require('exceljs');
const schedule = require('node-schedule');
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: 'content can not be empty' });
        return;
    }

    const user = new userDB({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        status: req.body.status
    })

    console.log(user);

    user.save(user).then(data => {
        // res.send(data)
        res.redirect('/')
    }).catch(err => {
        res.status(500).send({
            message: err.message || "some error occurred while creating a create operation"
        })
    })
}
exports.find = (req, res, next) => {
    if (req.query.id) {
        const id = req.query.id;
        userDB.findById(id).then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id " + id })
            } else {
                res.send(data)
            }
        }).catch(err => {
            res.status(500).send({ message: 'Error retrieving user with id' + id })
        })
    } else {
        userDB.find().then(user => {
            req.entries = user;
            res.send(user);
            next();
        }).catch(err => {
            res.status(500).send({ message: err.message || 'Error occurred during retrieving user information' })
        })
    }
}

exports.downloadExcel = async(req, res) => {
    try {
        console.log('I am called')
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('data');
        worksheet.columns = [
            { header: 'S.no', key: 's_no', width: 10 },
            { header: 'Name', key: 'name', width: 32 },
            { header: 'Email', key: 'email', width: 32 },
            { header: 'Gender', key: 'gender', width: 15 },
            { header: 'Status', key: 'status', width: 10 },

        ];
        let count = 1;
        const entires = req.entries;
        entires.forEach(e => {
            e.s_no = count;
            worksheet.addRow(e);
            count += 1;
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        workbook.xlsx.writeFile('download.xlsx');
        // const fileServer = new FileServer((error, request, response) => {
        //     response.statusCode = error.code || 500;
        //     response.end(error);
        // });
        // const serveRobots = fileServer.serveFile('./download.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // require('http').createServer(serveRobots).listen(8000);
        // res.redirect('http://localhost:8000/')
    } catch (e) {
        res.status(500).send(e.message);
    }
}

exports.downloadPdf = (req, res, next) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('example.pdf'));
    const entires = req.entries;
    let count = 1;
    doc.fontSize(20).text(`S_no name email gender status`).moveDown();
    for (i in entires) {
        doc.fontSize(14).text(`${count} | ${entires[i].name} | ${entires[i].email} | ${entires[i].gender} | ${entires[i].status}`).moveDown();
        count += 1;
    }
    doc.end();
    next();
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: 'Data to update can not be empty' })
    }

    const id = req.params.id;
    userDB.findByIdAndUpdate(id, req.body).then(data => {
        if (!data) {
            res.status(404).send({ message: `Cannot update user with ${id}` })
        } else {
            res.send(data)
        }
    }).catch(err => {
        res.status(500).send({ message: 'Error in updating user information' })
    })
}
exports.delete = (req, res) => {
    const id = req.params.id;
    userDB.findByIdAndDelete(id).then(data => {
        if (!data) {
            res.status(404).send({ message: `cannot delete with id ${id}` })
        } else {
            res.send({
                message: 'User was deleted successfully!'
            })
        }
    }).catch(err => {
        res.status(500).send({ message: 'Could not delete user with id=' + id })
    })
}

exports.autocomplete = (req, res) => {
    var regex = new RegExp(req.query["term"], 'i');

    userDB.find({ name: regex }, { 'name': 1 }).then(data => {
        if (!data) {
            res.status(404).send({ message: "Not found user with id " + id })
        } else {

            let result = [];
            if (data.length > 0) {
                data.forEach(user => {
                    let obj = {
                        id: user._id,
                        label: user.name
                    };
                    result.push(obj);
                })
            }
            res.jsonp(result)
        }
    }).catch(err => {
        res.status(500).send({ message: 'Error retrieving user with id' + id })
    })
}

exports.scheduler = (req, res, next) => {
    const date = new Date('2021-10-07 14:20:00');
    schedule.scheduleJob(date, () => {
        userDB.aggregate([{
            '$match': {
                'status': false
            }
        }]).then(data => {
            data.forEach(element => {
                let id = element._id.toString()
                userDB.findByIdAndDelete(id).catch(err => {
                    res.status(500).send({ message: 'Could not delete user with id=' + id })
                })
            });
        });
    })
    next();
}