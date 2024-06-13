// @ts-ignore
const { eventSource } = SillyTavern.getContext();
//For Characters, they can just click the last button and they should be good!
function ClickLastAvatar() {
    const avatar = document.querySelector('.last_mes .avatar');
    if (avatar) {
        // Check if .click() method exists and is callable
        if (typeof avatar.click === 'function') {
            avatar.click();
        } else {
            console.error("Click method not available on avatar element.");
        }
    } else {
        console.error("Avatar element not found.");
    }
}

//For Users, we need to get the user file and set it manually.
// @ts-ignore
//import {} from "../../../script.js";
function ClickUserAvatar() {
    try {
        const avatarImgs = document.querySelectorAll('.mes .avatar');
        const avatarLast = document.querySelector('.last_mes .avatar');
        if (avatarImgs.length > 0) {
            for (const avatar of avatarImgs) {
                if (avatar != avatarLast) {
                    avatar.click();
                }
                //console.error("Avatar: ", avatar);
            }
        }
    }
    catch {
        console.error("Error with finding last user avatar!");
    }
}

//Triggers to change Avatar at automatic times.
eventSource.on('generation_started', ClickLastAvatar);
eventSource.on('generation_ended', ClickUserAvatar);
//should have it's own that creates it the first time.
//eventSource.on('character_page_loaded', ClickLastUserAvatar);
