// ===== ATTENDRE QUE LA PAGE SOIT COMPLÈTEMENT CHARGÉE =====
// window.addEventListener écoute l'événement 'load'
// Cet événement se déclenche quand TOUT est chargé (HTML, CSS, images, etc.)
window.addEventListener('load', function() {
  
  // ===== 1. RÉCUPÉRER LE CONTENEUR HTML =====
  // On récupère l'élément HTML où on va injecter notre scène 3D
  // C'est la div avec id="mainImage" dans ton HTML
  const container = document.getElementById('mainImage');
  
  
  // ===== 2. CRÉER LA SCÈNE 3D =====
  // La scène est le "monde" 3D - un conteneur pour tous tes objets 3D
  const scene = new THREE.Scene();
  
  // Définir la couleur de fond de la scène (0xf7f8fa = gris très clair en hexadécimal)
  scene.background = new THREE.Color(0xffffff);
  
  
  // ===== 3. CRÉER LA CAMÉRA =====
  // La caméra détermine ce que l'utilisateur voit et comment
  const camera = new THREE.PerspectiveCamera(
    50,  // FOV (Field of View) = angle de vision en degrés (comme un zoom)
         // Plus petit = zoom, plus grand = grand angle
    
    container.clientWidth / container.clientHeight,  // Aspect ratio (largeur / hauteur)
                                                      // Important pour éviter la déformation
    
    0.1,   // Near plane = distance minimum de rendu (objets trop proches sont invisibles)
    1000   // Far plane = distance maximum de rendu (objets trop loin sont invisibles)
  );
  
  // Positionner la caméra dans l'espace 3D
  // set(x, y, z) où x=gauche/droite, y=haut/bas, z=avant/arrière
  camera.position.set(0, 0, 3); // Caméra à 3 unités devant l'origine (0,0,0)
  
  
  // ===== 4. CRÉER LE RENDERER (MOTEUR DE RENDU) =====
  // Le renderer dessine la scène dans le navigateur
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true  // Antialiasing = lisse les bords dentelés (meilleure qualité visuelle)
  });
  
  // Définir la taille du rendu (même taille que le conteneur)
  renderer.setSize(container.clientWidth, container.clientHeight);
  
  // Adapter au pixel ratio de l'écran (important pour les écrans haute résolution/Retina)
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Vider le conteneur HTML (enlève le texte "[3D Model Here]")
  container.innerHTML = '';
  
  // Ajouter le canvas du renderer dans le conteneur HTML
  // Le renderer crée un élément <canvas> qu'on insère dans la page
  container.appendChild(renderer.domElement);
  
  
  // ===== 5. AJOUTER LES CONTRÔLES INTERACTIFS =====
  // OrbitControls permet à l'utilisateur d'interagir avec la caméra
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  // enableDamping = ajoute de l'inertie (mouvement fluide qui ralentit progressivement)
  controls.enableDamping = true;
  
  // dampingFactor = force de l'inertie (plus petit = plus de glisse)
  controls.dampingFactor = 0.05;
  
  // enableZoom = permet le zoom avec la molette de la souris
  controls.enableZoom = true;
  
  // autoRotate = fait tourner automatiquement le modèle
  controls.autoRotate = true;
  
  // autoRotateSpeed = vitesse de rotation automatique (plus grand = plus rapide)
  controls.autoRotateSpeed = 1;
  controls.enablePan = false;
  
  
  // ===== 6. AJOUTER LES LUMIÈRES =====
  // Sans lumières, les objets seraient complètement noirs
  
  // LUMIÈRE AMBIANTE
  // Éclaire tous les objets uniformément depuis toutes les directions
  // C'est comme la lumière du jour qui vient de partout
  const ambientLight = new THREE.AmbientLight(
    0xffffff,  // Couleur de la lumière (blanc)
    0.6        // Intensité (0 = éteint, 1 = pleine puissance)
  );
  scene.add(ambientLight);  // Ajouter la lumière à la scène
  
  // LUMIÈRE DIRECTIONNELLE 1
  // Éclaire dans une direction précise (comme le soleil)
  // Crée des ombres et du relief
  const directionalLight1 = new THREE.DirectionalLight(
    0xffffff,  // Couleur blanche
    0.8        // Intensité
  );
  // Positionner la lumière en haut à droite devant (x=5, y=5, z=5)
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);
  
  // LUMIÈRE DIRECTIONNELLE 2
  // Seconde lumière pour éclairer les zones d'ombre
  const directionalLight2 = new THREE.DirectionalLight(
    0xffffff,  // Couleur blanche
    0.4        // Intensité plus faible que la première
  );
  // Positionner en haut à gauche derrière (x=-5, y=3, z=-5)
  directionalLight2.position.set(-5, 3, -5);
  scene.add(directionalLight2);
  
  
  // ===== 7. CHARGER LE MODÈLE 3D =====
  // GLTFLoader est spécialisé pour charger les fichiers .glb et .gltf
  const loader = new THREE.GLTFLoader();
  
  // La méthode load() prend 4 paramètres (tous sont des fonctions callback)
  loader.load(
    // PARAMÈTRE 1: Chemin du fichier à charger
    './optimized.glb',
    
    // PARAMÈTRE 2: Fonction appelée quand le chargement RÉUSSIT
    function(gltf) {
      // gltf.scene contient le modèle 3D chargé
      const model = gltf.scene;
      
      // === CENTRER ET REDIMENSIONNER LE MODÈLE ===
      // Les modèles téléchargés ont souvent des tailles/positions aléatoires
      // On va calculer sa taille et le centrer
      
      // Box3 = boîte englobante qui contient tout le modèle
      const box = new THREE.Box3().setFromObject(model);
      
      // Calculer le centre de la boîte (point au milieu)
      const center = box.getCenter(new THREE.Vector3());
      
      // Calculer la taille de la boîte (largeur, hauteur, profondeur)
      const size = box.getSize(new THREE.Vector3());
      
      // Trouver la plus grande dimension (x, y ou z)
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // Calculer l'échelle pour que le modèle rentre bien dans la vue
      // 2 / maxDim = le modèle fera 2 unités de large/haut (ajustable)
      const scale = 2 / maxDim;
      
      // Appliquer l'échelle au modèle (agrandir ou rétrécir)
      model.scale.multiplyScalar(scale);
      
      // Centrer le modèle à l'origine (0, 0, 0)
      // On soustrait le centre du modèle pour le ramener au centre de la scène
      model.position.sub(center.multiplyScalar(scale));
      
      // Ajouter le modèle à la scène (maintenant il est visible)
      scene.add(model);
      
      // Message de confirmation dans la console
      console.log('Modèle chargé avec succès!');
    },
    
    // PARAMÈTRE 3: Fonction appelée pendant le chargement (progression)
    function(xhr) {
      // xhr.loaded = octets chargés, xhr.total = octets totaux
      // Calcul du pourcentage et affichage dans la console
      console.log(Math.round(xhr.loaded / xhr.total * 100) + '% chargé');
    },
    
    // PARAMÈTRE 4: Fonction appelée si le chargement ÉCHOUE
    function(error) {
      // Afficher l'erreur dans la console pour déboguer
      console.error('Erreur:', error);
    }
  );
  
  
  // ===== 8. BOUCLE D'ANIMATION =====
  // Pour que la scène soit vivante, on doit la redessiner en continu
  function animate() {
    // requestAnimationFrame appelle animate() environ 60 fois par seconde (60 FPS)
    // C'est comme une boucle infinie optimisée pour les animations
    requestAnimationFrame(animate);
    
    // Mettre à jour les contrôles (nécessaire pour le damping et l'autoRotate)
    controls.update();
    
    // Redessiner la scène vue par la caméra
    // C'est cette ligne qui affiche réellement l'image à l'écran
    renderer.render(scene, camera);
  }
  
  // Lancer la boucle d'animation
  animate();
  
  
  // ===== 9. GESTION DU RESPONSIVE =====
  // Quand la fenêtre est redimensionnée, adapter la scène 3D
  window.addEventListener('resize', function() {
    // Nouvelles dimensions du conteneur
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Mettre à jour l'aspect ratio de la caméra
    camera.aspect = width / height;
    
    // Dire à la caméra de recalculer sa matrice de projection
    // (nécessaire après avoir changé aspect)
    camera.updateProjectionMatrix();
    
    // Adapter la taille du renderer
    renderer.setSize(width, height);
  });
  
});