// module.exports = function(io) {
//     var app = require('express');
//     var router = app.Router();

//     router.get('/home', (req, res) => {
//         try {
//             console.log('1');
//             console.log(res.io);
//             res.send('thanh cong');
//             // currentonline
//         } catch (error) {
//             console.log(error);
//             res.json({ status: 3, msg: 'Lỗi: ' + error + '' });
//         }
//     });

//     return router;
// }