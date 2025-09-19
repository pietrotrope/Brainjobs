=== Brainjobs ===

Authors: (last name first name)  
	Marino Mario  
	Tropeano Pietro  


== Design choices ==

The Client communicates with the Gateway which redirects  
the requests to the Backend.  

The Gateway acts as an interface and, inspired by the principles of the  
Facade design pattern, it does not process the requests in any way,  
nor does it keep track of them;  

Gateway and Backend were implemented in NodeJs, using  
express to expose the REST APIs.  

To adhere as much as possible to REST principles, we adopted  
JSON Web Tokens, which encode the username  
and the session expiration date; when the requests  
"GET /jobs", "GET /jobs/id" and "POST /jobs" are made,  
the clients specify this token among the headers,  
so that the server can handle authorization without keeping  
track of the session. It will in fact be the client’s responsibility  
to store the token in the cookies.  

Jobs are permanently stored in an SQLite DB.  
We chose SQLite since it is serverless and allows us to follow  
the guidelines regarding architecture proposed in the project outline.  

To make project execution immediate, we created a script  
that automatically configures all necessary parameters  
for the servers and then starts them in parallel.  
We chose as parameters:  
IP:  
	the IP of the machine running the servers  
ports:  
	50000: backend  
	50001: gateway  
	50002: webserver  

If it is not possible to use at least one of these  
ports, or you wish to run the individual servers on different  
machines but connected to the same network, follow the steps in point 2  
of the section "how to run the project".  

On the client side we chose to use the materializecss framework,  
helpful to simplify the management of certain components, such as  
modal, navbar, and collapsible, as well as to easily improve  
the aesthetics.  

Given the need to implement only a small number of functionalities,  
we opted for a single-page application, which at first,  
when the user is not yet authenticated, will only display  
the login form; the other features will be available  
after login.  


== Dependencies ==

Install nodeJs and npm, then install the modules:  
	In Backend:  
		cors  
		express  
		jsonwebtoken  
		body-parser  
	In Gateway:  
		cors  
		express  
		request  
		body-parser  
	In Webserver:  
		express  

to install the modules, after navigating  
to the relevant folders using the "cd" command, use:  
npm install <module_name>  

ATTENTION: Issues have been found with dependency installation  
	   on Windows, so it is recommended to  
	   test the project on Linux.  


== How to run the project ==

1) Automatic execution with autoconfig:  

	On Linux, after installing the dependencies, run  
	autoConfig.sh  

   	On Windows, after installing the dependencies,  
	run autoConfig.bat  

2) Manual configuration and execution:  

	Regardless of the chosen environment, after installing the  
	dependencies, modify the file configuration.js in:  

	Backend:  
		Insert as port the port number on which you  
		want the Backend to run.  

	Gateway:  
		Insert as ip the ip address of the Backend, as port  
		the port number on which you want the  
		Gateway to run and as backend_port the port number chosen  
		for the Backend.  

	Webserver:  
		Insert as port the port number on which you  
		want the Webserver to run.  

	Also modify the file gateway.js in Webserver/client  
	by setting the ip to the Gateway’s ip and the port to the  
	port number chosen for the Gateway.  
		
	
	Once the configuration files have been modified  
	you can run the project by moving via shell  
	into the Backend, Gateway and Webserver directories and typing:  
	"node app.js" to run respectively Backend, Gateway  
	and Webserver.  

Once the 3 servers are active it is possible to contact the service  
through the URL at the address:  

http://webserver_ip:webserver_port  


== How to test the project ==

To make project testing intuitive we created 3 accounts  
which can be used to log in (session duration: 15 minutes)  
and use the service.  

Accounts registered in the db:  

username: admin  
password: admin  

username: roccoTanica  
password: gattini  

username: capitanFenomeno  
password: intersect  

We also populated the DB with some sample Jobs for  
each account.  


== Conclusions ==

The project was developed for the bachelor’s degree program in  
Computer Science at the University of Milano Bicocca, A.Y. 2018-2019  
Course of Distributed Systems.  
Professors: Flavio Maria De Paoli, Giuseppe Vizzari, Lorenzo Maria Salvalaglio,  
	    Alessandro Tundo.  
