
 % Types

enum Instrument = { Guitare , Batterie , Piano , Basse , Violon, Triangle };
enum Ville = { Angers , Nantes };
enum Style = { Rock , Metal , Jazz , Pop , Classique , Punk , RnB , Rap , Electro , Funk };

 % Constantes

bool: versionNiveau;

bool: dropConstraintCity;
bool: dropConstraintTime;
bool: dropConstraintStyle;
bool: dropConstraintInstru;
bool: dropConstraintLevel;

int: nbPersonnes;

array[1..nbPersonnes] of int: nbHeuresHebdo; 
array[1..nbPersonnes] of int: niveaux;
array[1..nbPersonnes] of Instrument: instrusments;
array[1..nbPersonnes] of Ville: villes; 
array[1..nbPersonnes] of set of Style: styles; 
array[1..nbPersonnes] of int: nbHeuresMin; 
array[1..nbPersonnes] of int: nbHeuresMax;
array[1..nbPersonnes] of int: niveauMin; 
array[1..nbPersonnes] of int: niveauMax;
array[1..nbPersonnes] of int: nbStylesMin; 

 % Variables

array[1..nbPersonnes] of var (1..nbPersonnes): trio;

var int: qualite; 

 % Contraintes

%le trio est consistant : il s’agit donc d’un matching parfait, c’est à dire que si m est associé à m’ et m' à m'' alors m’’ est associé à m.
constraint forall( i in (1..nbPersonnes) )( trio[ trio[ trio[ i ] ] ] = i );

% Deux musiciens jouant du même instrument ne peuvent pas être dans le même trio
constraint 
	dropConstraintInstru 
	\/
	(
		forall( i in (1..nbPersonnes) )( instrusments[ i ] != instrusments[ trio[ i ] ] )
	);

% Les trois musiciens doivent habiter la même ville ( par transitivité pas besoin de vérifié le  villes[ i ] == villes[ trio[ trio [ i ] ] ] )
constraint 
	dropConstraintCity
	\/
	(
		forall( i in (1..nbPersonnes) )( villes[ i ] == villes[ trio[ i ] ] )
	);

%le nombre d’heures voulues doit être dans le créneau Min - Max souhaité par les autres
constraint 
  dropConstraintTime
  \/
  (
	forall( i in (1..nbPersonnes) )
		(
  			( nbHeuresHebdo[ i ] >= nbHeuresMin[ trio[ i ] ] )
  			/\
  			( nbHeuresHebdo[ i ] <= nbHeuresMax[ trio[ i ] ] )
  		/\
  			( nbHeuresHebdo[ i ] >= nbHeuresMin[ trio[trio[ i ] ]] )
  			/\
  			( nbHeuresHebdo[ i ] <= nbHeuresMax[ trio[trio[ i ] ]] )
		)
  );		

%le niveau de chaque musicien du trio doit être dans l’intervalle de niveau accepté par les autres musiciens
constraint 
	dropConstraintLevel
	\/
	(
		forall( i in (1..nbPersonnes) )
		(
  			( niveaux[ i ] >= niveauMin[ trio[ i ] ] )
  			/\
  			( niveaux[ i ] <= niveauMax[ trio[ i ] ] )
		/\
  			( niveaux[ i ] >= niveauMin[ trio[trio[ i ] ]] )
  			/\
  			( niveaux[ i ] <= niveauMax[ trio[trio[ i ] ]] )
		)
	);


%le nombre de style commun doit respecter les exigences de chacun
constraint 
	dropConstraintStyle
	\/
	(
		forall( i in (1..nbPersonnes) )
		( 
			card( ( styles[i] intersect styles[ trio[ i ] ] ) intersect styles[ trio[trio[ i ] ]] ) >= nbStylesMin[i] 
		)
	);


%anti symétrie
constraint forall( i in (1..nbPersonnes) )
	(	
		(
			(if i > trio[i] then 1 else 0 endif) +
			(if trio[i] > trio[trio[i]] then 1 else 0 endif) +
			(if trio[trio[i]] > trio[trio[trio[i]]] then 1 else 0 endif)
		) == 2
	);

%definition de la qualite :
constraint qualite = 
	if versionNiveau then
		%% Somme des différences de niveau au sein d'un trio
		sum( i in (1..nbPersonnes) )( abs( niveaux[i] - niveaux[ trio[i] ] ) )
	else 
		%% Somme des différences de nombres d'heures hebdo au sein d'un trio
		sum( i in (1..nbPersonnes) )( abs( nbHeuresHebdo[i] - nbHeuresHebdo[ trio[i] ] ) )
	endif;


 % Solutions

solve minimize qualite;