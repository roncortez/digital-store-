interface CheckBoxProps {
    checked: boolean;
    onChange: () => void;
}


export default function Checkbox({ checked, onChange }: CheckBoxProps) {
    return (
        <div>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
        </div>
    )
}