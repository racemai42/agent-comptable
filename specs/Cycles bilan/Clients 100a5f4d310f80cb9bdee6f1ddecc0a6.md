# Clients

Bilan liquidation: No
OD: Done
new_bilan: done
note: Conditionner le bloquage du cyle

Introduction

<aside>
💡

Les questions ci-dessous ont pour objectif de déterminer le “cut-off” de votre exercice, c’est-à-dire déterminer quels revenus doivent être affectés à l’exercice clôturé ou à l’exercice suivant. 

</aside>

 ****

**Question 1 :** “Ces montants encaissées concernent quels exercices ?” **(ok)**

Indiquez pour chacune de ces transactions si elles sont liées à une prestation effectuée au cours de l’exercice passé, du nouvel exercice (actuellement en cours), ou des 2. Nous affichons par défaut toutes les transactions de plus de 1,000€ correspondant à du chiffre d’affaires, encaissés les 3 derniers mois avant la clôture. Vous pouvez afficher des transactions plus anciennes en cliquant sur “voir plus”.

- tableau **(“concerne plusieurs exercices ?” à supprimer ; “Montant” ⇒ “Montant TTC”, non éditable) (afficher uniquement les catégories correspondant à du CA)**

![Capture d’écran 2024-09-19 à 11.36.31.png](Fournisseurs/Capture_decran_2024-09-19_a_11.36.31.png)

(si 0 transactions : afficher “Aucune transactions concernées”)

<aside>
💡

OD OK

**Cette écriture est extournée. 1 OD par ligne du tableau. (le compte de la lignes 2 dépend de la catégorie indiquée par le client)**

- X = Montant HT (TTC/(1+tva))
- Y = %age sur l’exercice suivant
- Z = X*Y

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |
| --- | --- | --- | --- | --- |
| Date cloture | 487000 | Produits constatées d'avance |  | Z |
| Date cloture | 706000 | Prestations de services taux 20% | Z |  |
|  |  |  |  |  |
|  |  |  |  |  |
</aside>

Exemple

![Capture d’écran 2024-11-05 à 15.54.55.png](Clients/Capture_decran_2024-11-05_a_15.54.55.png)

X= TTC / (1+TVA) =833.33
Y = 30%
Z= X × Y =250.00

**Question 2 :** “Ces montants encaissées en début d’exercice suivant concernent quels exercices ?” **(ok)**

![Capture d’écran 2025-10-29 à 15.35.34.png](Clients/Capture_decran_2025-10-29_a_15.35.34.png)

Indiquez pour chacune de ces transactions si elles sont correspondent à une prestation effectuée au cours de l’exercice passé, du nouvel exercice (en cours), ou des 2. Nous affichons ici toutes les transactions de plus de 1,000€ correspondant à du chiffre d’affaire, encaissés les 3 premiers mois **après** la clôture de l’exercice. 

même TABLEAU, avec en plus “Date de la facture” *(peut être au cours de l’exercice précédent ou futur)*

(si 0 transactions : afficher “Aucune transactions concernées”)

<aside>
💡

OD **OK**

**Cette écriture est extournée. 1 OD par ligne du tableau. (les comptes des lignes 2 et 3 dépendent de la catégorie indiquée par le client)**

- W = Montant HT
- X = Montant TVA
- Y = %age sur l’exercice précédent

Pour les lignes où la facture a été émise lors de l’exercice précédent : 

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |
| --- | --- | --- | --- | --- |
| Date cloture | 411100 | Client - Vente de biens et services | (W+X)*Y |  |
| Date cloture | 706000 | Prestations de services taux 20% |  | W*Y |
| Date cloture | 445700 | TVA collectée 20% |  | X*Y |

Pour les lignes où la facture a été émise lors de l’exercice suivant :

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |
| --- | --- | --- | --- | --- |
| Date cloture | 418100 | Client - Facture à établir | (W+X)*Y |  |
| Date cloture | 706000 | Prestations de services taux 20% |  | W*Y |
| Date cloture | 445870 | TVA sur factures à établir |  | X*Y |
</aside>

Exemple facture émis exercice précédent : 
Montant TTC = 2 882
W = **2 401,67
X = 480,33
Y= 0.5**

Compte 411100 → 1441
Compte 706000→1200,84
Compte 445700→ 240,17

**Question 3  (ok)**

