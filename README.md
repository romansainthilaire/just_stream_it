# JustStreamIt

Ce projet a été réalisé dans le cadre de la formation OpenClassrooms *Développeur d'application - Python*.

→ Application web utilisant une API REST

## Présentation de l'application

**JustStreamIt** est une application web permetant de visualiser un classement de films en fonction du genre et de la catégorie sélectionnée.

L'application utilise une API locale : [OCMovies-API](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR)

## Lancement de l'API
- cloner le dépôt de code : git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
- créer un environnement virtuel : python -m venv [nom]
- activer l'environnement virtuel : [nom]\Scripts\activate
- installer les packages : pip install -r requirements.txt
- créer et alimenter la base de données : python manage.py create_db
- lancer l'API : python manage.py runserver
