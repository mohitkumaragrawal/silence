export default function BlobMessage(props: { message: string }) {
  return (
    <div className="flex-1 bg-slate-800 h-5/6 m-4 rounded-lg hidden justify-center items-center text-4xl p-10 md:flex">
      {props.message}
    </div>
  );
}
