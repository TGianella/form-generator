import { Panel } from "@/app/components/Panel/Panel";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { ErrorObject } from "ajv";
import Button from "@mui/material/Button";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ResponseData } from "@/app/page";
import { Alert } from "@mui/material";
import { postFormData } from "@/lib/postFormData";
import { FormSkeleton } from "@/app/components/skeletons/FormSkeleton/FormSkeleton";
import { QuestionFormData } from "@/types/formData.types";
import { ResetButton } from "@/app/components/ResetButton/ResetButton";
import { ErrorAlert } from "@/app/components/ErrorAlert/ErrorAlert";

type ResponsePanelProps = {
  generatedFormDataSetter: Dispatch<SetStateAction<ResponseData>>;
  initialFormData: QuestionFormData;
  shouldFetchData: boolean;
  generatedFormSubmitted: boolean;
  generatedFormSubmittedSetter: Dispatch<SetStateAction<boolean>>;
  uidSetter: Dispatch<SetStateAction<string>>;
};

export const GeneratedFormPanel = ({
  generatedFormDataSetter,
  initialFormData,
  shouldFetchData,
  generatedFormSubmitted,
  generatedFormSubmittedSetter,
  uidSetter,
}: ResponsePanelProps) => {
  //@ts-expect-error
  const [formSchemas, setFormSchemas] = useState<ResponseData>({});
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const [isError, setIsError] = useState<Error | null>(null);

  useEffect(() => {
    if (shouldFetchData) {
      const fetchData = async () => {
        const response = await postFormData(
          initialFormData,
          setIsError,
          "question",
        );
        setFormSchemas(response);
        uidSetter(response.uid);
      };

      fetchData().catch(console.error);
    }
  }, [initialFormData, shouldFetchData, uidSetter]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (errors.length === 0) {
      generatedFormSubmittedSetter(true);
    }
  };

  let panelContent = (
    <p>Nothing to show yet, submit the request form first !</p>
  );

  if (shouldFetchData) {
    panelContent = <FormSkeleton />;
  }

  if (isError) {
    panelContent = <ErrorAlert />;
  }

  if (formSchemas?.schema) {
    panelContent = (
      <form onSubmit={handleSubmit}>
        <JsonForms
          schema={formSchemas.schema}
          uischema={formSchemas.uischema}
          data={formSchemas.data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            generatedFormDataSetter(data);
            setErrors(errors ? (errors as ErrorObject[]) : []);
          }}
        />
        <div className="flex gap-3">
          <Button type="submit">Submit</Button>
          <ResetButton>Reset</ResetButton>
        </div>
      </form>
    );
  }

  return (
    <Panel
      title="Fill the form"
      backgroundColorClass="bg-sky-200"
      success={generatedFormSubmitted}
    >
      {panelContent}
    </Panel>
  );
};
