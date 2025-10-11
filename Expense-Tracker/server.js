#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "expenses.json");

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
}

function readExpense() {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

function writeExpense(expenses) {
    fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));
}

const [, , command, ...args] = process.argv;

function getArgsValue(flag) {
    const index = args.indexOf(flag);
    if (index === -1 || index + 1 >= args.length) return null;
    return args[index + 1];
}

function getNextId(expenses) {
    if (expenses.length == 0) return 1;
    return Math.max(...expenses.map(t => t.id)) + 1;
}

switch (command) {
    case "add": {
        const description = getArgsValue("--description");
        const amount = parseFloat(getArgsValue("--amount"));

        if (!description) {
            console.log("Please provide expense Description");
            break
        }

        if (isNaN(amount) || amount <= 0) {
            console.log("Please provide a valid positive amount");
            break;
        }

        const expenses = readExpense();
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];

        const newExpense = {
            id: getNextId(expenses),
            date: formattedDate,
            description: description,
            amount: amount
        }

        expenses.push(newExpense);
        writeExpense(expenses);
        console.log(`Expense added successfully (ID: ${newExpense.id})`);
        break;
    }

    case "list": {
        const expenses = readExpense();

        if (expenses.length === 0) {
            console.log("No Expenses found");
            break;
        }

        console.log("\n# ID  Date        Description           Amount");
        console.log();

        expenses.forEach(t => {
            const id = String(t.id).padEnd(3);
            const date = t.date.padEnd(11);
            const desc = t.description.padEnd(20);
            const amount = `$${t.amount.toFixed(2)}`.padStart(8);
            console.log(`# ${id} ${date} ${desc} ${amount}`);
        });

        console.log();
        break;
    }

    case "summary": {
        const expenses = readExpense();

        if (expenses.length === 0) {
            console.log("No expenses found");
            break;
        }

        let total = 0;
        const monthArg = getArgsValue("--month");

        if (monthArg) {
            const month = parseInt(monthArg);
            if (isNaN(month) || month < 1 || month > 12) {
                console.log("Please provide a valid month number(1-12)");
                break;
            }

            const currentYear = new Date().getFullYear();

            const monthlyExpenses = expenses.filter(t => {
                const expDate = new Date(t.date);

                return (
                    expDate.getFullYear() === currentYear &&
                    expDate.getMonth() + 1 === month
                );
            });

            if (monthlyExpenses.length === 0) {
                console.log(`No expenses found for month ${month}`);
                break;
            }

            monthlyExpenses.forEach(t => total += Number(t.amount));

            console.log(`Total expenses for ${month}: $${total.toFixed(2)}`);
        } else {
            expenses.forEach(t => {
                total += Number(t.amount);
            })
            console.log(`Total expenses: $${total.toFixed(2)}`);
        }
        break;
    }

    case "delete": {
        const id = parseInt(getArgsValue("--id"));
        const expenses = readExpense();
        if (expenses.length === 0) {
            console.log("No Expenses flound");
            break;
        }

        if (!id || isNaN(id)) {
            console.log("Please provide a valid expense id");
            break;
        }
        const filtered = expenses.filter(t => t.id !== id);
        if (filtered.length === expenses.length) {
            console.log("Expense not found");
            break;
        }

        writeExpense(filtered);
        console.log(`Expense deleted successfully (ID ${id})`);
        break;
    }

    case "export":{
        const expenses = readExpense();

        if(expenses.length === 0){
            console.log("No expenses to export");
            break;
        }

        const csvHeader = "ID,Date,Description,Amount\n";
        const csvRows = expenses.map(t =>
            `${t.id},${t.date},"${t.description}",${t.amount}`
        );

        const csvData = csvHeader + csvRows.join("\n");

        const csvPath = path.join(__dirname,"expenses.csv");
        fs.writeFileSync(csvPath,csvData);

        console.log("Expenses exported successfully");
        break;
    }

    default:
        console.log(`
            Available commands:
            add --description <desc> --amount <num>
            list
            delete --id <num>
            summary
            summary --month <month>
            export
     `);
}
