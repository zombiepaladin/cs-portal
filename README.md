# cs-portal

This project is the server side of a web application framework for hosting web applications under the Kansas State University banner.  It integrates with the Kansas State University Central Authentication Service to authenticate users, and draws user identity information from the Kansas State Whitepages service.

## Development Environment Setup

__Note: These instructions are for developing in a Linux environment.  If you have a Windows development machine, I would recommend installing the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and using a recent version of Ubuntu.__

After cloning the repository, you will need to install all dependencies with the Node package manager.  This can be done at the terminal from within the project directory:

```
$ npm install
```

### PostgreSQL Setup

You will also need to have a PostgreSQL database set up and available.  See [https://www.postgresql.org/](https://www.postgresql.org/) for download links and setup instructions.

Once the PostgreSQL service is running, you will need to create a database for this project.  This can be done from the command-line tool, psql, installed with PostgresSQL:

Step 1: Switch to the "Postgres" user (as this user is allowed to alter the databases)

```
$ sudo su postgres
```

Step 2: Launch the psql tool:

```
$ psql
```

Step 3: Create a user for the application.  You can change the username (csappuser in the example) and password ('insecurepassword' in the exampe).  Write the username and password down, as you'll need them later:

```
psql$ CREATE USER csappuser WITH PASSWORD 'insecurepassword';
```

Step 4: Create the database for the application.  You can change the database name (csappdb in the example).  Also, set the user you created in step 3 as the owner:

```
psql$ CREATE DATABASE csappdb WITH OWNER csappuser;
```

Step 5: Exit psql

```
psql$ exit 
```

Step 6: Launch psql again, this time as the user you created in step 3, and connect to the database you created in step 4 (the dbname, user, and password should be those you wrote down earlier):

```
psql -d "host=localhost port=5432 dbname=csappsuser user=csappsdb password=ins
ecurepassword"
```

Step 7: Create the database tables by running the scripts found in the /database/schema directory:

```
psql$ \i \database\schema\01-create-users.sql
```

### Environment Setup

Now that the database is ready, you will need to set the environment variables that the node application needs to find in order to connect to it.

Step 1: Copy the .env.example file to a file named .env

Step 2: Replace the values for DATABASE_NAME and DATABASE_USER with those you created when setting up PostgreSQL.  The other values should be able to stay as-is.

### Running the Server

With the setup finished, you can launch the server from the command line in the project directory with:

```
$npm start
```

Then, navigate your web browser to `http://localhost:PORT` where `PORT` is the port specified in your _.env_ file.



