// Handling the create system : append a new element at the end of the list
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

// Handling the remove system : remove the last element of the list
document.getElementById('remove').onclick = () => {
	let cible = document.querySelector('#in tbody');
	let rm = cible.lastElementChild;
	if (rm) { cible.removeChild(rm) }
};

// Sending the request with the file method
document.getElementById('submitWithFile').onclick = () => {
	document
		.getElementById('import-DZN')
		.files[0]
		.text()
		.then( exec , null )
};

// Usefull format conversion function 
const _1D_Array_ToDZN = (arr) => JSON.stringify(arr).replace(/"/g, '');
const _2D_Array_ToDZN = (arr) => `[${arr.map(S => `{${S.join`,`}}`).join`,`}]`;

// Create DZN File from the dom
function DOM_2_DZN() {
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


	let constraints = [...document.querySelectorAll('#constraints tbody input')].map(checkbox => !checkbox.checked)

	// Create the DZN file
	let fichier =
		`
dropConstraintCity = ${constraints[0]};
dropConstraintTime = ${constraints[1]};
dropConstraintStyle = ${constraints[2]};
dropConstraintInstru = ${constraints[3]};
dropConstraintLevel = ${constraints[4]};

nbPersonnes = ${result.nbPersonnes};

nbHeuresHebdo = ${_1D_Array_ToDZN(result.nbHeuresHebdo)};
niveaux = ${_1D_Array_ToDZN(result.niveaux)};

nbHeuresMin = ${_1D_Array_ToDZN(result.nbHeuresMin)};
nbHeuresMax = ${_1D_Array_ToDZN(result.nbHeuresMax)};
niveauMin = ${_1D_Array_ToDZN(result.niveauMin)};
niveauMax = ${_1D_Array_ToDZN(result.niveauMax)};
nbStylesMin = ${_1D_Array_ToDZN(result.nbStylesMin)};

instrusments = ${_1D_Array_ToDZN(result.instrusments)};
villes = ${_1D_Array_ToDZN(result.villes)};
styles = ${_2D_Array_ToDZN(result.styles)};

versionNiveau = ${document.getElementById('qualite1').checked};
`;

	return [fichier, names];

};
