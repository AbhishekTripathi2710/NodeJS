#!/usr/bin/env node

const https = require('https');

const username = process.argv[2];

if (!username) {
    console.log("Usage: node script.js <github-username>");
    process.exit(1);
}

const url = `https://api.github.com/users/${username}/events`;

const options = {
    headers: {
        "User-Agent": "node.js",
        "Accept": "application/vnd.github.v3+json",
    },
};

https
    .get(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            if (res.statusCode === 404) {
                console.log(`Error: Github user ${username} not found`);
                return;
            }

            if (res.statusCode !== 200) {
                console.log(`Error: Failed to fetch data (Status Code: ${res.statusCode})`);
                return;
            }

            try {
                const events = JSON.parse(data);

                if (events.length === 0) {
                    console.log(`No recent public activity found for ${username}`);
                    return;
                }

                console.log(`\n Recent Github Activity for ${username}:\n`);

                events.slice(0, 10).forEach((event) => {
                    const repo = event.repo ? event.repo.name : "unknown repository";

                    switch (event.type) {
                        case "PushEvent":
                            const commits = event.payload.commits ? event.payload.commits.length : 0;
                            console.log(`- Pushed ${commits} commit(s) to ${repo}`);
                            break;

                        case "IssuesEvent":
                            console.log(`-${event.payload.action} an issue in ${repo}`);
                            break;

                        case "WatchEvent":
                            console.log(`-Starred ${repo}`);
                            break;

                        case "ForkEvent":
                            console.log(`-Forked ${repo}`);
                            break;

                        case "CreateEvent":
                            console.log(`-Created a new ${event.payload.ref_type} in ${repo}`);
                            break;

                        case "PullRequestEvent":
                            console.log(`-${event.payload.action} a pull request in ${repo}`);
                            break;

                        default:
                            console.log(`-${event.type.replace("Event", "")} on ${repo}`);
                    }
                });

                console.log("\n End of recent activity \n");
            } catch (err) {
                console.error("Error parsing API response", err.message);
            }
        })
    })
    .on("error",(err) => {
        console.error("Network error: ",err.message);
    })