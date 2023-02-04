
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

int: tailleGrp;

 % Variables

array[1..nbPersonnes] of var (1..nbPersonnes): tuples;

var int: qualite; 

 % Fonction
function var int: fn_groupe(int: personne, int: numero) = 
	if (numero == 0) 
		then personne 
		else tuples[fn_groupe(personne, numero-1)]
	endif;
function var set of Style: fn_n_style_intersect(var int: personne, int: numero) = 
	if (numero == 0)
		then styles[personne]
		else ( fn_n_style_intersect(tuples[personne],numero-1) intersect styles[personne] )
	endif;

 % Contraintes

%le groupe est consistant : tous les membres du groupes sont ensembles et pas dans un autres groupes
constraint forall( i in (1..nbPersonnes) )( fn_groupe( i , tailleGrp ) = i );

% Deux musiciens jouant du même instrument ne peuvent pas être dans le même groupe
constraint 
	dropConstraintInstru 
	\/
	(
		forall( i in (1..nbPersonnes) )(
			forall( m in (1..(tailleGrp-1)) )(
				instrusments[ i ] != instrusments[ fn_groupe( i , m ) ]
			) 
		)
	);

% Les trois musiciens doivent habiter la même ville ( par transitivité pas besoin de tout vérifié )
constraint 
	dropConstraintCity
	\/
	(
		forall( i in (1..nbPersonnes) )(
			forall( m in (1..(tailleGrp-1)) )(
				villes[ i ] == villes[ fn_groupe( i , m ) ]
			)
		)	
	);

%le nombre d’heures voulues doit être dans le créneau Min - Max souhaité par les autres
constraint 
	dropConstraintTime
	\/
	(
		forall( i in (1..nbPersonnes) )(
			forall( m in (1..(tailleGrp-1)) )(
  				( nbHeuresHebdo[ i ] >= nbHeuresMin[ fn_groupe( i , m ) ] )
  				/\
  				( nbHeuresHebdo[ i ] <= nbHeuresMax[ fn_groupe( i , m ) ] )
			)
		)
	);		

%le niveau de chaque musicien du groupe doit être dans l’intervalle de niveau accepté par les autres musiciens
constraint 
	dropConstraintLevel
	\/
	(
		forall( i in (1..nbPersonnes) )(
			forall( m in (1..(tailleGrp-1)) )(
				( niveaux[ i ] >= niveauMin[ fn_groupe( i , m ) ] )
				/\
				( niveaux[ i ] <= niveauMax[ fn_groupe( i , m ) ] )
			)
		)
	);


%le nombre de style commun doit respecter les exigences de chacun
% /!\ il s'agit bien de l'intersection de tous les ensembles de styles et pas de l'intersection 2 à 2 !
constraint 
	dropConstraintStyle
	\/
	(
		forall( i in (1..nbPersonnes) )
		( 
			card( fn_n_style_intersect( i , tailleGrp-1 ) ) >= nbStylesMin[i] 
		)
	);


%anti symétrie
constraint forall( i in (1..nbPersonnes) )
	(
		sum(d in 1..tailleGrp)	
		(
			if fn_groupe(i,d) >  fn_groupe(i,d+1) 
				then 1 
				else 0
			endif
		) == tailleGrp - 1
	);

%definition de la qualite :
%% Somme des différences de niveau au sein d'un groupe
constraint qualite = 
	if versionNiveau then
		%% Somme des différences de niveau au sein d'un groupe
		sum( i in (1..nbPersonnes) )( abs( niveaux[i] - niveaux[ tuples[i] ] ) )
	else 
		%% Somme des différences de nombres d'heures hebdo au sein d'un groupe
		sum( i in (1..nbPersonnes) )( abs( nbHeuresHebdo[i] - nbHeuresHebdo[ tuples[i] ] ) )
	endif;


 % Solutions

solve minimize qualite;