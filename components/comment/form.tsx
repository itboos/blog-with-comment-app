import {useUser} from "@auth0/nextjs-auth0/client";

type CommentFormProps = {
  text: string;
  setText: Function;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

export default function CommentForm({
  text,
  setText,
  onSubmit,
}: CommentFormProps) {
  const {user, isLoading} = useUser();
  const isAuthenticated = !isLoading && user;
  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="flex w-full max-h-40 p-3 rounded resize-y bg-gray-200 text-gray-900 placeholder-gray-500"
        rows={2}
        placeholder={
          isAuthenticated
            ? `What are your thoughts?`
            : "Please login to leave a comment"
        }
        onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={!isAuthenticated}
      />

      <div className="flex items-center mt-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-6">
            <button className="py-2 px-4 rounded bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700">
              Send
            </button>
            <button className="text-gray-500" onClick={() => {}}>
              <a href="/api/auth/logout"> Log Out</a>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="py-2 px-4 rounded bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700"
            onClick={() => {}}
          >
            <a href="/api/auth/login"> Log In</a>
          </button>
        )}
      </div>
    </form>
  );
}
