import express from "express";
import { exec } from "child_process";
import { config as loadEnv } from "dotenv";

loadEnv()

const app = express()

app.get('/api' , (req,res) => {
	exec( 'minizinc --output-mode json core/prog.mzn core/data.dzn' , ( err , stdout , stderr ) => {
		if( err != null ) {
			console.error( {err,stdout,stderr} );
			return res.sendStatus(500);
		}
		res.send( JSON.parse( stdout.replace(/-(-+)/g,'') ) );
	})
})

app.use('/' , express.static('interface'))

app.listen( process.env.WEB_PORT , () => { console.log(`App ready : http://localhost:${process.env.WEB_PORT}`) } )
