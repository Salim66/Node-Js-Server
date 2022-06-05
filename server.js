import http from 'http';
import { readFileSync, write, writeFileSync } from 'fs';
import { findAsId } from './utility/function.js';
import dotenv from 'dotenv';


// Environtment Init
dotenv.config();
const PORT = process.env.SERVER_PORT;


const students_json = readFileSync('./data/students.json');
const students_obj = JSON.parse(students_json);




http.createServer((req, res) => {

    res.writeHead(200, { 'Content-Type' : 'application/json' })

    if(req.url == '/api/students' && req.method == 'GET'){

        res.end(students_json);
        
    }else if(req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method == 'GET'){

        let id = req.url.split('/')[3];
        
        if(students_obj.some( stu => stu.id == id )){
            res.end(JSON.stringify(students_obj.find( stu => stu.id == id )));
        }else {
            res.end(JSON.stringify({
                message : 'Student not found!'
            }))
        }
    
    }else if(req.url == '/api/students' && req.method == 'POST'){

        // req data
        let data = '';
        req.on('data', (chunk) => {
            data += chunk.toString();
        });
        req.on('end', () => {
            let { name, skill, age, location } = JSON.parse(data);

            students_obj.push({
                id : findAsId(students_obj),
                name : name,
                skill : skill,
                age : age,
                location : location
            });
            writeFileSync('./data/students.json', JSON.stringify(students_obj));

        });

        res.end(JSON.stringify({
            message : 'I am form Student Post'
        }));

    }else {
        res.end(JSON.stringify({
            message : 'Data not found!'
        }));
    }


}).listen(PORT, () => {
    `Server is running on port ${PORT}`
});