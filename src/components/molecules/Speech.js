import { useSpeechSynthesis } from "react-speech-kit";
import VoiceOverOffIcon from "@mui/icons-material/VoiceOverOff";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { ListItemIcon, MenuItem } from "@mui/material";

const Speech = ({ text }) => {
  const { speak, voices, cancel } = useSpeechSynthesis();
  const voice = voices.find((voice) => voice.lang === "es-UK");
  const handleSpeak = () => {
    speak({ text, voice, rate: 0.9 });
  };
  const handleStopSpeaking = () => {
    cancel();
  };
  return (
    <>
      <MenuItem onClick={handleSpeak}>
        <ListItemIcon>
          <RecordVoiceOverIcon />
        </ListItemIcon>
        Llamar paciente
      </MenuItem>
      <MenuItem onClick={handleStopSpeaking}>
        <ListItemIcon>
          <VoiceOverOffIcon />
        </ListItemIcon>
        Detener llamada
      </MenuItem>
    </>
  );
};

export default Speech;
