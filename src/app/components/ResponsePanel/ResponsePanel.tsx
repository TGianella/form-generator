import { Panel } from "@/app/components/Panel/Panel";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { ErrorObject } from "ajv";
import Button from "@mui/material/Button";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import InitialData from "@/app/components/RequestPanel/config/initialData.json";
import { ResponseData } from "@/app/page";

type ResponsePanelProps = {
  responseData: ResponseData;
  setFinalAnswer: Dispatch<SetStateAction<string>>;
};

const answerUrl = "https://mistralgagnant.alwaysdata.net/api/answer";

export const ResponsePanel = ({
  responseData,
  setFinalAnswer,
}: ResponsePanelProps) => {
  const [answerFormData, setAnswerFormData] = useState(InitialData);
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (errors.length === 0) {
      const formattedFormData = JSON.stringify({
        data: answerFormData,
        uid: responseData.uid,
      });
      try {
        const response = await fetch(answerUrl, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: formattedFormData,
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setFinalAnswer(json.answer);
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        console.error({ message });
      }
    }
  };

  return (
    <Panel title="Fill the form" backgroundColorClass="bg-sky-200">
      <form onSubmit={handleSubmit}>
        <JsonForms
          schema={responseData.schema}
          uischema={responseData.uischema}
          data={responseData.data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            setAnswerFormData(data);
            setErrors(errors ? (errors as ErrorObject[]) : []);
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Panel>
  );
};