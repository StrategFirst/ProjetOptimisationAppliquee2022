import express from "express";
import { exec } from "child_process";
import { config as loadEnv } from "dotenv";
import bodyParser from "body-parser";
import { writeFileSync } from 'fs';

loadEnv()

const app = express()

app.use( bodyParser.json() );

app.get('/api' , (req,res) => {
	exec( 'minizinc --output-mode json core/prog.mzn core/data.dzn' , ( err , stdout , stderr ) => {
		if( err != null ) {
			console.error( {err,stdout,stderr} );
			return res.sendStatus(500);
		}
		res.send( JSON.parse( stdout.replace(/-(-+)/g,'') ) );
	})
})

app.post('/api/duo' , (req,res) => {
	let query = req.body;
	let now = `query/data_${+(new Date())}.dzn`;

	writeFileSync( now , query.data , {} )
	exec( `minizinc --output-mode json core/prog.mzn ${now}` , ( err , stdout , stderr ) => {
		if( err != null ) {
			console.error( {err,stdout,stderr} );
			return res.sendStatus(500);
		}
		res.send( JSON.parse( stdout.replace(/-(-+)/g,'') ) );
	})
})

app.use('/' , express.static('interface'))

app.listen( process.env.WEB_PORT , () => { console.log(`App ready : http://localhost:${process.env.WEB_PORT}`) } )
