import { useEffect, useState } from 'react';
import styles from './AddressInput.module.scss';

// Wireframe clone: the source wraps Google Places Autocomplete
// (useGooglePlacesAutocomplete) and renders a debounced predictions dropdown.
// The clone has no Google Maps integration, so this is a plain labeled text
// input that reports the typed string. Coordinates / placeId are never produced
// here. The container / label / input classNames match the source so styling is
// shared; the predictions markup is dropped along with the API.

export interface AddressDetails {
  latitude?: number;
  longitude?: number;
  placeId?: string;
}

export interface AddressInputProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (address: string, details?: AddressDetails) => void;
  readonly onBlur?: () => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export function AddressInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Enter an address',
  disabled = false,
}: Readonly<AddressInputProps>) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete="off"
      />
    </div>
  );
}
