import CreditCardForm from "@/components/CreditCardForm";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

const ErrorComponent = ({ error }: { error: Error }) => {
  return <div>Something went wrong: {error.message}</div>;
};
 
export default function Subscribe ()  {
  return (<><div>Subscribe Page</div>
  
<ErrorBoundary errorComponent={ErrorComponent}>
      <CreditCardForm />
    </ErrorBoundary>

  </>
  );
};
