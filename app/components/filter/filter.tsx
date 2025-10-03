import clsx from "clsx";
import { beniga } from "@/app/fonts";
import { useState } from "react";
import { CheckboxOne } from "@/app/components/ui/checkboxone";
import { RadioOne } from "@/app/components/ui/radioone";
import { ColorPicker } from "@/app/components/ui/colorpicker";
import { PriceRange } from "@/app/components/ui/pricerange";
import { SubmitButton } from "../ui/submitbutton";
import { ClearButton } from "../ui/clearbutton";

interface FilterProps {
  classname?: string;
  isModal?: boolean;
  onClose?: () => void;
}

const customColors = [
  { id: "custom-1", value: "black", color: "#000000" },
  { id: "custom-2", value: "white", color: "#FFFFFF" },
  { id: "custom-3", value: "gray", color: "#6B7280" },
  { id: "custom-4", value: "navy", color: "#1E3A8A" },
  { id: "custom-5", value: "brown", color: "#92400E" },
  { id: "custom-6", value: "orange", color: "#EA580C" },
];

export const Filter: React.FC<FilterProps> = ({
  classname,
  isModal,
  onClose,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleClearFilters = () => {
    setSelectedValues([]);
    setSelectedSize("");
    setSelectedGender("");
    setSelectedColor("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <>
      <div className={clsx("", classname)}>
        {isModal && (
          <div className="mb-4 flex justify-between">
            <h2 className={clsx(beniga.className, "text-lg font-bold")}>
              Фильтры
            </h2>
            <button onClick={onClose} className="text-2xl">
              &times;
            </button>
          </div>
        )}
        <PriceRange
          title="Цена"
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinChange={setMinPrice}
          onMaxChange={setMaxPrice}
        />
        <CheckboxOne
          title="Бренд"
          options={[
            { id: "1", label: "Adidas", value: "adidas" },
            { id: "2", label: "Nike", value: "nike" },
            { id: "3", label: "Puma", value: "puma" },
            { id: "4", label: "Reebok", value: "reebok" },
            { id: "5", label: "Under Armour", value: "underarmour" },
          ]}
          selectedValues={selectedValues}
          onChange={setSelectedValues}
        />
        <RadioOne
          title="Размер"
          name="size"
          options={[
            { id: "size-s", label: "S", value: "s" },
            { id: "size-m", label: "M", value: "m" },
            { id: "size-l", label: "L", value: "l" },
            { id: "size-xl", label: "XL", value: "xl" },
          ]}
          selectedValue={selectedSize}
          onChange={setSelectedSize}
        />
        <RadioOne
          title="Пол"
          name="gender"
          options={[
            { id: "males", label: "Males", value: "males" },
            { id: "females", label: "Females", value: "females" },
          ]}
          selectedValue={selectedGender}
          onChange={setSelectedGender}
        />
        <ColorPicker
          title="Цвет товара"
          colors={customColors}
          selectedValue={selectedColor}
          onChange={setSelectedColor}
        />
        <SubmitButton classname="mt-6" />
        <ClearButton onClick={handleClearFilters} classname="" />
        {isModal && (
          <button
            onClick={onClose}
            className="mt-4 w-full rounded-md bg-neutral-900 py-2 text-white"
          >
            Применить
          </button>
        )}
      </div>
    </>
  );
};