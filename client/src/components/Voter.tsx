import { BsFillCaretUpFill, BsFillCaretDownFill } from "react-icons/bs";

type VoterState = "upvoted" | "downvoted" | "notvoted";

interface VoterProps {
  votes: number;

  state: VoterState | string;

  onUpVote?: () => void;
  onDownVote?: () => void;
  onCancelVote?: () => void;
}

export default function Voter(props: VoterProps) {
  return (
    <div className="flex flex-col gap-1 font-2xl items-center">
      <button
        onClick={() => {
          if (props.state == "upvoted") {
            props.onCancelVote();
          } else {
            props.onUpVote();
          }
        }}
      >
        <BsFillCaretUpFill
          size={40}
          color={props.state == "upvoted" ? "orangered" : null}
        />
      </button>
      {props.votes}
      <button
        onClick={() => {
          if (props.state == "downvoted") {
            props.onCancelVote();
          } else {
            props.onDownVote();
          }
        }}
      >
        <BsFillCaretDownFill
          size={40}
          color={props.state == "downvoted" ? "orangered" : null}
        />
      </button>
    </div>
  );
}
