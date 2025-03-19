import { ref } from "vue";

interface IPlaySoundParams {
  volume?: number;
}

export function useSound(soundPath: string) {
  const audio = new Audio(soundPath);
  const isPlaying = ref(false);

  audio.load();

  const playSound = (params?: IPlaySoundParams) => {
    if (!isPlaying.value) {
      isPlaying.value = true;

      if(params && params.volume) {
        audio.volume = params.volume;
      }
      
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
