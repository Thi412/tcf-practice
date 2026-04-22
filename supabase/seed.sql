-- ============================================================
-- TCF Practice — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- TÂCHE 3 TOPICS (Opinion / Monologue)
-- ============================================================

insert into topics (id, task_type, question, theme, difficulty) values
  ('a1000000-0000-0000-0000-000000000001', 'tache3', 'Le téléphone portable est indispensable dans la vie moderne. Qu''en pensez-vous ?', 'Technologie', 'B1'),
  ('a1000000-0000-0000-0000-000000000002', 'tache3', 'Le télétravail devrait être le mode de travail principal. Êtes-vous d''accord ?', 'Travail', 'B1'),
  ('a1000000-0000-0000-0000-000000000003', 'tache3', 'Les réseaux sociaux font plus de mal que de bien. Donnez votre opinion.', 'Technologie', 'B2'),
  ('a1000000-0000-0000-0000-000000000004', 'tache3', 'Il faut interdire les voitures dans les centres-villes. Qu''en pensez-vous ?', 'Environnement', 'B1'),
  ('a1000000-0000-0000-0000-000000000005', 'tache3', 'Les études universitaires devraient être gratuites pour tous. Donnez votre avis.', 'Éducation', 'B2'),
  ('a1000000-0000-0000-0000-000000000006', 'tache3', 'Le sport est essentiel pour une bonne santé mentale. Êtes-vous d''accord ?', 'Santé', 'B1'),
  ('a1000000-0000-0000-0000-000000000007', 'tache3', 'Les jeux vidéo sont bénéfiques pour les jeunes. Qu''en pensez-vous ?', 'Loisirs', 'B1'),
  ('a1000000-0000-0000-0000-000000000008', 'tache3', 'Il faudrait réduire la semaine de travail à 4 jours. Donnez votre opinion.', 'Travail', 'B2'),
  ('a1000000-0000-0000-0000-000000000009', 'tache3', 'L''immigration est une chance pour le Canada. Êtes-vous d''accord ?', 'Société', 'B2'),
  ('a1000000-0000-0000-0000-000000000010', 'tache3', 'La nourriture végétarienne devrait remplacer la viande. Qu''en pensez-vous ?', 'Environnement', 'B1');

-- ============================================================
-- TÂCHE 2 TOPICS (Interview questions)
-- ============================================================

insert into topics (id, task_type, question, theme, difficulty) values
  ('b2000000-0000-0000-0000-000000000001', 'tache2', 'Vous allez interviewer quelqu''un sur ses habitudes sportives.', 'Sport', 'B1'),
  ('b2000000-0000-0000-0000-000000000002', 'tache2', 'Vous allez interviewer quelqu''un sur son rapport aux voyages.', 'Voyages', 'B1'),
  ('b2000000-0000-0000-0000-000000000003', 'tache2', 'Vous allez interviewer quelqu''un sur sa vie professionnelle au Canada.', 'Travail', 'B2'),
  ('b2000000-0000-0000-0000-000000000004', 'tache2', 'Vous allez interviewer quelqu''un sur ses habitudes alimentaires.', 'Alimentation', 'B1'),
  ('b2000000-0000-0000-0000-000000000005', 'tache2', 'Vous allez interviewer quelqu''un sur son utilisation des réseaux sociaux.', 'Technologie', 'B1');

-- ============================================================
-- IDEAS — Téléphone portable (tache3 topic 1)
-- ============================================================

insert into ideas_bank (topic_id, idea, ready_sentence, position, sample_opinion) values
  ('a1000000-0000-0000-0000-000000000001',
   'le téléphone facilite la communication',
   'À mon avis, le téléphone portable facilite la communication, surtout dans la vie quotidienne.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000001',
   'accès rapide à l''information',
   'Grâce au téléphone, on peut accéder à toutes les informations en quelques secondes.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000001',
   'utile en cas d''urgence',
   'Le téléphone est vraiment indispensable en cas d''urgence, par exemple pour appeler les secours.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000001',
   'crée une dépendance',
   'Cependant, beaucoup de gens sont devenus dépendants de leur téléphone et ne peuvent plus s''en passer.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000001',
   'nuit aux relations sociales en face à face',
   'De plus, le téléphone nuit parfois aux relations sociales car les gens préfèrent regarder leur écran.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000001',
   'problèmes de concentration',
   'Les notifications constantes créent des problèmes de concentration, surtout pour les étudiants.',
   'contre',
   'Personnellement, je pense que le téléphone portable est indispensable dans notre société moderne. D''une part, il facilite énormément la communication et nous permet d''accéder à l''information instantanément. D''autre part, il est vrai que certaines personnes en sont trop dépendantes. En conclusion, je crois qu''il faut apprendre à utiliser cet outil de manière équilibrée.');

