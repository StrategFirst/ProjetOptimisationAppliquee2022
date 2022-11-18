document.getElementById('add').onclick = () => {
	let tr = document.createElement('tr');
	tr.innerHTML = `
					<td><input type="text"/> </td>
					<td><input type="number"/> </td>
					<td><input type="number"/> </td>
					<td><input type="text"/> </td>
					<td><input type="text"/> </td>
					<td><input type="text"/> </td>
					<td><input type="number"/> </td>
					<td><input type="number"/> </td>
					<td><input type="number"/> </td>
					<td><input type="number"/> </td>
					<td><input type="number"/> </td>`
	document.querySelector('#in tbody').appendChild(tr);
};

document.getElementById('remove').onclick = () => {
	let cible = document.querySelector('#in tbody');
	let rm = cible.lastElementChild;
	if (rm) { cible.removeChild(rm) }
};

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

	let constraints = [...document.querySelector('#constraints tbody').children]
	.map(tr => {
		let tab = [...tr.querySelectorAll('input')].map(input => input.checked);
		return tab;
	});

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

	fetch('/api/trio', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 
			data: fichier
		})
	})
	.then( res => res.json() )
	.then( liste => liste.pair.map( (a,b,t) => ([a-1,b,t[a-1]]) ) )
	.then( pair => pair.map( ([x,y,z]) => `<tr> <td>${names[x]}</td><td>${names[y]}</td><td>${names[z]}</td> </tr>` ).join`` )
	.then( html => document.getElementById('out').innerHTML = html )
};