En plus des transactions affichées ci-dessus, avez-vous effectué au cours de l’exercice précédent d’autres prestations/ventes de plus de 1,000€  actuellement toujours non encaissés (ou encaissés plus de 3 mois après la date de clôture) ?

Oui / Non

Si oui : tableau avec 

- Nom du client
- Catégorie
- Date de la facture *(peut être au cours de l’exercice précédent ou futur)*
- Montant TTC de la facture
- Taux de TVA
- Montant réglé avant la clôture
- Facture

![Capture d’écran 2024-09-19 à 11.37.38.png](Fournisseurs/Capture_decran_2024-09-19_a_11.37.38.png)

<aside>
💡

OD (même logique que question ci-dessus) **(OK)**

**Cette écriture est extournée. 1 OD par ligne du tableau.**

- W = Montant HT
- X = Montant TVA
- Y = %age pas encore réglé

Pour les lignes où la facture a été émise lors de l’exercice précédent : **(les comptes des lignes 2 et 3 dépendent de la catégorie indiquée par le client)**

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |
| --- | --- | --- | --- | --- |
| Date cloture | 411100 | Client - Vente de biens et services | (W+X)*Y |  |
| Date cloture | 706000 | Prestations de services taux 20% |  | W*Y |
| Date cloture | 445700 | TVA collectée 20% |  | X*Y |

Pour les lignes où la facture a été émise lors de l’exercice suivant :

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |
| --- | --- | --- | --- | --- |
| Date cloture | 418100 | Client - Facture à établir | (W+X)*Y |  |
| Date cloture | 706000 | Prestations de services taux 20% |  | W*Y |
| Date cloture | 445870 | TVA sur factures à établir |  | X*Y |
</aside>

**Question 4 (ok)**

(si BTP: travaux en cours)

En plus de vos recettes renseignées ci-dessus, avez-vous effectué des travaux qui seraient à la fois :

- démarrés au cours de l’exercice précédent
- ET non terminés à la date de clôture
- ET facturés au client après la date de clôture

Oui / Non

Si oui : 

- Nom du client - Montant total des travaux TTC - Taux de TVA - % achevé à la clôture

<aside>
💡

OD **(ok)**

**Cette écriture est extournée.**

- X = Montant HT (TTC/(1+TVA))
- Y = %age achevé
- Z = X*Y

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |
| --- | --- | --- | --- | --- |
| Date cloture | 335000 | Travaux en cours | Z |  |
| Date cloture | 713350 | Variation des stocks - Travaux en cours |  | Z |
</aside>

**Question 5:** comme ci-dessous **(ok)**

![Capture d’écran 2024-09-19 à 11.41.52.png](Clients/Capture_decran_2024-09-19_a_11.41.52.png)

Modifier ce tableau :

- Nom du client
- Catégorie
- Montant TTC de l’avoir
- Taux de TVA de l’avoir
- Avoir (fichier)

<aside>
💡

OD (**ok)**

**Cette écriture est extournée. 1 OD par ligne du tableau. (le compte de la lignes 2 dépend de la catégorie indiquée par le client)**

- W = Montant HT
- X = Montant TVA
- Z = W+X = Montant TTC

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |
| --- | --- | --- | --- | --- |
| Date cloture | 419800 | Client - Avoir à établir |  | Z |
| Date cloture | 701000 | Vente de produits finis taux 20% | W |  |
| Date cloture | 445870 | TVA sur factures à établir | X |  |
</aside>

**Question 6 :** (clients douteux) **(ok)**

- condition : le user a ajouté des Factures à encaisser de plus de 5k€ (question 3, avec une date de facture de l’exercice précédent)

"Pensez-vous que certaines de ces factures pourraient ne jamais être payées par vos clients ?"

TABLEAU avec :

- Nom du client
- Montant TTC
- Taux de TVA
- Risque d’impayé (oui/non)
- Part du montant sur lequel vous estimez qu'il y a un risque d'un impayé (%age)

<aside>
💡

OD **(ok )**

**(pas d’extourne) 1 OD par ligne du tableau.**

- X = Montant TTC
- Y = %age
- Z = X*Y

Cas rare, c’est une double OD (on pourrait la diviser en 2 OD, cela n’a pas d’importance)

| **Date** | **Compte** | **Nom du compte** | **Debit** | **Credit** |  |
| --- | --- | --- | --- | --- | --- |
| Date cloture | 411100 | Client - Vente de biens et services |  | X |  |
| Date cloture | 416000 | Client douteux | X |  |  |
| Date cloture | 491000 | Provision pour dépréciation des comptes des clients |  | Z |  |
| Date cloture | 681740 | Dotation aux provisions pour dépréciation des créances | Z |  |  |
</aside>

