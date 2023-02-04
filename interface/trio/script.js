document.getElementById('submit').onclick = () => exec(... (DOM_2_DZN()));

// Ask the server to process the data
function exec(fichier, names) {

	let allSolutions = false;
	let minimize = false;
	const MODE = [... document.querySelectorAll('#mode input')].map( checkbox => checkbox.checked );
	switch( true ) {
		case MODE[0]: 
		allSolutions = false;
		minimize = false;
		break;
		
		case MODE[1]:
		allSolutions = true;
		minimize = false;
		break;

		case MODE[2]:
		allSolutions = false;
		minimize = true;
		break;
	}

	// Send the request
	fetch(`/api/trio?allSolutions=${allSolutions}&minimize=${minimize}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: fichier
		})
	})
		// Handle the response
		.then(res => { if (res.status != 200) { throw res; } else { return res; } })
		.then(res => res.json())

		// Edit the DOM
		.then(liste => {
			if (liste.meta) {
				document.getElementById('out').innerHTML = `<tr><td> ${liste.meta} </td></tr>`;
			} else {
				let out = document.getElementById('out');
				out.innerHTML = '';


				if (names == null) {
					names = liste.trio[0].map((_, i) => i + 1)
				}

				for (let i in liste.trio) {
					let soluce = liste.trio[i];
					let tab = document.createElement('table');
					let p = document.createElement('p');
					p.innerHTML = `Solution n°${parseInt(i)+1}`;
					out.appendChild(p);
					let q = document.createElement('span');
					q.innerHTML = `Qualité : ${liste.qualite[i]}`;
					out.appendChild(q);
					let trio = soluce.map((a, b, t) => ([a - 1, b, t[a - 1] - 1]));
					// Remove dupe but shifted output:
					let newTrio = [];
					let filtre = [];
					for(let T of trio) {
						if( ! filtre[ T[0] ] ) {
							filtre[ T[0] ] = true;
							filtre[ T[1] ] = true;
							filtre[ T[2] ] = true;
							newTrio.push( T );
						}
					}
					trio = newTrio;
					//
					let html = trio.map(([x, y, z]) => `<tr> <td>${names[x]}</td><td>${names[y]}</td><td>${names[z]}</td> </tr>`).join``;
					tab.innerHTML = html;
					out.appendChild(tab);
				}
			}
		})
		.then(scrollToOutput)
		.catch((err) => {
			console.error(err);
			alert('Une erreur est survenu \n pensez à vérifier vos données.');
		})
};