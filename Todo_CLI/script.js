#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname,"tasks.json");

if(!fs.existsSync(filePath)){
    fs.writeFileSync(filePath,"[]");
}

function readTask(){
    const data = fs.readFileSync(filePath,"utf8");
    return JSON.parse(data);
}

function writeTask(tasks){
    fs.writeFileSync(filePath,JSON.stringify(tasks,null,2));
}

const [,, command, ...args] = process.argv;

function getNextId(tasks){
    if(tasks.length == 0) return 1;
    return Math.max(...tasks.map(t => t.id)) + 1;
}

switch(command){
    case "add": {
        const taskDescription = args.join(" ").trim();
        if(!taskDescription){
            console.log("Please provide task description");
            break;
        }

        const tasks = readTask();
        const now = new Date().toISOString();

        const newTask = {
            id: getNextId(tasks),
            description: taskDescription,
            status: "todo",
            createdAt: now,
            updatedAt: now
        };

        tasks.push(newTask);
        writeTask(tasks);
        console.log(`Task addded successfully (ID: ${newTask.id})`);
        break;
    }
    case "update": {
        const [idStr, ...descArr] = args;
        const id = parseInt(idStr);
        const newDesc = descArr.join(" ").trim();

        if(!id || !newDesc){
            console.log("Usage: task-cli update<id> <new description>");
            break;
        }

        const tasks = readTask();
        const task = tasks.find(t => t.id === id);

        if(!task){
            console.log("Task not found.");
            break;
        }

        task.description = newDesc;
        task.updatedAt = new Date().toISOString();

        writeTask(tasks);
        console.log("Task updated successfully");
        break;
    }

    case "delete": {
        const id = parseInt(args[0]);
        if(!id){
            console.log("Usage: task-cli delete <id>");
            break;
        }

        const tasks = readTask();
        const filtered = tasks.filter(t => t.id !== id);

        if(filtered.length === tasks.length){
            console.log("Task not found");
            break;
        }

        writeTask(filtered);
        console.log("Task deleted successfully");
        break;
    }

    case "mark-in-progress":
    case "mark-done": {
        const id = parseInt(args[0]);
        if(!id){
            console.log(`Usage: task-cli ${command} <id>`);
            break;
        }

        const tasks = readTask();
        const task = tasks.find(t => t.id === id);

        if(!task){
            console.log("Task not found.");
            break;
        }

        task.status = command === "mark-in-progress" ? "in-progress" : "done";
        task.updatedAt = new Date().toISOString();

        writeTask(tasks);
        console.log(`Task marked as ${task.status}.`);
        break;
    }

    case "list":{
        const filter = args[0];
        const tasks = readTask();

        let filteredTasks = tasks;
        if(filter){
            if(!["done","todo","in-progress"].includes(filter)){
                console.log("Invalid filer. Use: done | todo | in-progress");
                break;
            }
            filteredTasks = tasks.filter(t => t.status === filter);
        }

        if(filteredTasks.length === 0){
            console.log("No tasks found");
            break;
        }

        console.log("\n TaskList:");
        filteredTasks.forEach(t =>{
            console.log(
                `#${t.id} | ${t.description} | Status:  ${t.status} | Created: ${t.createdAt} | Updated: ${t.updatedAt}`
            );
        });
        console.log();
        break;
    }

    default:
        console.log(`
            Usage:
                task-cli add "<description>"
                task-cli update <id> "<new description>"
                task-cli delete <id>
                task-cli mark-in-progress <id>
                task-cli mark-done <id>
                task-cli list [done|todo|in-progress]
        `);
}


