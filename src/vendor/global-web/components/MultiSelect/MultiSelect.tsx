import type { CSSObjectWithLabel } from 'react-select';
import ReactSelect from 'react-select';
import styles from './MultiSelect.module.scss';

export interface MultiSelectOption {
  id: string;
  name: string;
  [key: string]: any;
}

export interface MultiSelectProps<T extends MultiSelectOption> {
  id?: string;
  value: T[];
  options: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  maxSelectedLabels?: number;
  maxSelection?: number;
  disabled?: boolean;
  className?: string;
  optionLabel?: string;
  itemTemplate?: (option: T) => React.ReactNode;
  selectedItemTemplate?: (option: T) => React.ReactNode;
  showSelectAll?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
}

interface ReactSelectOption {
  value: string;
  label: string;
  data: any;
}

interface MultiValueLabelProps {
  data: ReactSelectOption;
  selectedItemTemplate?: (option: any) => React.ReactNode;
}

const CustomMultiValueLabel = ({ data, selectedItemTemplate }: MultiValueLabelProps) => {
  const content = selectedItemTemplate ? selectedItemTemplate(data.data) : data.label;
  return <div>{content}</div>;
};

interface CustomMultiValueLabelWrapperProps {
  selectedItemTemplate?: (option: any) => React.ReactNode;
}

const CustomMultiValueLabelWrapper =
  ({ selectedItemTemplate }: CustomMultiValueLabelWrapperProps) =>
  (props: any) => (
    <CustomMultiValueLabel data={props.data} selectedItemTemplate={selectedItemTemplate} />
  );

export function MultiSelect<T extends MultiSelectOption>({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  maxSelection,
  disabled = false,
  className,
  optionLabel = 'name',
  itemTemplate,
  selectedItemTemplate,
  filter = true,
}: Readonly<MultiSelectProps<T>>) {
  // Convert options to react-select format
  const selectOptions: ReactSelectOption[] = options.map((option) => ({
    value: option.id,
    label: option[optionLabel] || option.name,
    data: option,
  }));

  // Convert selected value to react-select format
  const selectedValues: ReactSelectOption[] = value.map((v) => ({
    value: v.id,
    label: v[optionLabel] || v.name,
    data: v,
  }));

  const handleChange = (selectedOptions: readonly ReactSelectOption[] | null) => {
    const selectedArray = selectedOptions || [];

    // Enforce max selection limit if provided
    if (maxSelection && selectedArray.length > maxSelection) {
      return;
    }

    // Convert back to original format
    const result = selectedArray.map((option) => option.data) as T[];
    onChange(result);
  };

  const formatLabel = (option: ReactSelectOption): React.ReactNode => {
    if (itemTemplate) {
      return itemTemplate(option.data);
    }
    return option.label;
  };

  // Custom styles for theming
  const customStyles = {
    control: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: 'var(--precedent-color-background)',
      borderColor: 'var(--precedent-color-border)',
      color: 'var(--precedent-color-text)',
      borderRadius: 'var(--precedent-radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      minHeight: '40px',
      '&:focus-within': {
        borderColor: 'var(--precedent-color-primary)',
        boxShadow: '0 0 0 0.2rem var(--precedent-color-primary-muted)',
      },
    }),
    multiValue: (base: CSSObjectWithLabel) => ({
      ...base,
      background: ` var(--precedent-color-primary)`,
      borderRadius: '999px',
      padding: '0.25rem 0.5rem 0.25rem 1rem',
      fontSize: 'var(--precedent-font-size-text-sm)',
      display: 'inline-flex',
      alignItems: 'center',
      margin: '0.25rem',
      fontWeight: 500,
    }),
    multiValueLabel: (base: CSSObjectWithLabel) => ({
      ...base,
      color: 'var(--precedent-color-text)',
      fontWeight: 500,
      padding: '0',
      whiteSpace: 'nowrap' as const,
    }),
    multiValueRemove: (base: CSSObjectWithLabel) => ({
      ...base,
      padding: 'var(--precedent-space-2xs)',
      color: 'var(--precedent-color-text)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'var(--precedent-color-primary-hover)',
        color: 'var(--precedent-color-text)',
      },
    }),
    option: (base: CSSObjectWithLabel) => ({
      ...base,

      color: 'var(--precedent-color-text)',
      cursor: 'pointer',
      paddingRight: '0.75rem',
      '&:hover': {
        backgroundColor: 'var(--precedent-color-primary-muted)',
      },
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: 'var(--precedent-color-surface)',
      borderColor: 'var(--precedent-color-border)',
      boxShadow: 'var(--precedent-shadow-lg)',
      borderRadius: 'var(--precedent-border-radius-md)',
    }),
    menuList: (base: CSSObjectWithLabel) => ({
      ...base,
      maxHeight: '350px',
    }),
    input: (base: CSSObjectWithLabel) => ({
      ...base,
      color: 'var(--precedent-color-text)',
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
      ...base,
      fontSize: 'var(--precedent-font-size-text-md)',
      fontWeight: 400,
      color: 'var(--precedent-color-text-muted)',
    }),
  };

  return (
    <div className={`${styles.multiSelectContainer} ${className || ''}`}>
      <ReactSelect
        inputId={id}
        options={selectOptions}
        value={selectedValues}
        onChange={handleChange}
        isMulti
        isDisabled={disabled}
        isSearchable={filter}
        isClearable={false}
        placeholder={placeholder}
        styles={customStyles}
        formatOptionLabel={formatLabel}
        components={{
          MultiValueLabel: CustomMultiValueLabelWrapper({ selectedItemTemplate }),
        }}
        classNamePrefix="react-select"
      />
    </div>
  );
}
