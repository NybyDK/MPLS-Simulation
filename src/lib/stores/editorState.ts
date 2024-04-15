import { writable } from "svelte/store";

const editorState: {
  placing: null | "CE" | "LSR" | "LER";
} = {
  placing: null,
};

export default writable(editorState);
