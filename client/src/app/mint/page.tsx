import styles from "./page.module.css";
import MintingForm from "./_components/minting-form/minting-form.component";

export default function MintPage() {
  return (
    <div className={"minting-container"}>
      <MintingForm />
    </div>
  );
}
