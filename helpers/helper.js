exports.getID = () => {
	let lista = ["C","R","F","H","E","U","M","Q","N","0","5","S","W","X"];
	lista = lista.sort(function() {return Math.random() - 0.5});
 	lista = lista.toString();
 	let random='';	
 	for (let i = 0; i < lista.length; i++) {
 		if(lista[i] != ','){
 			random+=lista[i];
 		}
 	}

 	return random;
}
