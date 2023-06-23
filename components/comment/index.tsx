import CommentForm from "./form";
import CommentList from "./list";
import useComments from "../../hooks/useComment";

export default function Comment() {
  const {text, setText, comments, onSubmit, onDelete} = useComments();
  console.log("comments2:", comments);

  const usedCommits = Array.isArray(comments) ? comments : [];

  return (
    <div className="mt-20">
      <CommentForm onSubmit={onSubmit} text={text} setText={setText} />
      <CommentList comments={usedCommits} onDelete={onDelete} />
    </div>
  );
}
