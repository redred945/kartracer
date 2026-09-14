# KART RACER — site vitrine (maquette)

Site statique HTML/CSS/JS pur (sans build step), refonte du site actuel https://www.kartracer.fr,
mettant en avant les vraies photos du lieu (piste indoor, karts, club house, laser game, paintball,
séminaires) dans une direction artistique asphalte/racing sombre (rouge course + jaune chrono),
inspirée des meilleures landing pages SaaS (bento grid, header sticky flottant, animations discrètes
au scroll).

## Prévisualisation

Ajouté à `C:\Users\Reda\Code\.claude\launch.json` sous le nom `kartracer-static`, sur le port `4690`.

## À compléter avant mise en ligne

- [ ] **Système de réservation en ligne** — tous les boutons "Réserver" pointent actuellement vers
      `tel:0238720808` et/ou l'ancre `#formulaire` / `contact.html`. Brancher le vrai widget de
      réservation du client (celui utilisé sur le site actuel n'a pas pu être identifié) à la place.
- [ ] **Clé Web3Forms** — dans `contact.html`, remplacer `VOTRE_CLE_WEB3FORMS` par la vraie clé d'accès
      (https://web3forms.com/). Tant qu'elle n'est pas renseignée, le formulaire retombe automatiquement
      sur un `mailto:` vers contact@kartracer.fr.
- [ ] **Avis Google** — aucune note vérifiée n'était disponible au moment de la maquette. Le lien
      "Voir nos avis Google" pointe vers une recherche Google Maps générique
      (`https://www.google.com/maps/search/?api=1&query=Kart+Racer+Saran`).
      Le remplacer par le lien officiel de la fiche Google Business une fois identifié, et envisager
      d'afficher la note réelle si elle est bonne.
- [ ] **Mentions légales / SIRET** — le lien "Mentions légales" du footer pointe vers `#`. Le site
      actuel ne mentionne pas de numéro SIRET dans ses propres mentions légales ; à compléter avec la
      raison sociale, le SIRET, l'hébergeur (OVH selon le site actuel), etc.
- [ ] **Accessibilité PMR** — non mentionnée faute d'info vérifiée ; à ajouter dans la FAQ si pertinent.
- [ ] **og:image** — les meta `og:image` pointent vers un futur domaine Vercel
      (`kart-racer.vercel.app`) ; à ajuster une fois le nom de domaine définitif connu.
- [ ] **Photos hautes résolution** — les photos ont été récupérées depuis le site actuel puis
      recompressées (JPEG, largeur max 1600 px) pour rester légères. Si le client a des photos sources
      en meilleure qualité (piste, karts, club house), les substituer dans `assets/img/`.

## Structure

- `index.html` — one-pager (hero, chiffres clés, bento complexe, pourquoi Kart Racer, formules
  kart+laser/paintball, tarifs, séminaires, galerie, infos pratiques, FAQ, CTA final)
- `contact.html` — formulaire de contact + coordonnées + carte
- `assets/style.css` — feuille de style unique (tokens, composants, responsive)
- `assets/app.js` — header flottant au scroll, burger mobile, animations au scroll, carrousel stats
  mobile, surlignage du jour en cours dans le tableau d'horaires, formulaire Web3Forms + fallback mailto
- `assets/img/` — photos réelles du complexe (récupérées depuis kartracer.fr, recompressées pour le web)

## Contenu repris du site actuel

- Piste indoor homologuée FFSA de plus de 500 m, multi-étage, chronométrage temps réel, record du tour
  33,862 s.
- Karts SODI SR5 : 270 cm³ adultes (15 ans / 1,55 m min), 160 cm³ enfants (7-14 ans / 1,30 m min, sessions
  jusqu'à 20h).
- Formules Kart+Laser (25€/pers) et Kart+Paintball (50€/pers), valables lundi-jeudi ; EVG/EVJF à 70€/pers
  dès 8 personnes.
- Tarifs pilote adulte/enfant, carte Accès Piste, formules groupe (EVG/EVJF, Grand Prix anniversaire
  enfant, Grand Prix, Endurance).
- Séminaires d'entreprise (spécialiste depuis +15 ans, 8 à 150 personnes) : salle de réunion 50 personnes,
  piste privatisable, restauration sur mesure.
- Horaires normaux + horaires vacances scolaires, adresse (Parc de loisirs, rue de la Tuilerie, 45770
  Saran), téléphone, e-mail, Facebook et Instagram (liens réels repris du site actuel).

## Palette & typographie

- Fond quasi-noir asphalte `#0b0b0d`, panneaux `#16161a` / `#1d1d22`
- Accent primaire rouge course (`#e10600` / `#ff3b2e`) — clin d'œil au drapeau à damiers et à la piste
- Accent secondaire jaune chrono/pit-lane (`#f5c518` / `#ffe066`) — clin d'œil aux écrans de chronométrage
- Accent tertiaire discret bleu glace (`#6fd3ff`), utilisé avec parcimonie
- Motif signature : liseré "kerb" (bordure de piste rouge/blanc en diagonale) utilisé comme séparateur
- Typographie : Rajdhani (titres, condensé façon tableau de bord) + Inter (texte courant)
