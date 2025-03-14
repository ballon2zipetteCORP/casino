import { ref } from "vue";

export function useSound(soundPath: string) {
  const audio = new Audio(soundPath);
  const isPlaying = ref(false);

  audio.load();

  const playSound = () => {
    if (!isPlaying.value) {
      isPlaying.value = true;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          isPlaying.value = false;
        })
        .catch((error) => console.error("Erreur de lecture audio:", error));
    }
  };

  return { playSound };
}
