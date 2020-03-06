=== Brainjobs ===

	Autori: (cognome nome) 
		Marino Mario
		Tropeano Pietro


== Scelte progettuali ==
	
	Il Client comunica con il Gateway che reindirizza
	le richieste al Backend.
	
	Il Gateway funge da interfaccia e, ispirato ai principi del design
	pattern Facade, non elabora in alcun modo le richieste, nè tiene 
	traccia di esse;
	
	Gateway e Backend sono stati realizzati in NodeJs, utilizzando
	express per esporre le REST API.

	Per aderire il più possibile ai principi REST, abbiamo adottato
	i JSON Web Token, all'interno dei quali sono codificati l'username
	e la data di scadenza della sessione; quando vengono effettuate
	le richieste "GET /jobs", "GET /jobs/id" e "POST /jobs"
	i client specificano fra gli header questo token,
 	così che il server possa provvedere all'autorizzazione senza tenere
	traccia della sessione, sarà infatti il client a dover conservare
	il token fra i cookie.

	I jobs vengono salvati permanentemente in un DB SQLite.
	Abbiamo scelto SQLite in quanto serverless e consente di mantenere
	le linee guida circa l'architettura proposte nella traccia del progetto.

	Per rendere immediata l'esecuzione del progetto, abbiamo realizzato uno
	script che configura automaticamente tutti i parametri necessari
	ai server e, successivamente, li avvia in parallelo.
	Come parametri abbiamo scelto:
	IP:
		l'ip della macchina che gira i server
	porte:
		50000: backend
		50001: gateway
		50002: webserver
	
	qualora si fosse impossibilitati ad utilizzare almeno una di queste
	porte, o si volesse girare i singoli server su macchine diverse 
	ma connesse alla stessa rete, seguire i passaggi al punto 2
	della sezione "come eseguire il progetto"

	Lato client abbiamo scelto di utilizzare il framework materializecss,
 	utile per facilitare la gestione di particolari componenti,tra i 
	quali modal, navbar e collapsible, nonché per migliorare in
	modo semplice l'estetica.

	Data la necessità di implementare un ristretto numero di funzionalità
	abbiamo optato per una single-page application, che in un primo
	momento, quando non si è ancora autenticati, mostrerà esclusivamente 
	il modulo di login; le altre funzionalità saranno disponibili
	dopo il login.


== Dipendenze ==

	Installare nodeJs e npm, successivamente installare i moduli:
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
	
	per eseguire le installazioni dei moduli, dopo aver raggiunto 
	attraverso il comando "cd" le cartelle di riferimento, utilizzare
	il comando:
	npm install <nome_modulo>

	ATTENZIONE: Sono stati riscontrati problemi con l'installzione
		    delle dipendenze su Windows, si consiglia quindi di
		    testare il progetto su Linux.


== Come eseguire il progetto==

	1) Esecuzione automatica con autoconfig:

		In ambiente Linux, dopo aver installato le dipendenze, eseguire
		autoConfig.sh
	
	   	In ambiente Windows, dopo aver installato le dipendenze,
		eseguire autoConfig.bat 

	2) Configurazione ed esecuzione manuale:
	
		Indipendentemente dall'ambiente scelto, dopo aver installato le
		dipendenze, modificare il file configuration.js in:

		Backend:
			Inserire come port il numero di porta sulla quale si
			desidera girare il Backend.

		Gateway:
			Inserire come ip l'indirizzo ip del Backend, come port
			il numero di porta sulla quale si desidera girare il
			Gateway e come backend_port il numero di porta scelto
			per il Backend.

		Webserver:
			Inserire come port il numero di porta sulla quale si
			desidera girare il Webserver.

		Modificare inoltre il file gateway.js in Webserver/client
		impostando come ip l'ip del Gateway e come porta il
		numero di porta scelto per il Gateway.
			
		
		Una volta eseguite le modifiche ai file di configurazione
		è possibile eseguire il progetto spostandosi tramite shell
		nelle directory Backend, Gateway e Webserver e digitare:
		"node app.js" per eseguire rispettivamente Backend, Gateway
		e Webserver.
	
	Una volta che i 3 server sono attivi è possibile contattare il servizio
	attraverso URL all'indirizzo:

	http://ip_del_webserver:porta_del_webserver
	

== Come testare il progetto ==

	Per rendere intuitivo il testing del progetto abbiamo creato 3 account
	con i quali sarà possibile accedere (durata sessione: 15 minuti)
	e utilizzare il servizio.

	Account registrati nel db:

	username: admin
	password: admin

	username: roccoTanica
	password: gattini

	username: capitanFenomeno
	password: intersect

	Abbiamo inoltre popolato il DB con alcuni Job di esempio per
	ogni account.


== Conclusioni ==

	Il progetto è stato sviluppato per il corso di laurea triennale in
	informatica presso l'Università degli studi Milano Bicocca, A.A. 2018-2019
	Corso di Sistemi Distribuiti.
	Docenti: Flavio Maria De Paoli, Giuseppe Vizzari, Lorenzo Maria Salvalaglio,
		 Alessandro Tundo.

