import {
  FormContextType,
  getSubmitButtonOptions,
  RJSFSchema,
  StrictRJSFSchema,
  SubmitButtonProps,
} from "@rjsf/utils";

export default function SubmitButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: SubmitButtonProps<T, S, F>) {
  const {
    submitText,
    norender,
    props: submitButtonProps,
  } = getSubmitButtonOptions<T, S, F>(props.uiSchema);

  if (norender) {
    return null;
  }
  console.log(props);

  return (
    <div>
      <button
        type="submit"
        className="bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 rounded-md"
        {...submitButtonProps}
      >
        Download
      </button>
    </div>
  );
}
