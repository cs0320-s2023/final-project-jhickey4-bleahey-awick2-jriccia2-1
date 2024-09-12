import { ChangeEvent, SetStateAction } from "react";
import { Mode } from "../types/Mode";
import { Metronome } from "@/scripts/metronome";
import { MODE_TEXT_STANDARD, MODE_TEXT_WATCH } from "@/resources/strings";

/**
 * The props for the ModeSelect component.
 * @interface
 * @prop {(watchMode: Mode) => void } setMode Sets the mode.
 */
interface ModeSelectProps {
  /**
   * Sets the mode.
   * @param {Mode} watchMode The mode to set.
   * @returns {void}
   */
  setMode: (watchMode: Mode) => void;
}

/**
 * A component that allows the user to select the mode.
 * @param props The props for the ModeSelect.
 * @returns {JSX.Element} A ModeSelect component.
 */
export default function ModeSelect(props: ModeSelectProps): JSX.Element {
  return (
    <select
      name="mode"
      defaultValue={"standard"}
      onChange={(event: ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === "watch") {
          props.setMode(Mode.Watch);
        } else {
          props.setMode(Mode.Standard);
        }
      }}
      className="dropdown hvr-grow"
    >
      <option value={Mode.Standard}>{MODE_TEXT_STANDARD}</option>
      <option value={Mode.Watch}>{MODE_TEXT_WATCH}</option>
    </select>
  );
}