**Question 7 : (ok)**

- condition : secteur BTP

même tableau, avec “Montant HT de la retenue de garantie” au lieu de “Montant de la facture”

![Capture d’écran 2024-09-19 à 11.43.32.png](Clients/Capture_decran_2024-09-19_a_11.43.32.png)

<aside>
💡

OD

Pas d’OD, afficher ceci au collab : “Vous devez allez sur la transaction correspondante et ventiler la transaction, en rajoutant le bon montant dans la catégorie “Retenue de garantie””

</aside>

**Question 8 :** 

- condition : secteur BTP et au moins 1 transaction “prestation de service” à un taux de TVA ≠ 20%, de plus de 10k€ ET pas d’exo de TVA

Les montants suivants correspondent à des encaissements de plus de 10,000€ avec un taux de TVA réduit.
L’application d’un taux réduit suppose que vos clients vous aient remis une attestation concernant la destination des travaux (isolation, économie d’énergie, etc.) et/ou de leur qualité (particulier). Pouvez vous nous joindre les attestations correspondantes ?

TABLEAU

- Date
- Libellé
- Montant TTC
- Taux de TVA
- Attestation (fichier)

**QUESTION 9** 

Clients, si le client n'a aucun canal de vente, ET moins de 3 factures sur LPPro, on pose la question "Avec quel logiciel avez-vous émis vos factures ?", avec réponse champ libre

# Chiffre d’affaire

**Question 9 (A RAJOUTER)**

- si Consultant/Service, BTP ou Immobilier, ET pas de canal de vente actif

D’après vos transactions et vos réponses aux questions précédentes, le chiffre d’affaire de votre exercice passé est de X€ :

- X€ d’après vos encaissements de l’exercice
- -X€ encaissés au cours de l’exercice, mais appliqué à l’exercice suivant *(montants de question 1)*
- +X€ facturé au cours de l’exercice, mais non encaissé pendant l’exercice (montants des questions 2 et 3, si date facture l’année précédente)
- -X€ d’avoirs émis lors de l’exercice suivant *(question 5)*
- (si BTP) +X€ de retenues de garantie *(question 7)*

Confirmez-vous de montant ?

- oui
- non ⇒ Veuillez nous indiquer le montant du CA que vous estimez avoir facturé cette année, et d’où pensez-vous que provient l’écart ?

**Question 10 (A RAJOUTER)**

(si consultant et pas de canal de vente actif)

Vos ventes dans d’autres pays de l’UE ont été de X€, et vos ventes hors d’UE ont été de Y€. Confirmez-vous ces montants ?

- Oui
- Non ⇒ Veuillez nous indiquer le montant du CA fait en UE et hors UE, et d’où pensez-vous que provient l’écart ?

(si consultant et ventes en UE >0€, afficher cette boite info)

<aside>
💡

Vous avez facturé des services à des clients installés en UE : vous devez peut-être remplir une déclaration d’échange de services (DES) auprès du service des douanes.

Pour savoir si vous devez remplir une déclaration DES, vous devez vous poser la question : « Est-ce que ma prestation de service est localisable ou non ? »

- Si elle est localisable, vous n’aurez rien à déclarer. Exemples d’activités localisables : agence de voyage, location de courte durée, activités sportives, éducatives, de loisir.
- Si elle n’est pas localisable, vous devrez établir une DES. . Exemples d’activités non localisables : conseil, assurance, téléphonie, etc.

Concrètement, vous devez indiquer sur votre DES les services pour lesquels la TVA est due par votre client, le preneur de la prestation, dans son pays.

Vous allez donc le facturer HT et transmettre une DES mensuelle à la douane. C’est votre client qui, de son côté, s’acquittera de la TVA dans son pays avec l’autoliquidation.

Plus d’informations ici : [La déclaration européenne de services (DES)](https://www.lecoindesentrepreneurs.fr/la-declaration-europeenne-de-services-des/) 

</aside>

**Question 11 (ok)**

(si immobilier et pas de canal de vente actif)

Vous avez catégorisé X€ en “Dépôt de garantie & Caution”, 
Confirmez-vous ce montant ?

- oui
- non ⇒ “Indiquez d’où provient l’écart”