let extensionEnabled = false;

chrome.runtime.onInstalled.addListener(function() {
  // Initialise l'état de l'extension à false lors de l'installation
  chrome.storage.sync.set({ extensionEnabled: false });
});

chrome.storage.sync.get('extensionEnabled', function(data) {
  extensionEnabled = data.extensionEnabled || false;

  // Ajoute ou supprime le gestionnaire d'événement en fonction de l'état de l'extension
  toggleWebNavigationListener();
});

// Fonction pour ajouter ou supprimer le gestionnaire d'événement en fonction de l'état de l'extension
function toggleWebNavigationListener() {
  if (extensionEnabled) {
    addWebNavigationListener();
  } else {
    removeWebNavigationListener();
  }
}

function addWebNavigationListener() {
  chrome.webNavigation.onCreatedNavigationTarget.addListener(onCreatedNavigationTarget);
}

function removeWebNavigationListener() {
  chrome.webNavigation.onCreatedNavigationTarget.removeListener(onCreatedNavigationTarget);
}

function onCreatedNavigationTarget(details) {
  // Ferme les onglets ouverts par le site sur lequel l'utilisateur se trouve
  chrome.tabs.remove(details.tabId);
}

// Écoute les événements provenant du popup ou d'autres parties de l'extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'extensionToggle') {
    extensionEnabled = request.enabled;

    // Met à jour l'état de l'extension dans le stockage
    chrome.storage.sync.set({ extensionEnabled: extensionEnabled });

    // Ajoute ou supprime le gestionnaire d'événement en fonction de l'état de l'extension
    toggleWebNavigationListener();
  }
});
