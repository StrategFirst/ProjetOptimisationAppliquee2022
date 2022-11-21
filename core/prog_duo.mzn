
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

array[1..nbPersonnes] of var (1..nbPersonnes): duo;

var int: qualite; 


% Contraintes

% Le duo est consistant : il s’agit donc d’un matching parfait, c’est à dire que si m est associé à m’ alors m’ est associé aussi à m.
constraint 
  forall( i in (1..nbPersonnes) )
  ( 
    duo[ duo[ i ] ] = i 
  );

% Deux musiciens jouant du même instrument ne peuvent former un duo
constraint 
  dropConstraintInstru 
  \/ 
  (
    forall( i in (1..nbPersonnes) )( instrusments[ i ] != instrusments[ duo[ i ] ] )
  );

% Les deux musiciens doivent habiter la même ville
constraint 
  dropConstraintCity
  \/
  (
    forall( i in (1..nbPersonnes) )( villes[ i ] == villes[ duo[ i ] ] )
  );

% Le nombre d’heures voulues doit être dans le créneau Min - Max souhaité par l’autre
constraint 
  dropConstraintTime
  \/
  (
    forall( i in (1..nbPersonnes) )(
      ( nbHeuresHebdo[ i ] >= nbHeuresMin[ duo[ i ] ] )
      /\
      ( nbHeuresHebdo[ i ] <= nbHeuresMax[ duo[ i ] ] )
    )
  );

% Le niveau de chaque musicien du duo doit être dans l’intervalle de niveau accepté par l’autre musicien
constraint 
  dropConstraintLevel
  \/
  (
    forall( i in (1..nbPersonnes) )(
      ( niveaux[ i ] >= niveauMin[ duo[ i ] ] )
      /\
      ( niveaux[ i ] <= niveauMax[ duo[ i ] ] )
    )
  ); 

% Le nombre de style commun doit respecter les exigences de chacun
constraint 
  dropConstraintStyle
  \/
  (
    forall( i in (1..nbPersonnes) )
      ( 
        card( styles[i] intersect styles[ duo[ i ] ] ) >= nbStylesMin[i] 
      )
  );

%definition de la qualite :
%% Somme des différences de niveau au sein d'un trio
constraint qualite = 
	if versionNiveau then
		%% Somme des différences de niveau au sein d'un trio
		sum( i in (1..nbPersonnes) )( abs( niveaux[i] - niveaux[ duo[i] ] ) )
	else 
		%% Somme des différences de nombres d'heures hebdo au sein d'un trio
		sum( i in (1..nbPersonnes) )( abs( nbHeuresHebdo[i] - nbHeuresHebdo[ duo[i] ] ) )
	endif;


% Solution
solve satisfy;

