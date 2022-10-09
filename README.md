<div align="center" style="text-align: center;">

# Optimisation Appliquée :
## "We are m(usicians) and we play rock n’ roll !"


_Projet réalisé en duo avec Tanguy J._

[sujet](./sujet.pdf)

</div>

### Techno :

| Icône | Dépendance | Version |
|-------|------------|---------|
|<img src="https://www.minizinc.org/MiniZn_logo.png" width="30" height="30" alt="Minizinc icon"> | [Minizinc](https://www.minizinc.org/) | 2.6 |
|<img src="https://www.docker.com/wp-content/uploads/2022/01/cropped-Docker-R-Logo-08-2018-Monochomatic-RGB_Moby-x1-32x32.png" width="30" height="30" alt="Docker icon"> | [Docker](https://www.docker.com/) | 20.10 |
|<img src="https://www.docker.com/wp-content/uploads/2022/01/cropped-Docker-R-Logo-08-2018-Monochomatic-RGB_Moby-x1-32x32.png" width="30" height="30" alt="Docker icon"> | [Docker compose](https://www.docker.com/) | 1.25 |
|<img src="https://nodejs.org/static/images/logo.svg" width="30" height="30" alt="NodeJS icon"> | [NodeJS](https://nodejs.org/) | 18.10 |
|<img src="https://expressjs.com/images/favicon.png" width="30" height="30" alt="ExpressJS icon"> | [Express](https://expressjs.com/) | 4.18 |


### Installation
https://docs.docker.com/compose/install/
1. Pré-requis :

    | Dépendance    | Version min. | Lien |
    |---------------|--------------|------|
    | Docker        |       20.10  | [install](https://docs.docker.com/get-docker/) |
	| Dockercompose |        1.25  | [install](https://docs.docker.com/compose/install/) |

2. Installation

    ```bash
	cp .env.example .env
	```
	Puis adaptez le à votre environnement.

3. Lancement

    ```bash
	docker-compose up -d --build
	```