-- ============================================================
-- IDEAS — Télétravail (tache3 topic 2)
-- ============================================================

insert into ideas_bank (topic_id, idea, ready_sentence, position, sample_opinion) values
  ('a1000000-0000-0000-0000-000000000002',
   'économise du temps de transport',
   'Le télétravail permet d''économiser beaucoup de temps car on n''a pas besoin de se déplacer.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000002',
   'meilleur équilibre vie pro/perso',
   'Travailler depuis chez soi offre un meilleur équilibre entre la vie professionnelle et personnelle.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000002',
   'réduit le stress du bureau',
   'Beaucoup de personnes trouvent qu''elles sont moins stressées quand elles travaillent à domicile.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000002',
   'sentiment d''isolement',
   'Toutefois, le télétravail peut créer un sentiment d''isolement et nuire au travail en équipe.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000002',
   'difficile de séparer travail et vie privée',
   'Il est souvent difficile de séparer le travail et la vie privée quand on travaille à la maison.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000002',
   'pas adapté à tous les métiers',
   'Le télétravail n''est pas possible pour tous les métiers, par exemple pour les médecins ou les enseignants.',
   'contre',
   'À mon avis, le télétravail présente de nombreux avantages, notamment pour la qualité de vie. Cependant, je ne pense pas qu''il devrait être le mode de travail principal pour tout le monde, car certains métiers nécessitent une présence physique et le contact humain reste essentiel pour la cohésion d''équipe.');

-- ============================================================
-- IDEAS — Réseaux sociaux (tache3 topic 3)
-- ============================================================

insert into ideas_bank (topic_id, idea, ready_sentence, position, sample_opinion) values
  ('a1000000-0000-0000-0000-000000000003',
   'propager de fausses informations',
   'Les réseaux sociaux permettent malheureusement aux fausses informations de se propager très rapidement.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000003',
   'effets négatifs sur la santé mentale',
   'De nombreuses études montrent que l''utilisation excessive des réseaux sociaux affecte la santé mentale.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000003',
   'cyberharcèlement',
   'Le cyberharcèlement est un problème grave qui touche de nombreux jeunes sur les réseaux sociaux.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000003',
   'connecter les gens du monde entier',
   'D''un autre côté, les réseaux sociaux permettent de connecter des personnes du monde entier.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000003',
   'outil de mobilisation sociale',
   'Ils servent aussi de puissant outil pour les mouvements sociaux et les causes importantes.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000003',
   'partage d''informations utiles',
   'Les réseaux sociaux facilitent le partage d''informations utiles, surtout en cas de crise.',
   'pour',
   'Je pense que les réseaux sociaux sont un outil ambivalent. Ils peuvent faire du bien quand ils servent à informer ou connecter les gens, mais ils peuvent aussi faire beaucoup de mal à cause des fausses informations et du harcèlement. Tout dépend de la façon dont on les utilise.');

-- ============================================================
-- IDEAS — Voitures en centre-ville (tache3 topic 4)
-- ============================================================

insert into ideas_bank (topic_id, idea, ready_sentence, position, sample_opinion) values
  ('a1000000-0000-0000-0000-000000000004',
   'réduire la pollution de l''air',
   'Interdire les voitures en centre-ville permettrait de réduire considérablement la pollution de l''air.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000004',
   'améliorer la qualité de vie des piétons',
   'Les rues sans voitures seraient plus agréables et plus sécuritaires pour les piétons et les cyclistes.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000004',
   'encourager les transports en commun',
   'Cette mesure encouragerait les gens à utiliser davantage les transports en commun.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000004',
   'difficile pour les personnes à mobilité réduite',
   'Cependant, cette interdiction poserait des problèmes pour les personnes âgées ou à mobilité réduite.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000004',
   'impact négatif sur les commerces',
   'Certains commerçants craignent de perdre des clients si les voitures sont interdites près de leurs boutiques.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000004',
   'transports en commun pas toujours suffisants',
   'Pour que ça fonctionne, il faudrait d''abord améliorer les transports en commun, qui sont insuffisants dans certaines villes.',
   'contre',
   'Personnellement, je suis favorable à cette idée, mais de façon progressive. Il faut d''abord investir dans les transports en commun avant d''interdire les voitures, sinon les gens n''auront pas d''alternative viable.');

