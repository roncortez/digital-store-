import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryFilter";
import ConditionFilter from "./ConditionFilter";

export default function FilterSection() {
    return (
        <div className="mt-10 flex flex-col gap-4">
            <CategoryFilter selectedCategories={[]} onCategoryChange={() => { }} />
            <ConditionFilter selectedConditions={[]} onConditionChange={() => { }} />
            <BrandFilter selectedBrands={[]} onBrandChange={() => { }} />
        </div>
    )
}