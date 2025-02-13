import { Dispatch, SetStateAction } from "react";
import SelectOption, {
  createSelectOptionsFromNumberArray,
} from "../types/SelectOption";
import Select, { SingleValue } from "react-select";
import { NUM_SONGS_SELECT_PLACEHOLDER } from "@/resources/strings";

/**
 * The props for the NumSongsSelect component.
 * @property {number} min The minimum number of songs that can be selected.
 * @property {number} max The maximum number of songs that can be selected.
 * @property {number} numSongs The number of songs selected.
 * @property {(numSongs: number) => void} setNumSongs The function to set the number of songs selected.
 */
interface NumSongsSelectProps {
  /**
   * The minimum number of songs that can be selected.
   */
  min: number;

  /**
   * The maximum number of songs that can be selected.
   */
  max: number;

  /**
   * The number of songs that are currently selected.
   */
  numSongs: number;

  /**
   * The function to set the number of songs selected.
   * @param {number} numSongs The new number of songs selected.
   * @returns {void}
   */
  setNumSongs: (numSongs: number) => void;
}

/**
 * Component for selecting the number of songs.
 * @param {NumSongsSelectProps} props Props for the NumSongsSelect.
 * @returns {JSX.Element} A NumSongsSelect component.
 */
export default function NumSongsSelect(
  props: NumSongsSelectProps
): JSX.Element {
  const numSongsOptions: SelectOption[] = createSelectOptionsFromNumberArray([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10, //TODO: use min and max
  ]);
  /**
   * The currently selected option.
   */
  const selectedOption: SelectOption | undefined = numSongsOptions.find(
    (option) => option.value === props.numSongs.toString()
  );

  /**
   * Handles the change of the number of songs.
   * @param {SingleValue<SelectOption>} newValue The new value of the number of songs.
   */
  function handleNumSongsChange(newValue: SingleValue<SelectOption>) {
    if (newValue) {
      const num = parseInt(newValue.value);
      props.setNumSongs(num);
    }
  }

  return (
    <Select
      isSearchable={false}
      name="genres"
      options={numSongsOptions}
      value={selectedOption}
      className="basic-select"
      classNamePrefix="select"
      placeholder={NUM_SONGS_SELECT_PLACEHOLDER}
      onChange={handleNumSongsChange}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "#3a3a3a",
          minWidth: "30ch",
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          color: "white",
        }),
      }}
    />
  );
}
