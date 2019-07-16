I have started the back end server using nodejs
server.js is the main file
First make sure you have installed nodejs you can check this by typing in your console: node -v
To install nodejs the command is: npm install nodejs -g
To install dependencies: npm install --save dotenv cookie-parser express express-session
Then to run the server type into your console: node server.js


server.js is the entry point
a new module can be created by:
1 adding a new .js file with the name of your choosing in the same folder you will find server.js
2 export all of your modules functions
example:
exports.myfunction=function(){
    /*code for myfunction goes here*/
}

new server files can be coded by
1 adding a new folder in serverroot
2 in the new folder add two files static.js and index.js
3 in static.js the contents should be 'false' without the single quotes and without a semi-colon
4 in index.js you should export the function start with two paramaters for the server request, and the server response
example:
exports.start=function(req,res){
    /*your code goes here*/
    }

new static files can be coded by:
1 adding a new folder in wwwroot
2 in the new folder you can add index.html or index.htm
3 also create a new folder in serverroot using the same folder name added in step 1
4 add static.js to the folder in step 3
5 make the contents in static.js 'true' without the single quotes, and without a semi-colon