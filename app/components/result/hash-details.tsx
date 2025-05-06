import InputField from "./input-field";

interface HashDetailsProps {
  domainHash?: string;
  messageHash?: string;
  safeTxHash?: string;
  className?: string;
}

export default function HashDetails({
  domainHash = "",
  messageHash = "",
  safeTxHash = "",
  className = ""
}: HashDetailsProps) {
  return (
    <div className={`space-y-5 ${className}`}>
      <div className="border rounded-md p-4 space-y-3 dark:border-gray-200">
        <InputField label="Domain Hash" value={domainHash} isLong/>
        <InputField label="Message Hash" value={messageHash} isLong/>
        <InputField label="SafeTxHash" value={safeTxHash} isLong border={false}/>
      </div>
    </div>
  );
}