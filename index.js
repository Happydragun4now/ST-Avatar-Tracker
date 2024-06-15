// @ts-ignore
const { eventSource } = SillyTavern.getContext();

function updateOrCreateZoomedAvatar(imgSrc) {
    // Check if the zoomed_avatar div already exists
    let zoomedAvatarDiv = document.querySelector('.zoomed_avatar.draggable');

    if (zoomedAvatarDiv) {
        // If it exists, update the image sources
        let zoomedImage = zoomedAvatarDiv.querySelector('.zoomed_avatar_img');
        if (zoomedImage) {
            zoomedImage.setAttribute('src', imgSrc);
            zoomedImage.setAttribute('data-izoomify-url', imgSrc);
        }
        // Also update the 'forchar' and 'id' attributes of the div and control bar
        zoomedAvatarDiv.setAttribute('forchar', imgSrc);
        zoomedAvatarDiv.setAttribute('id', `zoomFor_${imgSrc}`);
        let dragGrabber = zoomedAvatarDiv.querySelector('.drag-grabber');
        if (dragGrabber) {
            dragGrabber.setAttribute('id', `zoomFor_${imgSrc}header`);
        }
    } else {
        // If it doesn't exist, create the HTML structure and append it to the body
        zoomedAvatarDiv = document.createElement('div');
        zoomedAvatarDiv.className = 'zoomed_avatar draggable';
        zoomedAvatarDiv.setAttribute('forchar', imgSrc);
        zoomedAvatarDiv.setAttribute('id', `zoomFor_${imgSrc}`);
        zoomedAvatarDiv.setAttribute('style', 'display: flex;');

        zoomedAvatarDiv.innerHTML = `
            <div class="panelControlBar flex-container">
                <div class="fa-fw fa-solid fa-grip drag-grabber" id="zoomFor_${imgSrc}header"></div>
                <div class="fa-fw fa-solid fa-circle-xmark dragClose" id="closeZoom"></div>
            </div>
            <div class="zoomed_avatar_container">
                <img class="zoomed_avatar_img" src="${imgSrc}" data-izoomify-url="${imgSrc}" data-izoomify-magnify="1.8" data-izoomify-duration="300" alt="">
            </div>
        `;

        // Append the new div to the body
        document.body.appendChild(zoomedAvatarDiv);
    }
}
let zoomedAvatarObserver = null;
// Function to re-add the zoomed_avatar if it gets removed
function ensureZoomedAvatarExists(imgSrc) {
    // Disconnect any existing observer
    if (zoomedAvatarObserver) {
        zoomedAvatarObserver.disconnect();
    }

    // Create a new observer
    zoomedAvatarObserver = new MutationObserver(() => {
        if (!document.querySelector('.zoomed_avatar.draggable')) {
            updateOrCreateZoomedAvatar(imgSrc);
        }
    });

    // Start observing the body for changes
    zoomedAvatarObserver.observe(document.body, { childList: true, subtree: true });
}

function UserZoom() {
    const selectedAvatar = document.querySelector('.avatar-container.selected');
    // Check if the selected avatar container exists
    if (selectedAvatar) {
        // Find the img element inside the selected avatar container
        const imgElement = selectedAvatar.querySelector('img');

        // Check if the img element exists
        if (imgElement) {
            // Get the src attribute from the img element
            const imgSrc = imgElement.getAttribute('src');
            if (imgSrc) {
                //Do stuff with the imgSrc
                updateOrCreateZoomedAvatar(imgSrc);
                ensureZoomedAvatarExists(imgSrc)
            } else {
                console.error('User avatar image source was null.');
            }
        } else {
            console.error('User avatar image element was null.');
        }
    } else {
        console.error('No selected user avatar container found.');
    }
}

function CharZoom() {
    //this will work if it's the last message, but what if it's not?
    const lastCharMsg = document.querySelector('.last_mes[is_user="false"]');
    if (lastCharMsg) {
        const charName = lastCharMsg.getAttribute('ch_name');
        if (charName) {
            const imgSrc = `/characters/${charName}.png`;
            try {
                updateOrCreateZoomedAvatar(imgSrc);
                ensureZoomedAvatarExists(imgSrc)
            } catch {
                console.error('Failed to update character Zoomed Avatar image.');
            }
        } else {
            console.error('Character Name not Found.');
        }
    } else {
        console.error('Last message not sent by a character.');
    }
}

//Triggers to change Avatar at automatic times.
eventSource.on('generation_started', CharZoom);
eventSource.on('generation_ended', UserZoom);
eventSource.on('chat_id_changed', UserZoom);

