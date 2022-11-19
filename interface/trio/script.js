document.getElementById('submit').onclick = () => exec(... (DOM_2_DZN()));

// Ask the server to process the data
function exec(fichier, names) {

	// Send the request
	fetch(`/api/trio?allSolutions=${document.getElementById('allSolutions').checked}`, {
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

				let i = 1;
				for (let soluce of liste.trio) {
					let tab = document.createElement('table');
					let p = document.createElement('p');
					p.innerHTML = `Solution n°${i++}`;
					out.appendChild(p);
					let trio = soluce.map((a, b, t) => ([a - 1, b, t[a - 1] - 1]));
					let html = trio.map(([x, y, z]) => `<tr> <td>${names[x]}</td><td>${names[y]}</td><td>${names[z]}</td> </tr>`).join``;
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