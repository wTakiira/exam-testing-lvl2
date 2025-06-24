# Consignes

Votre mission est de réaliser des tests **end-to-end** sur le site suivant :  
https://rubrr.s3-main.oktopod.app/

L’application propose un questionnaire aléatoire portant sur plusieurs thématiques ; vous pouvez filtrer les questions en sélectionnant un **tag**.  
Un **glossaire** permet de retrouver l’ensemble des questions déjà posées ainsi que les réponses enregistrées. Dans la fiche détaillée d’une question, vous trouverez :

* la question elle-même,  
* la réponse donnée,  
* d’autres questions appartenant au même thème.

Explorez le site et vérifiez les comportements attendus à l’aide de **Playwright**.

> **Important :** comme les questions varient à chaque passage, il est inutile de vérifier la justesse des réponses. Assurez-vous plutôt que les éléments attendus sont présents et qu’aucune erreur n’est renvoyée.  
> Notez qu’une réponse trop courte (en-deçà d’un certain nombre de caractères) est considérée comme vide et génère un message d’erreur.

---

## Résultats attendus

1. Initialisez Playwright dans le répertoire contenant ce README.  
2. Placez **tous** vos tests dans ce même dossier afin qu’ils soient inclus dans votre rendu.  
3. Le code source de l’application n’est pas nécessaire ; tout est accessible via l’URL.

---

## Points de vigilance

Cette application s’appuie sur l’IA pour évaluer les réponses ; un **rate-limiting** est donc actif.

* En cas d’excès de requêtes, un bannissement temporaire de l’adresse IP de l’école peut survenir.  
* Pour éviter ce problème, testez la partie « réponse » en dernier, lorsque vos autres scénarios sont finalisés.

Bonne exploration et bons tests !
