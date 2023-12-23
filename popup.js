document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
  
    // Vérifie si chrome.storage est défini avant d'accéder à chrome.storage.sync
    if (chrome.storage) {
      chrome.storage.sync.get('extensionEnabled', function(data) {
        const extensionEnabled = data.extensionEnabled || false;
  
        // Met à jour le texte du bouton en fonction de l'état de l'extension
        toggleButton.innerText = extensionEnabled ? 'Désactiver' : 'Activer';
  
        toggleButton.addEventListener('click', function() {
          // Inverse l'état de l'extension et met à jour le texte du bouton
          const newExtensionState = !extensionEnabled;
          toggleButton.innerText = newExtensionState ? 'Désactiver' : 'Activer';
  
          // Met à jour la valeur dans le stockage
          chrome.storage.sync.set({ extensionEnabled: newExtensionState });
  
          // Envoie un message à background.js pour informer de l'état de l'extension
          chrome.runtime.sendMessage({ type: 'extensionToggle', enabled: newExtensionState });
  
          // Ferme le popup après le clic sur le bouton
          window.close();
        });
      });
    } else {
      console.error("chrome.storage is undefined. Waiting for extension initialization.");
    }
  });
  
  function updatePopupStyle(darkModeEnabled) {
    const popupContainer = document.querySelector('.popup-container');
  
    // Supprime toutes les classes existantes
    popupContainer.classList.remove('dark-mode', 'light-mode');
  
    // Ajoute la classe correspondant au mode actuel
    popupContainer.classList.add(darkModeEnabled ? 'dark-mode' : 'light-mode');
  }
  