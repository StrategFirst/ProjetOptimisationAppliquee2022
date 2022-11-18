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