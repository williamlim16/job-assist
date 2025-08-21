import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

type FormInputProps = {
  label: string;
  description: string | undefined;
  errors: string[] | undefined;
  inputProps?: React.InputHTMLAttributes<HTMLTextAreaElement>;
  required: boolean;
};

export function FormTextArea({
  label,
  inputProps,
  description,
  errors,
  required,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="mt-1">
        <Textarea {...inputProps} />
        {description ? (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        ) : null}
        {errors ? <p className="text-xs text-red-400">{errors}</p> : null}
      </div>
    </div>
  );
}
