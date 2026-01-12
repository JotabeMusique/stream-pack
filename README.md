# Jotabê's Stream Pack

Ce dépot contient le stream pack de [Jotabê](https://twitch.tv/jotabemusique) avec toutes les ressources visuelles, la collection de scènes OBS, ainsi que l'overlay dynamique et différents outils pour le stream.

Il est exclusivement réservé à Jotabê, si vous souhaitez en tirer partie, merci de forker le dépot et créer votre propre overlay.

## Crédits

Ce stream pack a été crée par Rémi Jarasson / [La Jarre à Son](https://github.com/la-jarre-a-son)

## Configuration / Démo

Le stream pack est hébergé directement sur Github: [Jotabê's Stream Pack](https://jotabemusique.github.io/stream-pack)

## Installation

Ce stream pack est compatible Windows et MacOS.

### Pré-requis

Les versions indiquées sont les versions ayant été testées avec le stream pack.
Une mise à jour des plugins est possible mais pourrait avoir des bugs nécessitant une mise à jour du pack.

* OBS v32.0.4 - [Download](https://obsproject.com/)
* obs-shaderfilter v2.6.0 - [Download](https://obsproject.com/forum/resources/obs-shaderfilter.1736/)
* obs-move-transition v3.2.0 - [Download](https://obsproject.com/forum/resources/move.913/)
* obs-transition-table v0.3.1 - [Download](https://obsproject.com/forum/resources/transition-table.1174/)
* obs-source-clone v0.2.0 - [Download](https://obsproject.com/forum/resources/source-clone.1632/)
* obs-advanced-masks v1.5.4 - [Download](https://obsproject.com/forum/resources/advanced-masks.1856/)

Plugins recommandés:
* obs-source-dock v0.5.0 - [Download](https://obsproject.com/forum/resources/source-dock.1317/)
* obs-audio-monitor v0.10.0 - [Download](https://obsproject.com/forum/resources/audio-monitor.1186/)
* obs-loudness-dock v0.4.2 - [Download](https://obsproject.com/forum/resources/loudness-dock.1751/)
* obs-audio-video-sync-dock v0.1.2 - [Download](https://obsproject.com/forum/resources/audio-video-sync-dock.2028/)

### Télécharger le pack

Téléchargez le pack en cliquant sur [Download ZIP](./archive/refs/heads/main.zip) ou en clonant le dépot Git.

__ATTENTION: le pack est volumineux (~3.64Go) une fois cloné__

### Profile

Ce stream pack est prévu pour un stream en 1080p60 (1920x1080 - 60 fps) uniquement.

### Collection de scènes

Importez la collection de scène dans OBS:
* `Scene Collection > Import > Collection path...`
* Utilisez le fichier `Jotabê-v1.scene-collection.json` présent dans le dossier `resources/obs`
* Un certain nombre de ressource seront introuvables. Il faudra les relocaliser en selectionnant le dossier `resources/obs`.
* Relocaliser une seconde fois les ressources dans `Scene Collection > Check for Missing Files` et selectionner le dossier `resources/obs/shaders`.
* (Facultatif) pour utiliser les assets d'exemple, le dossier est situé dans `src/assets`

### Script

Un script LUA est utilisé pour la vidéo d'arrière plan:
* `Tools > Scripts`
* Supprimer le script introuvable `random_video_seek.lua`
* Ajouter à nouveau le script `random_video_seek.lua` présent dans le dossier `resources/obs/scripts`
* Configurer `Media Source` en selectionnant la source `VIDEO_BACKGROUND`
* Cocher `Active`

### Configuration des sources

Chaque source nécessitant une configuration est inclue dans une scène de calque (dont le nom est précédé par un `_`).

#### _WEBCAM_SIDE

Cette scène doit contenir la source `CAPTURE - WEBCAM` désignant la capture de périphérique vidéo pour la webcam vue de coté.

La piste audio de cette source doit être désactivée (mute) et cachée.

Supprimer la source `MOCK_VIDEO_WEBCAM` servant d'exemple.

#### _WEBCAM_TOP

Cette scène doit contenir la source `CAPTURE - ZENITHAL` désignant la capture de périphérique vidéo pour la webcam du piano vu de haut.

La piste audio de cette source doit être désactivée (mute) et cachée.

Supprimer la source `MOCK_VIDEO_TOP` servant d'exemple.

Pour facilité le cadrage de cette source, vous pouvez activer la source "GUDIES - Piano" pour afficher des guides pour correctement cadrer la webcam.

#### _KEYBOARD

Cette scène contient une version recadrée de la caméra zénithal. Seul le piano doit être visible.
Si la source _WEBCAM_TOP a correctement été calivrée, aucun besoin de modification.

Le cadrage peut être ajusté en selectionnant `KEYBOARD-CROP > Filtres` puis en modifiant le filtre `QUADCROP`. Les positions des 4 coins du piano peuvent être ajustées manuellement.

#### _SCREEN

Cette scène contient la capture de l'écran principal `CAPTURE - SCREEN`. Modifiez cette source pour capturer le bon écran.

NOTE: la capture d'écran sous MacOS est différente que sous Windows. Il faudra recréer cette source éventuellement en la nommant `CAPTURE - SCREEN`. Cette source doit occuper la scene entière (`Transform > Fit to Screen`).

#### _WINDOW

Cette scène contient les sources pour différentes capture de fenêtres.

Ajoutez autant de capture de fenêtre que vous souhaitez. Ces captures doivent redimensionnées à la taille de la scène (`Transform > Fit to Screen`).

#### _GAME

Cette scène contient la source de capture de jeu.

Ajoutez une capture de jeu vidéo, ou un périphérique de capture, ou simplement la scène `_SCREEN` pour une capture d'écran en lieu et place d'une capture de jeu (non-recommandé).

Chaque source doit occuper la taille de la scène (`Transform > Fit to Screen`).

#### _BACKGROUND

Cette scène contient la vidéo d'arrière plan.
Aucune modification doit être nécessaire.

### Overlays

Connectez-vous à Twitch sur la page du [Stream Pack](https://jotabemusique.github.io/stream-pack/) afin d'obtenir les liens authentifié des overlays.

* Modifier la source `_OVERLAY > WEB - Overlay` avec la valeur de `OVERLAY Browser Source`
* Modifier la source `DÉBUT > WEB - MUSIC PLAYER` avec la valeur de `MUSIC Browser Source`

L'overlay `WEB - Overlay` doit avoir l'accès complet à OBS si vous souhaitez que l'enregistrement local soit géré automatiquement (facultatif).

Mettez à jour les urls des overlay tiers:

* Modifier la source `DÉBUT > ALERTS > WEB - Alerts` avec l'url des alertes Streamlabs
* Modifier la source `DISCUSSION > CHAT > WEB - Chat` avec l'url du chat Streamlabs
* Supprimer la source `WEB - Chat (mock)` qui sert d'exemple
* Modifier la source `STREAM TOGETHER > WEB - Stream Together` avec l'url fourni par Twitch

### Docks

Les docks OBS permettent d'ajouter dans la fenêtre OBS des outils pour gérer plus facilenet le stream.

Grâce au plugin `Source Dock`vous pouvez en plus ajouter des sources en tant que Dock OBS, qui seront interactives.

* Ajoutez le dock "Stream Title" en allant dans `Docks > Custom Brower Docks`
* Nommez le "STREAM TITLE" et entrez la valeur de `DOCK Stream Title` sur la page du Stream Pack.
* Placez ce dock intégré à votre OBS (cf Suggestion de placement des docks).

__NOTE: Ce dock permet également de vérifier que le jeton d'accès à Twitch est toujours valide. Si une erreur est présent au lieu du titre du stream, il sera nécessaire de mettre à jour les jetons d'accès des overlays en se réauthentifiant sur la page du [Stream Pack](https://jotabemusique.github.io/stream-pack/).__

Ajoutez également des sources en tant que Docks en allant dans `Tools > Source Docks`

* Ajoutez la source `WEB - MUSIC PLAYER` et cochez __Visible__ et __Preview__
* Ajoutez la source `_OVERLAY_CONTROL` et cochez  __Visible__ et __Preview__
* (recommandé) Ajoutez `_SCREEN` et cochez __Visible__ et __Scene Items__
* (recommandé) Ajoutez `_WINDOW` et cochez __Visible__ et __Scene Items__

Grâce à Source Docks, vous pourrez alors:

* `_OVERLAY_CONTROL`: intéragir directement avec l'overlay
* `WEB - MUSIC PLAYER`: Jouer/pause et suivant pour le lecteur de musique intégré
* `STREAM TITLE`: préconfigurer des titres de stream, de passer au titre suivant en 1 clic, et incrémenter le n° des cours en cliquant sur +1.
* `_SCREEN` et `_WINDOW`: choisir et/ou modifier les sources de captures pour l'écran et les fenêtres sans passer en _Studio Mode_. Pour éviter de divulguer par erreur une capture, vous pouvez masquer toutes les sources en prévention via ces docks.

Placez les Docks de la manière suivante pour une utilisation optimale d'OBS (activez `Docks > Full-Height Docks`):

<img width="100%" src="./assets/obs/OBS-Docks-preview.png" />

### Sources modifiables

Vous pouvez activer / désactiver certaines sources dans certains scènes.

Affectez un raccourci clavier ou un bouton Stream Deck pour ces sources: 

* `DISCUSSION > KEYBOARD > _KEYBOARD `: Activez cette source pour afficher le piano vu de haut
* `ÉCRAN > MUSIC > WEB - MUSIC PLAYER `: Activez cette source pour avoir de la musique de fond
* `GAMING > WEBCAM`: Cette source est normalement déverrouillée et peut être déplacée en fonction du jeu.

Certaines sources peut être modifiée dynamiquement via des filtres (vous pouvez assigner un raccourci clavier ou un bouton Stream Deck):

* `COURS -> Filtres > REDUCE-WEBCAM`: Réduit la taille de la webcam (par défaut)
* `COURS -> Filtres > ENLARGE-WEBCAM`: Augmente la taille de la webcam

### Configuration Audio

La configuration audio n'est pas intégrée au Stream pack, car selon l'OS, il y a plusieurs manière de le faire.

Vous devrez donc ajouter vous-même les sources d'entrée et filtres en fonction de votre setup audio.
Préférez aussi une capture de l'audio du Bureau plutôt qu'une capture d'application, car cela peut entrainer des difficultés techniques.

Pour capturer l'audio de logiciels de musique utilisant ASIO sur MacOS, utilisez un outils tel que [Loopback](https://rogueamoeba.com/loopback/) ou [Blackhole: Audio Loopback Driver](https://github.com/ExistentialAudio/BlackHole) avec un périphérique aggrégé.

Pour capturer l'audio de logiciels de musique utilisant ASIO sur Windows, utilisez un outil tel que [Voicemeeter](https://voicemeeter.com/) (BANANA, POTATO ou simplement VB-Audio Virtual Cable) ou une carte son ayant une fonctionnalité de Loopback.

_Recommandation: utilsez autant que possible des sources audio globales dans les paramètres d'OBS. En effet, cela permet de plus facilement mute/unmute toute source audio sans les ajouter à toutes les scènes._

_Alternative: Créer une scène calque `_AUDIO` contenant toutes les captures de sources audio, et ajouter ce calque à toutes les scènes. Vous pourrez alors ajouter cette scène en tant que dock, et intéragir avec via un Stream Deck par exemple._

## Contribution

Ce dépot n'est pas publiquement ouvert à contribution. Si vous faites partie de la communauté de JB, n'hésitez pas à faire une review du code, ou ouvrir des issues pour faire des suggestions.