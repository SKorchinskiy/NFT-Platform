import MintingForm from "./_components/minting-form/minting-form.component";

export default function MintPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        padding: 50,
        boxSizing: "border-box",
      }}
    >
      <MintingForm />
    </div>
  );
}