-- ============================================================
-- IDEAS — Sport et santé mentale (tache3 topic 6)
-- ============================================================

insert into ideas_bank (topic_id, idea, ready_sentence, position, sample_opinion) values
  ('a1000000-0000-0000-0000-000000000006',
   'libère des endorphines',
   'Le sport libère des endorphines qui améliorent naturellement notre humeur et réduisent le stress.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000006',
   'améliore la qualité du sommeil',
   'Faire du sport régulièrement améliore la qualité du sommeil, ce qui est essentiel pour la santé mentale.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000006',
   'crée des liens sociaux',
   'La pratique sportive en groupe permet de créer des liens sociaux et de lutter contre la solitude.',
   'pour', null),
  ('a1000000-0000-0000-0000-000000000006',
   'risque de blessure',
   'Cependant, le sport intensif peut provoquer des blessures qui ont un impact négatif sur le moral.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000006',
   'pas accessible à tous',
   'L''accès au sport n''est pas égal pour tout le monde, notamment pour des raisons financières.',
   'contre', null),
  ('a1000000-0000-0000-0000-000000000006',
   'd''autres activités sont aussi bénéfiques',
   'D''autres activités comme la méditation ou la lecture peuvent aussi être très bénéfiques pour la santé mentale.',
   'contre',
   'Je crois fermement que le sport est excellent pour la santé mentale. Dans ma propre expérience, faire de l''exercice régulièrement m''aide à gérer le stress et à me sentir plus positif. Bien sûr, ce n''est pas la seule solution, mais c''est l''une des plus accessibles et des plus efficaces.');

-- ============================================================
-- IDEAS for Tâche 2 — Sport (b2 topic 1)
-- ============================================================

insert into ideas_bank (topic_id, idea, ready_sentence, position) values
  ('b2000000-0000-0000-0000-000000000001',
   'fréquence de pratique',
   'Combien de fois par semaine faites-vous du sport ?',
   'neutral'),
  ('b2000000-0000-0000-0000-000000000001',
   'sport préféré',
   'Quel est votre sport préféré et pourquoi ?',
   'neutral'),
  ('b2000000-0000-0000-0000-000000000001',
   'motivation',
   'Qu''est-ce qui vous motive à continuer même quand vous êtes fatigué ?',
   'neutral');

-- ============================================================
-- TEMPLATES
-- ============================================================

insert into templates (task_type, title, content, order_index) values
  ('tache3', '📌 Introduction', 'Personnellement, je pense que [sujet] est un sujet très important dans notre société.
Je vais vous donner deux raisons principales qui expliquent mon point de vue.', 1),
  ('tache3', '1️⃣ Premier argument', 'Premièrement, [argument principal].
Par exemple, [exemple concret de la vie quotidienne].
C''est pourquoi je considère que...', 2),
  ('tache3', '2️⃣ Deuxième argument', 'Deuxièmement, et c''est tout aussi important, [deuxième argument].
En effet, [développement et explication].
Cela montre clairement que...', 3),
  ('tache3', '🏁 Conclusion', 'En conclusion, je suis convaincu(e) que [votre position finale].
Pour toutes ces raisons, [résumé en une phrase].
Et vous, qu''en pensez-vous ?', 4),
  ('tache2', '👋 Ouverture polie', 'Bonjour ! Je vais vous poser quelques questions sur [thème], si vous permettez.', 1),
  ('tache2', '❓ 13 questions types', '1. Depuis combien de temps vous intéressez-vous à ce sujet ?
2. Qu''est-ce qui vous a attiré vers cela au départ ?
3. Comment vous êtes-vous préparé(e) ?
4. Quels sont selon vous les principaux avantages ?
5. Y a-t-il des inconvénients ou des difficultés ?
6. À quelle fréquence pratiquez-vous / faites-vous cela ?
7. Où le faites-vous en général ?
8. Le faites-vous seul(e) ou avec d''autres personnes ?
9. Qu''est-ce que cela vous apporte dans votre vie ?
10. Avez-vous rencontré des obstacles au début ?
11. Que conseilleriez-vous à quelqu''un qui voudrait débuter ?
12. Est-ce que cela a changé votre quotidien d''une façon ou d''une autre ?
13. Quels sont vos projets ou objectifs pour l''avenir dans ce domaine ?', 2),
  ('tache2', '🤝 Clôture', 'Merci beaucoup pour vos réponses, c''était très intéressant !
Vous m''avez donné beaucoup à réfléchir sur ce sujet.', 3);
