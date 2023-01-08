import BlobMessage from "../../components/BlobMessage";

interface BlobLayoutProps {
  message: string;
  children: React.ReactNode,
};


export default function BlobLayout(props: BlobLayoutProps) {
  return (
    <div className="flex w-full h-full items-center">
      <BlobMessage message={props.message} />
      {props.children}
    </div>
  );
}
