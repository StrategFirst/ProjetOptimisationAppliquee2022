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
	fetch(`/api/duo?allSolutions=${allSolutions}&minimize=${minimize}`, {
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
					names = liste.duo[0].map((_, i) => i + 1)
				}

				for (let i in liste.duo) {
					let soluce = liste.duo[i];
					let tab = document.createElement('table');
					let p = document.createElement('p');
					p.innerHTML = `Solution n°${parseInt(i)+1}`;
					out.appendChild(p);
					let q = document.createElement('span');
					q.innerHTML = `Qualité : ${liste.qualite[i]}`;
					out.appendChild(q);
					let duo = soluce.map((a, b) => ([a - 1, b]));
					// Remove dupe but shifted output:
					let newDuo = [];
					let filtre = [];
					for(let D of duo) {
						if( ! filtre[ D[0] ] ) {
							filtre[ D[0] ] = true;
							filtre[ D[1] ] = true;
							newDuo.push( D );
						}
					}
					duo = newDuo;
					//
					let html = duo.map(([x, y]) => `<tr> <td>${names[x]}</td><td>${names[y]}</td> </tr>`).join``;
					tab.innerHTML = html;
					out.appendChild(tab);
				}
			}
		})
		.catch((err) => {
			console.error(err);
			alert('Une erreur est survenu \n pensez à vérifier vos données.');
		})
}