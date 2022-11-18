
% Types

enum Instrument = { Guitare , Batterie , Piano , Basse , Violon };
enum Ville = { Angers , Nantes };
enum Style = { Rock , Metal , Jazz , Pop , Classique , Punk , RnB , Rap , Electro , Funk };


% Constantes

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

array[1..nbPersonnes] of var (1..nbPersonnes): pair;


% Contraintes

% Le duo est consistant : il s’agit donc d’un matching parfait, c’est à dire que si m est associé à m’ alors m’ est associé aussi à m.
constraint 
  forall( i in (1..nbPersonnes) )
  ( 
    pair[ pair[ i ] ] = i 
  );

% Deux musiciens jouant du même instrument ne peuvent former un duo
constraint 
  dropConstraintInstru 
  \/ 
  (
    forall( i in (1..nbPersonnes) )( instrusments[ i ] != instrusments[ pair[ i ] ] )
  );

% Les deux musiciens doivent habiter la même ville
constraint 
  dropConstraintCity
  \/
  (
    forall( i in (1..nbPersonnes) )( villes[ i ] == villes[ pair[ i ] ] )
  );

% Le nombre d’heures voulues doit être dans le créneau Min - Max souhaité par l’autre
constraint 
  dropConstraintTime
  \/
  (
    forall( i in (1..nbPersonnes) )(
      ( nbHeuresHebdo[ i ] >= nbHeuresMin[ pair[ i ] ] )
      /\
      ( nbHeuresHebdo[ i ] <= nbHeuresMax[ pair[ i ] ] )
    )
  );

% Le niveau de chaque musicien du duo doit être dans l’intervalle de niveau accepté par l’autre musicien
constraint 
  dropConstraintLevel
  \/
  (
    forall( i in (1..nbPersonnes) )(
      ( niveaux[ i ] >= niveauMin[ pair[ i ] ] )
      /\
      ( niveaux[ i ] <= niveauMax[ pair[ i ] ] )
    )
  ); 

% Le nombre de style commun doit respecter les exigences de chacun
constraint 
  dropConstraintStyle
  \/
  (
    forall( i in (1..nbPersonnes) )
      ( 
        card( styles[i] intersect styles[ pair[ i ] ] ) >= nbStylesMin[i] 
      )
  );

% Solution
solve satisfy;
