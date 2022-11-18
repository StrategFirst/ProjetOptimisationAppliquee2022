document.getElementById('multiple').onclick = (e) => {
	if( e.target.nodeName.toLowerCase() == 'button' )
	document.querySelector('#multiple input').click();
}

document.getElementById('submit').onclick = () => {
	let listeDonnees = [...document.querySelector('#in tbody').children]
		.map(tr => {
			let tab = [...tr.querySelectorAll('input')].map(input => input.value);
			tab[5] = tab[5].split`,`.map(x => x.trim())
			return tab;
		});

	let result = { nbPersonnes: listeDonnees.length, nbHeuresHebdo: [], niveaux: [], nbHeuresMin: [], nbHeuresMax: [], niveauMin: [], niveauMax: [], nbStylesMin: [], instrusments: [], villes: [], styles: [] }

	let names = []
	for (let data of listeDonnees) {
		let [Nom, NbHeuresHebdo, Niv, Instru, Ville, Styles, NbHMin, NbHMax, NivMin, NivMax, NbStylesMin] = data;

		result.nbHeuresHebdo.push(NbHeuresHebdo);
		result.niveaux.push(Niv);
		result.nbHeuresMin.push(NbHMin);
		result.nbHeuresMax.push(NbHMax);
		result.niveauMin.push(NivMin);
		result.niveauMax.push(NivMax);
		result.nbStylesMin.push(NbStylesMin);
		result.instrusments.push(Instru);
		result.villes.push(Ville);
		result.styles.push(Styles);

		names.push(Nom);
	}

	let constraints = [... document.querySelectorAll('#constraints tbody input')].map( checkbox => ! checkbox.checked )

	let fichier =
`
dropConstraintCity = ${constraints[0]};
dropConstraintTime = ${constraints[1]};
dropConstraintStyle = ${constraints[2]};
dropConstraintInstru = ${constraints[3]};
dropConstraintLevel = ${constraints[4]};

nbPersonnes = ${result.nbPersonnes};

nbHeuresHebdo = ${JSON.stringify(result.nbHeuresHebdo).replace(/"/g, '')};
niveaux = ${JSON.stringify(result.niveaux).replace(/"/g, '')};

nbHeuresMin = ${JSON.stringify(result.nbHeuresMin).replace(/"/g, '')};
nbHeuresMax = ${JSON.stringify(result.nbHeuresMax).replace(/"/g, '')};
niveauMin = ${JSON.stringify(result.niveauMin).replace(/"/g, '')};
niveauMax = ${JSON.stringify(result.niveauMax).replace(/"/g, '')};
nbStylesMin = ${JSON.stringify(result.nbStylesMin).replace(/"/g, '')};

instrusments = ${JSON.stringify(result.instrusments).replace(/"/g, '')};
villes = ${JSON.stringify(result.villes).replace(/"/g, '')};
styles = [${result.styles.map(S => `{${S.join`,`}}`).join`,`}];
`;

	fetch(`/api/duo?allSolutions=${document.getElementById('allSolutions').checked}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 
			data: fichier
		})
	})
		.then( res => { if (res.status != 200) { throw res; } else { return res; } } )
		.then( res => res.json() )
		.then( liste => {
			if( liste.meta ) {
				document.getElementById('out').innerHTML = `<tr><td> ${liste.meta} </td></tr>`;
			} else {
				let out = document.getElementById('out'); 
				out.innerHTML = '';

				let i = 1;
				for(let soluce of liste.pair) {
					let tab = document.createElement('table');
					let p = document.createElement('p');
					p.innerHTML = `Solution n°${i++}`;
					out.appendChild(p);
					let pair = soluce.map( (a,b) => ([a-1,b]) );
					let html = pair.map( ([x,y]) => `<tr> <td>${names[x]}</td><td>${names[y]}</td> </tr>` ).join``;
					tab.innerHTML = html;
					out.appendChild(tab);
				}
			}
 		})
		.catch( () => alert('Une erreur est survenu \n pensez à vérifier vos données.') )
}