var fs = require('fs');
var co = require('co');
var axios = require('axios');

axios({
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    responseType: 'stream'
}).then(function (response) {
    response.data.pipe(fs.createWriteStream('song1.txt'));
    axios({
        url: 'https://jsonplaceholder.typicode.com/todos/2',
        responseType: 'stream'
    }).then(function (response) {
        response.data.pipe(fs.createWriteStream('song2.txt'));
        axios({
            url: 'https://jsonplaceholder.typicode.com/todos/3',
            responseType: 'stream'
        }).then(function (response) {
            response.data.pipe(fs.createWriteStream('song3.txt'));
            axios({
                url: 'https://jsonplaceholder.typicode.com/todos/4',
                responseType: 'stream'
            }).then(function (response) {
                response.data.pipe(fs.createWriteStream('song4.txt'));
                axios({
                    url: 'https://jsonplaceholder.typicode.com/todos/5',
                    responseType: 'stream'
                }).then(function (response) {
                    response.data.pipe(fs.createWriteStream('song5.txt'))
                })
            })
        })
    })
})

function readFilePromise(path) {
    return new Promise(function (reslove, reject) {
        fs.readFile(path, { encoding: 'utf-8' }, function (error, data) {
            if (error) reject(error);
            else reslove(data)
        })
    })
}

// Cach 1:
var readFiles = co.wrap(function* (files) {
    var values = [];
    for (let i = 0; i < files.length; i++) {
        values.push(yield readFilePromise(files[i]));
    }
    return values;
})

// Cach 2:
var readFiles2 = co.wrap(function* (files) {
    var values2 = yield files.map((file) => readFilePromise(file));
    return values2;
})
readFiles(['song1.txt', 'song2.txt', 'song3.txt', 'song4.txt', 'song5.txt',])
    .then(function (values) {
        console.log('Cach 1: ', values);
    })
readFiles2(['song1.txt', 'song2.txt', 'song3.txt', 'song4.txt', 'song5.txt',])
    .then(function (values) {
        console.log('Cach 2: ',values);
    })
