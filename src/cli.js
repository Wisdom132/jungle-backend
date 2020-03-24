const fs = require("fs");
const path = require("path");
const inquirer = require('inquirer');
const modulePath = path.join(process.cwd() + "/src/app/")

let createModule = () => {
    return "Create Module command called"
}

let createModuleWithTest = () => {
    return "Create Module and test command called"
}


 let questions = [
  {
    type: 'input',
    name: 'module_name',
    message: "Please Give this Module a name"
  }]



export const cli =  (args)=> {
   let command = args.splice(2).toString(); //get actual command
    if(command === "-gen-module" || command === "-gen-m") {
            inquirer.prompt(questions)
            .then(answers => {
            let route = path.join(process.cwd() + `/src/app/${answers.module_name}`); 
            fs.mkdir(route,()=> {
               fs.writeFile(route+"/index.js",'//Hello Node.js', 'utf8', ()=> {
                   console.log("hewvhew")
               })
            })
        })
        .catch(error => {
            console.log(error)
        });
            }
    
    else if(command === "-gen-module-test" || command === "-gen-m-t" ){
        console.log(createModuleWithTest())
    }
    else {
        console.log("No Such Command...Please Check README.md file")
    }

}