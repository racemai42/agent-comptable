# Placements financiers

Bilan liquidation: No
Condition / commentaire: Au moins 1 transaction catégorisée “Placement financier”
OD: Done
new_bilan: Conditionnement check

Pouvez-vous préciser à quoi correspondent ces placements financiers ? **(ok)**

- affichage de la liste des transactions de l’exercice catégorisées “Placement financier”, et dropdown avec ces choix : Obligations, Compte à terme, Crypto / NFT, Actions côtés en bourse, Actions non cotées

<aside>
💡

OD

Pas d’OD ici : à la place, il faut recatégoriser à la place du client les transactions dans le bon compte (Compte à terme, Crypto etc., car “Placement financier” est par défaut catégorisé en “Actions cotées”

</aside>

Certains de vos placements financiers (achetés au cours de cet exercice ou d’un éventuel exercice précédent) ont-ils perdu ou gagné de la valeur entre le moment de leur achat et la date de fin de l’exercice ? **(ok)**

- Non
- Oui

si oui : “Détaillez les produits financiers concernés et les gains et/ou perte” + Tableau :

- nom de l’action
- nombre d’actions achetée
- prix d’achat
- valeur à la clôture de l’exercice

<aside>
💡

OD **(ok bubble + lppro)**

Il y a une OD uniquement pour les moins-value latentes, pas pour les plus-values latentes (qui n’impactent que le calcul de l’IS)

- A = nombre d’actions achetée
- B = prix d’achat
- C = valeur à la clôture de l’exercice
- X1 = A * (B-C)
- Z = somme de tous les X1 positifs

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |
| --- | --- | --- | --- | --- |
| Date de cloture | 296500 | Provisions pour dépréciation des titres de participation |  | Z |
| Date de cloture | 686000 | Dotations aux amortissements, aux dépréciations et aux provisions - Charges financières | Z |  |
</aside>

![Capture d’écran 2024-10-04 à 17.46.57.png](Placements%20financiers/Capture_decran_2024-10-04_a_17.46.57.png)