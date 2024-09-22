import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
const router = express.Router();



router.post('/adminlogin', (req, res) => {
    console.log(req.body);       /*this console is checking for wether data is coming from frontend or not*/
    const sql = "SELECT * from admin Where email = ? and password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err)
            return res.json({ loginStatus: false, Error: "Query error" })
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign(
                { role: "admin", email: email }, 'jwt_secret_key', { expiresIn: '1d' },

            );
            res.cookie('token', token);
            return res.json({ loginStatus: true, });

        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" })

        }
    })
});


router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if (err)
            return res.json({ Status: false, Error: 'Query Error' })
        return res.json({ Status: true })
    })
});
router.get('/category', (req, res) => {
    const sql = "select * from category";
    con.query(sql, (err, result) => {
        if (err)
            return res.json({ Message: "Message Inside server" });
        return res.json(result);
    })
});
//image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})
//end image upload
router.post('/add_employee', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee (name, email, password,address, salary, image, category_id) VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.json({ Status: false, Error: "Query Error123" })
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.file.filename,
            req.body.category_id,

        ]
        con.query(sql, [values], (err, result) => {
            if (err)
                return res.json({ Status: false, Error: err })
            return res.json({ Status: true })
        })
    })
})

router.get('/employee', (req, res) => {
    const sql = 'SELECT * FROM employee';
    con.query(sql, (err, result) => {
        if (err)
            return res.json({ Message: 'Data is not found from employee' });
        return res.json(result);
    })

})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    const values = id;
    con.query(sql, [values], (err, result) => {
        if (err)
            return res.json({ Message: 'Data is not found from employee' });
        return res.json(result);


    })
})

router.post('/edit_employee', (req, res) => {
    const { id, name, email, salary, address } = req.body; // Ensure 'id' is sent to identify the employee to edit

    const sql = `UPDATE employee SET name = ?, email = ?, salary = ?, address = ? WHERE id = ?`;

    con.query(sql, [name, email, salary, address, id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: 'Query Error' });
        }
        return res.json({ Status: true, Message: 'Employee updated successfully' });
    });
});


router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM employee WHERE id =?`
    con.query(sql, [id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: 'Query Error' + err });
        }
        return res.json({ Status: true, Message: 'Employee updated successfully' });
    });
})

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin"
    con.query(sql, (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: 'Query Error' + err });
        }
        return res.json({ Status: true, Message: 'Admin Data fetched successfully', Result: result });
    });
})

router.get('/employee_count',(req, res)=>{
    const sql = "select count(id) as employee from employee"
    con.query(sql,(err,result)=>{
        if(err){
            return res.json({Status: false, Error: 'Query Error'+ err});

        }
        return res.json({Status: true, Message: 'Employee Data fetched Successfully', Result: result});
    })
})

router.get('/salary_count',(req, res)=>{
    const sql = "select sum(salary) as salary from employee";
    con.query(sql,(err,result)=>{
        if(err){
            return res.json({Status: false, Error: 'Query Error'+ err});

        }
        return res.json({Status: true, Message: 'Employee Data fetched Successfully', Result: result});
    })
})

router.get('/admin_records',(req, res)=>{
    const sql = "select * from admin";
    con.query(sql,(err,result)=>{
        if(err){
            return res.json({Status: false, Error: 'Query Error'+ err});

        }
        return res.json({Status: true, Message: 'Employee Data fetched Successfully', Result: result});
    })
})

router.get('/logout', (req,res)=>{
    
    res.clearCookie('token')
    return res.json({Status: true});
})

export { router as adminRouter }