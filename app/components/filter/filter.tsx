import clsx from "clsx";
import { beniga } from "@/app/fonts";
import { useState, useEffect } from "react";
import { CheckboxOne } from "@/app/components/ui/checkboxone";
import { RadioOne } from "@/app/components/ui/radioone";
import { ColorPicker } from "@/app/components/ui/colorpicker";
import { PriceRange } from "@/app/components/ui/pricerange";
import { ClearButton } from "../ui/clearbutton";

export interface FilterValues {
  brands: string[];
  categories: string[];
  gender: string;
  color: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterProps {
  classname?: string;
  isModal?: boolean;
  onClose?: () => void;
  initialFilters?: Partial<FilterValues>;
  onApply: (filters: FilterValues) => void;
  onClearFilters?: () => void;
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
  initialFilters,
  onApply,
onClearFilters,
}) => {
  const [brands, setBrands] = useState(initialFilters?.brands || []);
  const [categories, setCategories] = useState(
    initialFilters?.categories || [],
  );
  const [gender, setGender] = useState(initialFilters?.gender || "");
  const [color, setColor] = useState(initialFilters?.color || "");
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || "");

  useEffect(() => {
    setBrands(initialFilters?.brands || []);
    setCategories(initialFilters?.categories || []);
    setGender(initialFilters?.gender || "");
    setColor(initialFilters?.color || "");
    setMinPrice(initialFilters?.minPrice || "");
    setMaxPrice(initialFilters?.maxPrice || "");
  }, [initialFilters]);

  const brandOptions = [
    { id: "1", label: "Adidas", value: "adidas" },
    { id: "2", label: "Nike", value: "nike" },
    { id: "3", label: "Puma", value: "puma" },
    { id: "4", label: "Reebok", value: "reebok" },
    { id: "5", label: "Under Armour", value: "under armour" },
  ];

  const categoryOptions = [
    { id: "cat-1", label: "Running", value: "running" },
    { id: "cat-2", label: "Football", value: "football" },
    { id: "cat-3", label: "Basketball", value: "basketball" },
    { id: "cat-4", label: "Walking", value: "walking" },
    { id: "cat-5", label: "Golf", value: "golf" },
  ];

  const handleClear = () => {
    setBrands([]);
    setCategories([]);
    setGender("");
    setColor("");
    setMinPrice("");
    setMaxPrice("");
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const handleApply = () => {
    onApply({
      brands,
      categories,
      gender,
      color,
      minPrice,
      maxPrice,
    });
    if (isModal && onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className={clsx("", classname)}>
        {isModal && (
          <div className="mb-4 flex justify-between">
            <h2 className={clsx(beniga.className, "text-lg font-bold")}>
              Filters
            </h2>
            <button onClick={onClose} className="text-2xl">
              &times;
            </button>
          </div>
        )}
        <PriceRange
          title="Price"
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinChange={setMinPrice}
          onMaxChange={setMaxPrice}
        />
        <CheckboxOne
          title="Brand"
          options={brandOptions}
          selectedValues={brands}
          onChange={setBrands}
        />
        <CheckboxOne
          title="Category"
          options={categoryOptions}
          selectedValues={categories}
          onChange={setCategories}
        />
        <RadioOne
          title="Gender"
          name="gender"
          options={[
            { id: "males", label: "Males", value: "males" },
            { id: "females", label: "Females", value: "females" },
          ]}
          selectedValue={gender}
          onChange={setGender}
        />
        <ColorPicker
          title="Product Color"
          colors={customColors}
          selectedValue={color}
          onChange={setColor}
        />
        <button
          onClick={handleApply}
          className="mt-6 w-full rounded-md bg-neutral-900 py-2 text-white"
        >
          Apply Filters
        </button>
        <ClearButton onClick={handleClear} classname="mt-2" />
      </div>
    </>
  );
};