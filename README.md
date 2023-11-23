# Pledger.io - Front end application

![Sonatype Nexus (Releases)](https://img.shields.io/nexus/r/com.jongsoft.finance/pledger-ui?server=https%3A%2F%2Foss.sonatype.org)
![Sonatype Nexus (Snapshots)](https://img.shields.io/nexus/s/com.jongsoft.finance/pledger-ui?server=https%3A%2F%2Foss.sonatype.org)
![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/jongsoftdev/user-interface/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

-----------------------

**[Read the documentation](https://www.pledger.io)**

[Report Bug](https://jongsoftdev.atlassian.net/issues/?jql=issuetype%20%3D%20Bug%20AND%20project%20%3D%20FIN%20AND%20resolution%20%3D%20Unresolved%20ORDER%20BY%20priority%20DESC) - [Request Feature](https://jongsoftdev.atlassian.net/browse/FIN-23?jql=issuetype%20%3D%20Story%20AND%20project%20%3D%20FIN%20AND%20resolution%20%3D%20Unresolved%20ORDER%20BY%20priority%20DESC)

-----------------------

## About Pledger.io
Pledger.io is a "self hosted" application that helps in keeping track of your personal finances. 
It helps you keep track of your income and expenses to allow you to spend less many and save more.

Using Pledger.io you can keep track of your income vs spending as well as your credit card expenses.
Pledger.io has the following features:

* Categories to group expenses
* Budgets to track income vs. expenses
* Contract notifications
* Importing transactions from bank exports

## Get started

**Note:** the backend-end application can be found in the
[fintrack-application](https://bitbucket.org/jongsoftdev/fintrack-application) repository.
The [deployment](https://bitbucket.org/jongsoftdev/fintrack-deployment) build will bundle this front-end with the
backend system.

In this repository you will find the React based front-end for Pledger.io.

### Building the source

To build the application the following needs to be present on your local PC:

* NodeJS
* GIT for completing the checkout

You can build the application using the Gradle command:

    ./yarn install
    ./yarn run build

### Running the front-end

Please note that this front-end application will not work without a running backend server. By default, the development
mode requires the backend to run on port `8080`.

Run the following command to start the React application:

    yarn run start

After running the front-end can be accessed using the end-point:

    http://localhost:3000/

## License
Copyright 2023 Jong Soft Development

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
