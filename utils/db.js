import mysql from 'mysql';


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'employeems'
})

con.connect(function(err){
    if(err){
        console.log("Connection is not established");
    }
    else{
        console.log("mysql connection is established.")
    }
})


export default con;