import { computed, ref } from "vue";

const useMobilePhone = () => {

    const isOnMobilePhone = ref<boolean>(
        /BlackBerry/i.test(navigator.userAgent) ||
        /Android/i.test(navigator.userAgent) ||
        /webOS/i.test(navigator.userAgent) ||
        /iPhone/i.test(navigator.userAgent) ||
        /iPad/i.test(navigator.userAgent) ||
        /iPod/i.test(navigator.userAgent) ||
        /BlackBerry/i.test(navigator.userAgent) ||
        /Windows Phone/i.test(navigator.userAgent)
    );

    const orientation = computed<"LANDSCAPE"|"PORTRAIT">(() => {
        const angle = screen.orientation.angle;
        return angle === 270 ? "LANDSCAPE" : "PORTRAIT"; 
    });
    
    return {orientation, isOnMobilePhone};

}

export default useMobilePhone;