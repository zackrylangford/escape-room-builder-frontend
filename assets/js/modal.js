// Javascript for all modals

export function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}

export function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}

export function setupModal(modalId) {
    const modal = document.getElementById(modalId);

    // Close modal when clicking the close icon (X)
    const closeIcons = modal.getElementsByClassName('modal-close');
    for (let icon of closeIcons) {
        icon.addEventListener('click', function() {
            hideModal(modalId);
        });
    }

    // Close modal when clicking outside the modal (on the overlay)
    document.getElementById('modalOverlay').addEventListener('click', function() {
        hideModal(modalId);
    });

    // Optional: Prevent clicks inside the modal from closing it
    document.querySelector(`#${modalId} .modal-content`).addEventListener('click', function(event) {
        event.stopPropagation();
    });
}
