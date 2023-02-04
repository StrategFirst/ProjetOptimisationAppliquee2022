document.getElementById('submit').onclick = () => exec(... (DOM_2_DZN()));

document.getElementById('grpsize').onchange = () => document.getElementById('grpsizetxt').innerText = document.getElementById('grpsize').value;
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

	NBPERSONNES=document.getElementById('grpsize').value;
	fichier += `tailleGrp=${NBPERSONNES};\n`;

	// Send the request
	fetch(`/api/groupes?allSolutions=${allSolutions}&minimize=${minimize}`, {
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
					names = liste.tuples[0].map((_, i) => i + 1)
				}

				for (let i in liste.tuples) {
					let soluce = liste.tuples[i];
					let tab = document.createElement('table');
					let p = document.createElement('p');
					p.innerHTML = `Solution n°${parseInt(i)+1}`;
					out.appendChild(p);
					let q = document.createElement('span');
					q.innerHTML = `Qualité : ${liste.qualite[i]}`;
					out.appendChild(q);
					let tuples = soluce.map((a, b, t) => ([a - 1, b, t[a - 1] - 1]));
					// Remove dupe but shifted output:
					let newtuples = [];
					let filtre = [];
					for(let T of tuples) {
						if( ! filtre[ T[0] ] ) {
							for(let K=0;K<NBPERSONNES;K++)
							filtre[ T[K] ] = true;
							newtuples.push( T );
						}
					}
					tuples = newtuples;
					//
					let html = tuples.map((T) => `<tr>${T.map( x => `<td>${names[x]}</td>` ).join``} </tr>`).join``;
					tab.innerHTML = html;
					out.appendChild(tab);
				}
			}
		})
		.catch((err) => {
			console.error(err);
			alert('Une erreur est survenu \n pensez à vérifier vos données.');
		})
};