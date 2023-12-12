// modal.js

export function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}

export function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}

export function setupModal(modalId, closeModalId) {
    // Close modal when clicking the close button
    document.getElementById(closeModalId).addEventListener('click', function() {
        hideModal(modalId);
    });

    // Close modal when clicking outside the modal (on the overlay)
    document.getElementById('modalOverlay').addEventListener('click', function() {
        hideModal(modalId);
    });

    // Optional: Prevent clicks inside the modal from closing it
    document.querySelector(`#${modalId} .modal-content`).addEventListener('click', function(event) {
        event.stopPropagation();
    });
}
