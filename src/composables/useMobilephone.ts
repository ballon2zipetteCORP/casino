import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const useMobilePhone = () => {

    const angle = ref<number>(screen.orientation.angle);

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
        return (angle.value === 90|| angle.value === -90) ? "LANDSCAPE" : "PORTRAIT"; 
    });

    const updateAngle = () => () => {
        angle.value = screen.orientation.angle;
    }

    onBeforeUnmount(() => {
        window.removeEventListener("deviceorientation", updateAngle);
    })

    onMounted(() => {
        window.addEventListener("deviceorientation", updateAngle);
    })
    
    return {orientation, isOnMobilePhone};

}

export default useMobilePhone;