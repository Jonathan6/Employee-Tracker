# Employee Tracker


## Description
An example content management system for a employee management backend. The goal of this project was to practice working with SQL to create a backend system that is manipulatable using JavaScript through MySQL.

## Table of Contents
- [Description](#description)
- [Employee Tracker Video Tutorial](#employee-tracker-video-tutorial)
- [Overview](#overview)
- [Promise Based Challenges](#promise-based-challenges)
- [Conclusion](#conclusion)

## Employee Tracker Video Tutorial

<details>
<summary>Click to Reveal</summary>

[Click](https://github.com/Jonathan6/Employee-Tracker) to be redirected to the website!

</details>

## Overview
This project was a lot of fun in that it was more complicated that the last few I have worked on. Working with MySQL2 was really enjoyable since having an actual backend made things organized and descriptive. Starting the project was difficult because I didn't know where to begin. I have seen a lot of copied code over time but actually working with it gave me a better idea on what certain lines did. Working with an actual backend language was tricky at first but with a good drawn out schema plan it was easy to execute and create using SQL. After competing the first few get statements I began to understand the process of working with the SQL database through MySQL2 and really gave me direction on how to create this application and ultimately proved to be a really fun project.

## Promise Based Challenges

A big challenge was working with SQL queries and inquirer since they were both promise based. Although the functionaly was easily chainable through then functions, this gave the program several nesting layers and made working on and updating the program extremely difficult. This was made apparent after completing the first insert function. To add a new employee we need to retrieve a list of all the current employees to list one as their manager, and all the roles to give the employee an available role. Therefore we need to run 2 queries, and a inquirer prompt which is 3 nested layers. Making these functions asynchronous removed all the layers and made the code really simple and direct.

## Conclusion

This was a great project and I could see several areas to continue development. Have an intro screen and after application screen would be easy additions to make sure things are running properly. Currenly there is no response after any of the functions. If the user already exists or something goes wrong there is no signal to the user. 